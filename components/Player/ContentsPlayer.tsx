import styles from "./ContentsPlayer.module.scss"
import {Work} from "../../types/Work";
import {FC, ReactNode, useEffect, useState} from "react";
import {useRouter} from "next/router";
import PrevButton from "./PrevButton";
import NextButton from "./NextButton";
import BackButton from "./BackButton";
import Contents from "./Contents";
import PyoyiButton from "../Firebase/PyoyiButton";
import Comments from "../Firebase/Comments";

type Links = {
    list: string;
    prev: string | null;
    next: string | null;
}

type Props = {
    work: Work;
    prevWorks: Work[];
    nextWorks: Work[];
    links: Links;
}

export type TransitAnimation = {
    to: Work,
    direction: "next" | "prev";
    onAnimationCompleteListener: () => void;
    status: "play" | "stop";
}

/**
 * コンテンツ単体表示コンポーネント
 */
const ContentsPlayer: FC<Props> = ({work, links, prevWorks, nextWorks}) => {

    const router = useRouter();

    //表示中のコンテンツ
    const [currentWork, setCurrentWork] = useState<Work>(work);
    //トランジションアニメーションの状態
    const [transitAnimation, setTransitAnimation] = useState<TransitAnimation | null>(null);

    //ボタン設定
    let prevButton, nextButton;
    //Prev/Nextボタン
    let onPrevNextButtonClicked = async (work: Work, direction: "next" | "prev", link: string | null) => {
        if (link === null) return;
        if (transitAnimation !== null) return;
        setTransitAnimation({
            to: work,
            direction: direction,
            onAnimationCompleteListener: async () => {
                setTransitAnimation({
                    to: work,
                    direction: direction,
                    onAnimationCompleteListener: () => {
                    },
                    status: "stop"
                });
                setCurrentWork(work);
                await router.push(link);
                setTransitAnimation(null);
            },
            status: "play",
        });
    };
    //トランジションアニメ再生中かリンク設定が null なら表示しない
    prevButton =
        <PrevButton key="PrevButton"
                    visibility={links.prev !== null && !transitAnimation ? "visible" : "hidden"}
                    onClickListener={async () => {
                        await onPrevNextButtonClicked(prevWorks[0], "prev", links.prev)
                    }}/>;

    //トランジションアニメ再生中かリンク設定が null なら表示しない
    nextButton =
        <NextButton key="NextButton"
                    visibility={links.next !== null && !transitAnimation ? "visible" : "hidden"}
                    onClickListener={async () => {
                        await onPrevNextButtonClicked(nextWorks[0], "next", links.next)
                    }}/>;
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
            {[prevButton, nextButton]}
        </div>
    )
    //メイン
    const mainContent = (
        <div key="mainContent" className={`${styles.contentMain}`}>
            {controllerContent}
            <Contents work={currentWork} transitAnimation={transitAnimation}/>
        </div>
    );
    //サイド
    let desc: ReactNode[] = [];
    work.description.split("\n").forEach((d, i) => {
        desc.push(d);
        desc.push(<br key={"desc_br_" + i}/>);
    });
    const infoLabel = work.category === "writing"? "Info" : "Tools";
    const sideContent = (
        <div key="sideContent" className={styles.contentSide}>
            <PyoyiButton contentId={work.id.toString()}/>
            <h3 className={styles.labelSide}>Description</h3>
            <div className={styles.contentSideDescription}>{transitAnimation ? "" : desc}</div>
            <h3 className={styles.labelSide}>{infoLabel}</h3>
            <div className={styles.contentSideDescription}>{transitAnimation ? "" : work.info}</div>
            <h3 className={styles.labelSideCenter}>コメント</h3>
            <Comments contentId={work.id.toString()}/>

        </div>
    );
    //コンテナ
    const mainContainer = (
        <div key="mainContainer" id={"mainContainer"} className={`${styles.containerMain}`}>
            {[mainContent, sideContent]}
        </div>
    );

    //前後画像のプリロード
    const preloads = [...nextWorks, ...prevWorks].filter(work => work).map(work => {
        return <link
            key={`preload_${work.id}`}
            rel="preload"
            as="image"
            href={work.path}
        />
    });

    // ページ遷移完了時にスクロールをリセット
    useEffect(() => {

        const handleRouteChange = () => {
            document.querySelector('#mainContainer')?.scrollTo(0, 0);
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    return (
        <div key="ContainerPlayer" className={styles.containerPlayer}>
            {[headerContainer, mainContainer, preloads]}
        </div>
    );
}

export default ContentsPlayer;