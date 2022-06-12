import {NextPage} from "next";
import {useEffect, useRef, useState} from "react";
import {createTonkatsuOpening, TonkatsuOpening} from "../../../components/Games/TonkatsuOpening/TonkatsuOpening";
import logo1 from "../../../public/images/logo/th_separated/logo1.png"
import {createImageLoader, ImageLoader} from "../../../components/Games/TonkatsuOpening/ImageLoader";

const Ex1: NextPage = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [opening, setOpening] = useState<TonkatsuOpening>();

    //DOM ロード時にゲームループをスタートする
    useEffect(() => {
        console.log("## Effect ##");

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
                        imageList: imageList
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

    }, []);

    interface SizedEvent {
        width: number;
        height: number;
    }

    function isSizedEvent(e: any): e is SizedEvent {
        return (e && e.width !== undefined && e.height !== undefined);
    }

    useEffect(() => {
        console.log("Effect");
        if (!opening) return;
        opening.start();

    }, [opening]);


    return (
        <>
            <canvas
                style={{background: "#000"}}
                ref={canvasRef}
                key="MainCanvas"
                width={1000}
                height={800}>
            </canvas>
        </>
    );
}

export default Ex1;