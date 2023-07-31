import {createRef, FC, RefObject, useCallback, useEffect, useState} from "react";
import styles from "./ContentsPlayer.module.scss";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";
import {CanvasWork, getCanvasWork} from "../CanvasWorks/CanvasWork";
import {Work} from "../../types/Work";
import {createImageLoader} from "../../TonkatsuDisplayLib/ImageLoader/ImageLoader";

type Props = {
    work: Work
}

const CanvasWorkContent: FC<Props> = (props) => {

    const {work} = props;
    const [isLoadComplete, setIsLoadComplete] = useState<boolean>(false);

    //Canvas 要素とその ref のリストを作る
    const canvasRefsCallbacks: ((node: HTMLCanvasElement) => void)[] = [];
    let layerSettings: {
        name: string,
        zIndex: number
    }[];
    if (work.gameWorkOptions) {
        layerSettings = work.gameWorkOptions.canvasLayers;
    } else {
        layerSettings = [{
            name: "",
            zIndex: 0,
        }]
    }

    const canvasRefs:(HTMLCanvasElement | null)[] = [];
    for (let i = 0; i < layerSettings.length; i++) {
        canvasRefsCallbacks[i] = useCallback((node: HTMLCanvasElement) => {
            if(node !== null){
                canvasRefs[i] = node;
            }
        }, []);
        canvasRefs.push(null);
    }
    let i = 0;
    const canvases = layerSettings.map(layer => {
        const canvas = <canvas
            key={"CanvasLayer_" + layer.name}
            ref={canvasRefsCallbacks[i]}
            width={work.width}
            height={work.height}
            style={{
                maxWidth: "100%",
                maxHeight: "100%",
                position: "absolute",
                top: 0,
                left: 0,
            }}
        >
        </canvas>;
        i++;
        return canvas;
    });
    const loader = <img
        src={work.path}
        key="loader"
        alt={work.description}
        style={{
            width: work.width,
            height: work.height,
            maxWidth: "100%",
            maxHeight: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none"
        }}
    />;

    //CanvasWork 開始の副作用
    useEffect(() => {

        if (canvasRefs.length === 0 || canvasRefs.filter(ref=>ref).length < canvasRefsCallbacks.length) return;
        //Canvas の Ref を取得して CanvasLayer オブジェクトを作る
        let layers: CanvasLayer[] = [];
        canvasRefs.forEach(canvasRef => {
            if (!canvasRef) return undefined;
            const ctx = canvasRef.getContext("2d");
            if (!ctx) return undefined;
            layers.push(new CanvasLayer({
                canvas: canvasRef,
                context: ctx,
                width: work.width,
                height: work.height,
                autoRefresh: true
            }));
        });
        if (layers.length === 0) return;

        //画像があったらロードして、完了したら CanvasWork を作る
        let canvasWork: CanvasWork | null;
        if (work.gameWorkOptions && work.gameWorkOptions.imageList && work.gameWorkOptions.imageList.length > 0) {
            setIsLoadComplete(true);
            const frameRate = work.gameWorkOptions.frameRate;
            const imageLoader = createImageLoader(work.gameWorkOptions.imageList, work.gameWorkOptions.imageRoot || "");
            imageLoader.load(imageList => {
                canvasWork = getCanvasWork(work.id.toString(), frameRate, layers, imageList);
            }, () => {
                if (canvasWork) return;
                canvasWork = getCanvasWork(work.id.toString(), frameRate, layers, []);
            });
        } else {
            setIsLoadComplete(true);
            canvasWork = getCanvasWork(work.id.toString(), 24, layers, []);
        }

        return () => {
            //アンマウント
            if (canvasWork) {
                canvasWork.destruct();
            }
        };
    }, [isLoadComplete])


    return (
        <div
            key={"CanvasWorkContainer_" + work.id}
            className={styles.imageCanvasContainer}
            style={{
                maxHeight: "80vh",
                maxWidth: "80%",
                aspectRatio: work.width + " / " + work.height,
                margin: "auto",
                position: "relative",
                padding: 0,
            }}
        >
            {canvases}
            {isLoadComplete ? null : loader}
        </div>
    );
}

export default CanvasWorkContent;