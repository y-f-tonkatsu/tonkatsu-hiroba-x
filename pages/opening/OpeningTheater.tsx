import React, {FC, useEffect, useRef, useState} from "react";
import {TonkatsuOpening} from "./TonkatsuOpening";
import {createImageLoader, ImageLoader} from "../../TonkatsuDisplayLib/ImageLoader/ImageLoader";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";
import styles from "./CanvasLayers.module.css"
import {ImageFile} from "../../TonkatsuDisplayLib/ImageLoader/ImageFile";
import {TonImageList} from "./TonImageList";

export type OpeningTheaterProps = {
    theaterRect: TheaterRect,
    scroll: number
};

/**
 * Canvas の位置とサイズを表す
 */
export type TheaterRect = {
    height: number,
    width: number,
    left: number,
    top: number,
    margin: number
} | undefined;

/**
 * とんかつひろばトップのインタラクティブムービーコンポーネント
 * @param props
 * @constructor
 */
export const OpeningTheater: FC<OpeningTheaterProps> = (props) => {

    //オープニングオブジェクト
    const [opening, setOpening] = useState<TonkatsuOpening>();

    //canvas 要素への参照
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bgCanvasRef = useRef<HTMLCanvasElement>(null);
    //canvas の位置とサイズ
    const theaterRect: TheaterRect = props.theaterRect;

    //画像プリロード
    let imageLoader: ImageLoader;
    let [imageList, setImageList] = useState<ImageFile[]>();

    /**
     *  初期表示時の副作用
     *  画像リストをロード
     */
    useEffect(() => {

        //呼び出しは初回のみ既にロードされていたら再利用
        if (imageList) return;

        //ローダー初期化してロード
        imageLoader = createImageLoader(TonImageList);
        imageLoader.load(
            (list) => {
                setImageList(list)
            },
            () => {
                throw new Error("画像ロードに失敗");
            }
        );

    }, []);

    /**
     * ウィンドウサイズ変更及び、画像ロード完了で呼ばれる
     * 両方セットされていたらオープニングの再生開始
     */
    useEffect(() => {

        //どちらかが呼ばれていなかったら待機
        if (!theaterRect || !imageList) return;

        //コンテキスト取得
        if (canvasRef.current === null) return;
        const mainCtx = canvasRef.current.getContext("2d");
        if (!mainCtx) return;
        if (bgCanvasRef.current === null) return;
        const bgCtx = bgCanvasRef.current.getContext("2d");
        if (!bgCtx) return;

        //オープニングを開始
        setOpening(new TonkatsuOpening({
            layers: {
                mainLayer: new CanvasLayer({
                    canvas: canvasRef,
                    context: mainCtx,
                    width: theaterRect.width,
                    height: theaterRect.height,
                    refresh: true
                }),
                bgLayer: new CanvasLayer({
                    canvas: bgCanvasRef,
                    context: bgCtx,
                    width: theaterRect.width,
                    height: theaterRect.height
                })
            },
            fps: 24,
            canvasSize: {width: theaterRect.width, height: theaterRect.height},
            imageList: imageList,
        }));

    }, [theaterRect, imageList]);

    /**
     * オープニングがセットされたときの副作用
     */
    useEffect(() => {

        if (!opening) return;
        console.log("## start ##");

        //オープニング再生
        opening.start();

        return () => {
            //アンマウント オープニングを停止
            if (!opening) return;
            console.log("## stop ##");
            opening.stop();
        };

    }, [opening]);

    /**
     * スクロールの副作用
     */
    useEffect(() => {
        if (!opening || !theaterRect) return;
        opening.collapse(props.scroll);
    }, [props.scroll])

    //サイズが不確定なのでプレースホルダーを置けない
    if (!theaterRect) {
        return null;
    }

    //画像リストのロードが終わってない場合はプレースホルダーを返す
    if (!imageList) {
        return (
            <div style={{
                position: "sticky",
                pointerEvents: "none",
                width: "100%",
                minHeight: theaterRect.height,
                left: theaterRect.left,
                top: theaterRect.top,
                zIndex: 100,
            }}>
            </div>
        );
    }

    return (
        <div style={{
            position: "sticky",
            pointerEvents: "none",
            width: "100%",
            minHeight: theaterRect.height,
            left: theaterRect.left,
            top: theaterRect.top,
            zIndex: 100,
        }}>
            <canvas
                key="BGCanvas"
                ref={bgCanvasRef}
                className={styles.canvasLayer}
                style={{
                    position: "absolute",
                    zIndex: 1,
                    left: theaterRect.margin
                }}
                width={theaterRect.width}
                height={theaterRect.height}
            >
            </canvas>
            <canvas
                key="MainCanvas"
                ref={canvasRef}
                className={styles.canvasLayer}
                style={{
                    position: "absolute",
                    zIndex: 2,
                    left: theaterRect.margin
                }}
                width={theaterRect.width}
                height={theaterRect.height}
            >
            </canvas>
        </div>
    );
}
