import React, {RefObject, useEffect, useRef, useState} from "react";
import {TonkatsuIntro} from "./TonkatsuIntro";
import {createImageLoader, ImageLoader} from "../../TonkatsuDisplayLib/ImageLoader/ImageLoader";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";
import styles from "./CanvasLayers.module.css"
import {ImageFile} from "../../TonkatsuDisplayLib/ImageLoader/ImageFile";
import {TonImageList} from "./TonImageList";
import {NextPage} from "next";

export type OpeningTheaterProps = {
    theaterRect: TheaterRect,
    scroll: number,
    isActive: boolean
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
 * とんかつひろばトップのイントロムービーコンポーネント
 * @constructor
 */
export const IntroTheater: NextPage<OpeningTheaterProps> = (props) => {

    //オープニングオブジェクト
    const [opening, setOpening] = useState<TonkatsuIntro>();

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
        imageLoader = createImageLoader(TonImageList, "../../images/");
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
        setOpening(new TonkatsuIntro({
            layers: {
                mainLayer: new CanvasLayer({
                    canvas: canvasRef.current,
                    context: mainCtx,
                    width: theaterRect.width,
                    height: theaterRect.height,
                    autoRefresh: true
                }),
                bgLayer: new CanvasLayer({
                    canvas: bgCanvasRef.current,
                    context: bgCtx,
                    width: theaterRect.width,
                    height: theaterRect.height,
                    autoRefresh: false
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

    /**
     * 上の階層の状態の変化の副作用
     */
    useEffect(() => {
        if (!opening || !theaterRect) return;
        if (props.isActive) {
            opening.start();
        } else {
            opening.stop();
        }
    }, [props.isActive, opening, theaterRect])

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
        <div
            className={styles.containerCanvas}
            style={{
                minHeight: theaterRect.height,
                left: theaterRect.left,
                top: theaterRect.top,
            }}>
            {createCanvasLayer({
                name: "BGCanvas",
                ref: bgCanvasRef,
                theaterRect: theaterRect,
                zIndex: 1,
            })}
            {createCanvasLayer({
                name: "MainCanvas",
                ref: canvasRef,
                theaterRect: theaterRect,
                zIndex: 2
            })}
        </div>
    );
}

type CanvasLayerProps = {
    name: string,
    zIndex: number,
    ref: RefObject<HTMLCanvasElement>,
    theaterRect: TheaterRect
}

/**
 * CanvasLayer を作って返す
 * @param props
 */
const createCanvasLayer = (props: CanvasLayerProps) => {
    return <canvas
        key={props.name}
        ref={props.ref}
        className={styles.canvasLayer}
        style={{
            position: "absolute",
            zIndex: 1,
            left: props.theaterRect?.margin || 0
        }}
        width={props.theaterRect?.width || 0}
        height={props.theaterRect?.height || 0}
    >
    </canvas>
}