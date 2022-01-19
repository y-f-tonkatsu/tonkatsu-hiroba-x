import {NextPage} from "next";
import styles from "./ContentsPlayer.module.scss"
import {Work} from "../../types/Work";
import Link from "next/link";
import Image from "next/image"
import btnBack from "../../public/images/btn-back.png"
import btnPrev from "../../public/images/btn-prev.png"
import btnNext from "../../public/images/btn-next.png"
import {useState} from "react";

type Props = {
    work: Work;
    links: {
        list: string,
        prev: string | null,
        next: string | null
    };
}

/**
 * コンテンツ単体表示コンポーネント
 * @param work 表示するコンテンツ
 * @param links TLに戻る、PREV/NEXT の各 URL
 */
const ContentsPlayer: NextPage<Props> = ({work, links}) => {

    //ボタン設定
    let backButton, prevButton, nextButton;
    //Prev/Nextボタン
    prevButton = links.prev ? createPrevButton(links.prev) : null;
    nextButton = links.next ? createNextButton(links.next) : null;
    //戻るボタン
    backButton = createBackButton(links.list);

    //TODO トランジションアニメ
    const [anim, setAnim] = useState("");

    //ヘッダ
    const headerContainer = (
        <div key="headerContainer" className={styles.containerHeader}>
            {backButton}
            <h1 className={styles.labelContents}>{work.title}</h1>
        </div>
    );

    //コンテンツ
    const contents = createContents(work);
    //メイン
    const mainContent = (
        <div key="mainContent" className={`${styles.contentMain}`}>
            {[prevButton, nextButton, contents]}
        </div>
    );
    //サイド
    const sideContent = (
        <div className={styles.contentSide}>
            <h3 className={styles.labelSide}>Description</h3>
            <div className={styles.contentSideDescription}>{work.description}</div>
            <h3 className={styles.labelSide}>Tools</h3>
            <div className={styles.contentSideDescription}>{work.info}</div>
        </div>
    );
    //コンテナ
    const mainContainer = (
        <div key="mainContainer" className={`${styles.containerMain}`}>
            {[mainContent, sideContent]}
        </div>
    );

    return (
        <div className={styles.containerPlayer}>
            {[headerContainer, mainContainer]}
        </div>
    );
}

/**
 * Prev ボタンを返す
 * position: fixed なので Image コンポーネントは不使用
 * @param href 前のコンテンツへのリンク
 */
const createPrevButton = (href: string) => {
    return (
        <Link href={href} key={"prevButton"}><a>
            <img src={btnPrev.src} className={`${styles.btnPlayer} ${styles.btnPlayerPrev}`}
                 alt="前"/>
        </a></Link>
    );
}

/**
 * Next ボタンを返す
 * position: fixed なので Image コンポーネントは不使用
 * @param href 次のコンテンツへのリンク
 */
const createNextButton = (href: string) => {
    return (
        <Link href={href} key={"nextButton"}><a>
            <img src={btnNext.src} className={`${styles.btnPlayer} ${styles.btnPlayerNext}`}
                 alt="次"
            />
        </a></Link>
    );
}

/**
 * 戻るボタンを返す
 * position: fixed なので Image コンポーネントは不使用
 * @param href タイムラインへのリンク
 */
const createBackButton = (href: string) => {
    return (
        <Link href={href} key={"backButton"}><a>
            <img src={btnBack.src} className={`${styles.btnPlayer} ${styles.btnPlayerBack}`}
                 alt="戻る"/>
        </a></Link>
    )
}

/**
 * コンテンツのカテゴリに応じたコンポーネントを作って返す
 * @param work コンテンツ
 */
const createContents = (work: Work) => {
    if (work.category === "manga") {
        return (
            <Image key={`${work.path}`}
                   className={`${styles.imageMain}`}
                   src={`${work.path}`}
                   alt={work.title}
                   priority={true}
                   width={work.width}
                   height={work.height}
                   onLoadingComplete={function () {
                   }}
            />
        );
    } else {
        return (
            <Image key={`${work.path}`}
                   className={`${styles.imageMain}`}
                   layout={"fill"}
                   objectFit="contain"
                   src={`${work.path}`}
                   alt={work.title}
                   priority={true}
                   onLoadingComplete={function () {
                   }}
            />
        );
    }

}

export default ContentsPlayer;