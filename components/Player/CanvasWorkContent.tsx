import {createRef, FC, RefObject, useEffect, useRef} from "react";
import styles from "./ContentsPlayer.module.scss";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";
import {CanvasWork, getCanvasWork} from "../CanvasWorks/CanvasWork";
import {Work} from "../../types/Work";
import {createImageLoader} from "../../TonkatsuDisplayLib/ImageLoader/ImageLoader";

type Props = {
    work: Work,
}

const CanvasWorkContent: FC<Props> = (props) => {

    const {work} = props;

    //Canvas 要素とその ref のリストを作る
    const canvasRefs = useRef<RefObject<HTMLCanvasElement>[]>([]);
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

    for (let i = 0; i < layerSettings.length; i++) {
        canvasRefs.current[i] = createRef<HTMLCanvasElement>();
    }
    let i = 0;
    const canvases = layerSettings.map(layer => {
        const canvas = <canvas
            key={"CanvasLayer_" + layer.name}
            ref={canvasRefs.current[i]}
            width={work.width}
            height={work.height}
            style={{
                maxWidth: "100%",
                maxHeight: "100%",
                position: "absolute",
                top: 0,
                left: 0,
            }}
            title={layer.name}
        >
        </canvas>;
        i++;
        return canvas;
    });

    //ローダー
    //ref が null になるバグが発生したので、ひとまず不使用
    const loaderRef = useRef<HTMLImageElement>(null);
    const loader = <img
        ref={loaderRef}
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

        if (!canvasRefs.current || canvasRefs.current.length === 0) return;

        //Canvas の Ref を取得して CanvasLayer オブジェクトを作る
        let layers: CanvasLayer[] = [];
        canvasRefs.current.forEach(canvasRef => {
            if (!canvasRef.current) return undefined;
            const ctx = canvasRef.current.getContext("2d");
            if (!ctx) return undefined;
            layers.push(new CanvasLayer({
                name: canvasRef.current.getAttribute("title") || "",
                canvas: canvasRef.current,
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
            const frameRate = work.gameWorkOptions.frameRate;
            const imageLoader = createImageLoader(work.gameWorkOptions.imageList, work.gameWorkOptions.imageRoot || "");
            imageLoader.load(imageList => {
                if (loaderRef.current) {
                    loaderRef.current.style.display = "none";
                }
                canvasWork = getCanvasWork(work.id.toString(), frameRate, layers, imageList);
            }, () => {
                if (canvasWork) return;
                canvasWork = getCanvasWork(work.id.toString(), frameRate, layers, []);
            });
        } else {
            if (loaderRef.current) {
                loaderRef.current.style.display = "none";
            }
            canvasWork = getCanvasWork(work.id.toString(), 24, layers, []);
        }


        return () => {
            //アンマウント
            if (canvasWork) {
                canvasWork.destruct();
            }
        };
    }, [])


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
            {loader}
        </div>
    );
}

export default CanvasWorkContent;