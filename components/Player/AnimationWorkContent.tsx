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
        const anim = getAnimationWork("181", layer);
        if (!anim) return;
        const gameLoop = new GameLoop({
            layers: [
                layer
            ],
            frameRate: 30,
        });
        gameLoop.displayList = [anim];
        gameLoop.start();
        return () => {
            //アンマウント
            gameLoop.stop();
            if (props.onAnimationComplete) props.onAnimationComplete();
        };
    }, [canvasRef])

    return (
        <canvas
            key={"AnimationWork_" + work.id}
            style={{
                minWidth: "100%",
                maxWidth: "100%",
            }}
            className={styles.imageCanvas}
            ref={canvasRef}
            width={work.width}
            height={work.height}
        >
        </canvas>
    );
}

export default AnimationWorkContent;