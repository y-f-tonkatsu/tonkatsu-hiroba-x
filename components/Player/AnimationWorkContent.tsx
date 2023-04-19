import {FC, useEffect, useRef} from "react";
import styles from "./ContentsPlayer.module.scss";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";
import {getAnimationWork} from "../AnimationWorks/AnimationWorks";
import {GameLoop} from "../../TonkatsuDisplayLib/GameLoop/GameLoop";
import {Work} from "../../types/Work";

type Props = {
    work: Work
    onAnimationComplete?: () => void
}

const AnimationWorkContent: FC<Props> = (props) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {work} = props;

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;
        const layer = new CanvasLayer({
            canvas: canvasRef,
            context: ctx,
            width: work.width,
            height: work.height,
            autoRefresh: true
        });
        const anim = getAnimationWork(work.id.toString(), layer);
        if (!anim) return;
        const gameLoop = new GameLoop({
            layers: [
                layer
            ],
            frameRate: 8,
        });
        gameLoop.displayList = [anim];
        gameLoop.start();
        return () => {
            //アンマウント
            gameLoop.stop();
            if (props.onAnimationComplete) props.onAnimationComplete();
        };
    }, [canvasRef])

    const canvases = work.gameWorkOptions?.canvasLayers.map(layer => {
        return <canvas
            key={"CanvasLayer_" + layer.name}
            ref={canvasRef}
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
        </canvas>
    });


    return (
        <div
            key={"AnimationWorkContainer_" + work.id}
            className={styles.imageCanvasContainer}
            style={{
                maxHeight: "80vh",
                aspectRatio: work.width + " / " + work.height,
                margin: "auto",
                position: "relative",
                padding: 0,
            }}
        >
            {canvases}
        </div>
    );
}

export default AnimationWorkContent;