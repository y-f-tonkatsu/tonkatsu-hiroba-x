import styles from "./ContentsPlayer.module.scss"
import {Work} from "../../types/Work";
import {FC, useState} from "react";
import {useRouter} from "next/router";
import PrevButton from "./PrevButton";
import NextButton from "./NextButton";
import BackButton from "./BackButton";
import Contents from "./Contents";

type Links = {
    list: string;
    prev: string | null;
    next: string | null;
}

type Props = {
    work: Work;
    prevWork: Work;
    nextWork: Work;
    links: Links;
}

export type TransitAnimation = {
    to: Work,
    direction: "up" | "down";
    onAnimationCompleteListener: () => void;
    status: "play" | "stop";
}

/**
 * コンテンツ単体表示コンポーネント
 * @param work 表示するコンテンツ
 * @param links TLに戻る、PREV/NEXT の各 URL
 */
const ContentsPlayer: FC<Props> = ({work, links, prevWork, nextWork}) => {

    const router = useRouter();

    //表示中のコンテンツ
    const [currentWork, setCurrentWork] = useState<Work>(work);
    //トランジションアニメーションの状態
    const [transitAnimation, setTransitAnimation] = useState<TransitAnimation | null>(null);

    //ボタン設定
    let prevButton, nextButton;
    //Prev/Nextボタン
    let onPrevNextButtonClicked = async (work: Work, direction: "up" | "down", link: string | null) => {
        if (link === null) return;
        if (transitAnimation !== null) return;
        setTransitAnimation({
            to: work,
            direction: direction,
            onAnimationCompleteListener: async () => {
                setTransitAnimation({
                    to: work,
                    direction: direction,
                    onAnimationCompleteListener: ()=>{},
                    status: "stop"
                });
                setCurrentWork(work);
                await router.push(link);
                setTransitAnimation(null);
            },
            status: "play",
        });
    };
    //トランジションアニメ再生中は表示しない
    if (!transitAnimation) {
        //リンク設定が null なら表示しない
        if (links.prev !== null) {
            prevButton =
                <PrevButton key="PrevButton" onClickListener={async () => {
                    await onPrevNextButtonClicked(prevWork, "down", links.prev)
                }}/>;
        }
        //リンク設定が null なら表示しない
        if (links.next !== null && !transitAnimation) {
            nextButton =
                <NextButton key="NextButton" onClickListener={async () => {
                    await onPrevNextButtonClicked(nextWork, "up", links.next)
                }}/>;
        }
    }
    //戻るボタン
    let backButton = <BackButton key="BackButton" href={links.list}/>;

    //ヘッダ
    const headerContainer = (
        <div key="headerContainer" className={styles.containerHeader}>
            {[backButton]}
            <h1 className={styles.mainTitle}>{work.title}</h1>
        </div>
    );

    //コントローラー
    const controllerContent = (
        <div key="controllerContent" className={styles.contentController}>
            {[nextButton, prevButton]}
        </div>
    )
    //メイン
    const mainContent = (
        <div key="mainContent" className={`${styles.contentMain}`}>
            <Contents work={currentWork} transitAnimation={transitAnimation} />
        </div>
    );
    //サイド
    const sideContent = (
        <div key="sideContent" className={styles.contentSide}>
            <h3 className={styles.labelSide}>Description</h3>
            <div className={styles.contentSideDescription}>{work.description}</div>
            <h3 className={styles.labelSide}>Tools</h3>
            <div className={styles.contentSideDescription}>{work.info}</div>
        </div>
    );
    //コンテナ
    const mainContainer = (
        <div key="mainContainer" className={`${styles.containerMain}`}>
            {[controllerContent, mainContent, sideContent]}
        </div>
    );

    return (
        <div className={styles.containerPlayer}>
            {[headerContainer, mainContainer]}
        </div>
    );
}

export default ContentsPlayer;