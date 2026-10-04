import Link from "next/link";
import btnBack from "../../public/images/btn-back.png";
import styles from "./ContentsPlayer.module.scss";
import {FC} from "react";

type Props = {
    href: string;
}

/**
 * 戻るボタン
 * position: fixed なので Image コンポーネントは不使用
 * @param href 戻る先の URL
 */
const BackButton: FC<Props> = ({href}) => {
    return (
        <Link href={href}><a>
            <img src={btnBack.src} className={`${styles.btnPlayer} ${styles.btnPlayerBack}`}
                 alt="戻る"/>
        </a></Link>
    )
}

export default BackButton;