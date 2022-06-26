import React, {FC, useEffect, useRef, useState} from "react";
import {createTonkatsuOpening, TonkatsuOpening} from "./TonkatsuOpening";
import {createImageLoader, ImageLoader} from "./ImageLoader";
import {Size} from "../Display/Size";
import {useWindowSize} from "../Display/WindowSize";

type Props = {};

export const OpeningTheater: FC<Props> = (props) => {

    //オープニングオブジェクト
    const [opening, setOpening] = useState<TonkatsuOpening>();

    //canvas 要素への参照
    const canvasRef = useRef<HTMLCanvasElement>(null);

    //コンテキスト
    let ctx: CanvasRenderingContext2D;

    //ウィンドウサイズ変更へのフック
    const windowSize: Size | undefined = useWindowSize();

    //画像プリロード
    let imageLoader: ImageLoader;
    let [imageList, setImageList] = useState<HTMLImageElement[]>();

    /**
     *  画像リストをロード
     */
    useEffect(() => {

        //呼び出しは初回のみ既にロードされていたら再利用
        if (imageList) return;

        //ローダー初期化してロード
        imageLoader = createImageLoader([
            "logo/th_separated/logo1.png",
            "logo/th_separated/logo2.png",
            "logo/th_separated/logo3.png",
            "logo/th_separated/logo4.png",
            "logo/th_separated/logo5.png",
            "logo/th_separated/logo6.png",
            "logo/th_separated/logo7.png",
        ]);
        imageLoader.load(
            (list) => {
                setImageList(list)
            },
            () => {
                throw new Error();
            }
        );

    }, []);

    /**
     * ウィンドウサイズ変更及び、画像ロード完了で呼ばれる
     * 両方セットされていたらオープニングの再生開始
     */
    useEffect(() => {

        //どちらかが呼ばれていなかったら待機
        if (!windowSize || !imageList) return;

        //コンテキスト取得
        if (canvasRef.current === null) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        setOpening(createTonkatsuOpening({
            context: ctx,
            fps: 24,
            canvasSize: windowSize,
            imageList: imageList,
        }));


    }, [windowSize, imageList]);


    useEffect(() => {
        if (!opening) return;
        console.log("## start ##");
        opening.start();

        return () => {
            if (!opening) return;
            console.log("## stop ##");
            opening.stop();
        };

    }, [opening]);

    if (!windowSize || !imageList) {
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
