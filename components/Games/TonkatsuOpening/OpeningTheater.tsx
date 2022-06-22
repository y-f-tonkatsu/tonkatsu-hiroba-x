import React, {FC, useEffect, useRef, useState} from "react";
import {createTonkatsuOpening, TonkatsuOpening} from "./TonkatsuOpening";
import {createImageLoader, ImageLoader} from "./ImageLoader";
import {Size} from "../Display/Size";
import {useWindowSize} from "../Display/WindowSize";

type Props = {};

export const OpeningTheater: FC<Props> = (props) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [opening, setOpening] = useState<TonkatsuOpening>();
    const windowSize: Size | undefined = useWindowSize();

    //DOM ロード時にゲームループをスタートする
    useEffect(() => {
        console.log("## Effect ##");
        console.log(windowSize);
        if (!windowSize) return;

        if (!opening) {
            //コンテキスト取得
            if (canvasRef.current === null) return;
            const ctx = canvasRef.current.getContext("2d");
            if (!ctx) return;

            const imageLoader: ImageLoader = createImageLoader([
                "logo/th_separated/logo1.png",
                "logo/th_separated/logo2.png",
                "logo/th_separated/logo3.png",
                "logo/th_separated/logo4.png",
                "logo/th_separated/logo5.png",
                "logo/th_separated/logo6.png",
                "logo/th_separated/logo7.png",
            ]);
            imageLoader.load(
                (imageList) => {
                    setOpening(createTonkatsuOpening({
                        context: ctx,
                        fps: 24,
                        canvasSize: windowSize,
                        imageList: imageList,
                    }));

                },
                () => {

                }
            );

        }

        return () => {
            console.log("## End ##");
            if (!opening) return;
            opening.stop();
        };

    }, [windowSize]);

    useEffect(() => {
        console.log("Effect");
        if (!opening) return;
        opening.start();
    }, [opening]);

    if (!windowSize) {
        return null;
    }

    return (
        <canvas
            key="MainCanvas"
            style={{background: "#000"}}
            ref={canvasRef}
            width={windowSize.width}
            height={windowSize.width * 0.75}>
        </canvas>
    );
}
