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
    links: {
        list: string,
        prev: string | null,
        next: string | null
    }
    work: Work;
}

/**
 * コンテンツ単体表示コンポーネント
 */
const ContentsPlayer: NextPage<Props> = ({work, links}) => {

    //Prev/Nextボタン position: fixed なので Image コンポーネントは不使用
    let backButton, prevButton, nextButton;
    prevButton = links.prev ? (
        <Link href={links.prev} key={"prevButton"}><a>
            <img src={btnPrev.src} className={`${styles.btnPlayer} ${styles.btnPlayerPrev}`}
                 alt="前" />
        </a></Link>
    ) : null;
    nextButton = links.next ? (
        <Link href={links.next} key={"nextButton"}><a>
            <img src={btnNext.src} className={`${styles.btnPlayer} ${styles.btnPlayerNext}`}
                 alt="次"
                 />
        </a></Link>
    ) : null;
    backButton = (
        <Link href={links.list} key={"backButton"}><a>
            <img src={btnBack.src} className={`${styles.btnPlayer} ${styles.btnPlayerBack}`}
            alt="戻る" />
        </a></Link>
    );

    const [anim, setAnim] = useState("");

    return (
        <div className={styles.containerPlayer}>
            <div className={styles.containerHeader}>
                {backButton}
                {work.title}
            </div>
            <div className={styles.containerMain}>
                <div className={styles.contentMain}>
                    {[prevButton, nextButton]}
                    <Image key={`${work.path}`}
                           className={`${styles.imageMain} ${anim}`}
                           layout={"fill"}
                           objectFit="contain"
                           src={`${work.path}`}
                           alt={work.title}
                           priority={true}
                           onLoadingComplete={function(){
                               setAnim(styles.mainImageFadeIn);
                           }}
                    />
                </div>
                <div className={styles.contentSide}>
                    <div className={styles.contentSideDescription}>{work.description}</div>
                </div>
            </div>
        </div>
    );
}

export default ContentsPlayer;