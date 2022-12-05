import {Work} from "../../types/Work";
import {Cell} from "./Cell";
import styles from "./TimeLine.module.scss"
import React, {useEffect, useState} from "react";
import DescriptionOverlay, {DescriptionOverlayProps} from "./DescriptionOverlay";
import {CategoryID} from "../../types/Categories";
import {NextPage} from "next";
import {IntroTheater, TheaterRect} from "../Intro/IntroTheater";
import {ScreenState, useWindowSize} from "../../TonkatsuDisplayLib/Display/WindowSize";
import {PlayerState} from "../../pages/works/[category]/[id]";
import {IntroBackground} from "../Intro/IntroBackground";

//タイムラインの列の数
export const NUM_COLS = 4;

type Props = {
    works: Work[][],
    timeLineCategory: CategoryID,
    playerState: PlayerState
}

/** PC レイアウトの左ツールバーのサイズ */
const LAYOUT_LEFT_MARGIN = 120;

/**
 * タイムラインコンポーネント
 * @param works 作品データの列ごとの2重配列
 * @param timelineCategory 表示中のタイムラインのカテゴリを表す
 */
export const TimeLine: NextPage<Props> = ({works, timeLineCategory, playerState}) => {

    const screenState: ScreenState | undefined = useWindowSize();
    const [theaterRect, setTheaterRect] = useState<TheaterRect>();
    const [scrollTop, setScrollTop] = useState<number>(0)

    /**
     * ウインドウサイズ変更の副作用
     */
    useEffect(() => {

        if (!screenState) return;

        //シアターサイズを決定
        let left = 0;
        const top = 0;
        if (!screenState.isMobile) {
            left = LAYOUT_LEFT_MARGIN;
        }
        let width = screenState.size.width - left;
        let height = width * 0.75;
        if (height > (screenState.size.height * 0.8)) {
            height = Math.floor(screenState.size.height * 0.8);
            width = Math.floor(height / 3 * 4);
        }
        const margin = (screenState.size.width - width - left) * 0.5;
        setTheaterRect({
            left,
            top,
            width,
            height,
            margin
        })

    }, [screenState]);

    /**
     * マウスオーバーで表示するオーバーレイの状態を表す state
     */
    const [overlay, setOverlay] = useState<DescriptionOverlayProps>({
        position: null,
        description: "",
        animation: null
    });

    /**
     * セルのマウスオーバーのハンドラ
     * @param e イベントオブジェクト
     * @param work 対象の Work
     * @param columnIndex 列のインデックス
     */
    const onCellMouseOver = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, work: Work, columnIndex: number) => {
        /* オーバーレイの位置を決める */
        const isLeft = (columnIndex + 1) / cols.length > 0.5;
        let y = (e.currentTarget.offsetTop * 2 + e.currentTarget.offsetHeight) * 0.5;
        let bottomOffset = window.innerHeight - e.clientY;
        //スクロール位置によって画面外に出るのを防ぐ調整
        const THRESHOLD_TOP = e.currentTarget.offsetHeight * 0.5;
        if (e.clientY < THRESHOLD_TOP) y += THRESHOLD_TOP - e.clientY;
        const THRESHOLD_BOTTOM = 400;
        if (bottomOffset < THRESHOLD_BOTTOM) y -= THRESHOLD_BOTTOM - bottomOffset;

        //オーバーレイの state を更新
        setOverlay({
            description: work.description,
            position: {
                top: y,
                left: isLeft ? (columnIndex - 2) * 25 + "%" : (columnIndex + 1) * 25 + "%",
            },
            animation: isLeft ? "overlayDescriptionPopFromLeft" : "overlayDescriptionPopFromRight"
        })
    };

    /**
     * セルのマウスアウトのハンドラ
     * @param e イベントオブジェクト
     */
    const onCellMouseOut = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        //オーバーレイの state を更新して非表示にする
        setOverlay({
            description: "",
            position: null,
            animation: null
        })
    };

    //各列の JSX を作る
    const cols = works.map((col, index) => {
        //列
        return (
            <div key={index} className={styles.colsTimeLine}>
                {col.map((work) => {
                    //セル
                    return (
                        <Cell
                            key={work.id}
                            work={work}
                            timeLineCategory={timeLineCategory}
                            onMouseOver={onCellMouseOver}
                            onMouseOut={onCellMouseOut}
                            columnIndex={index}/>
                    )
                })}
            </div>
        )
    });

    //タイムラインのスクロールイベント
    const onScroll = (e: React.UIEvent<HTMLElement>) => {
        setScrollTop(e.currentTarget.scrollTop)
    }

    //Canvas アニメーション
    const theater =
        <IntroTheater
            key="IntroTheater"
            theaterRect={theaterRect || undefined}
            scroll={scrollTop}
            isActive={playerState === "hide"}
        />;

    return (
        <div key={"containerOuterTimeLine"}
             className={styles.containerOuterTimeLine}
             style={{position: "relative"}}
             onScroll={onScroll}
        >
            <div key={"containerInnerTimeLine"}
                 className={styles.containerTimeLine}
                 style={{position: "relative"}}
            >
                {theater}
                <IntroBackground
                    theaterRect={theaterRect || undefined}
                    isMobile={screenState? screenState.isMobile : true}
                />
                {cols}
                <DescriptionOverlay {...overlay} />
            </div>
        </div>
    );

}