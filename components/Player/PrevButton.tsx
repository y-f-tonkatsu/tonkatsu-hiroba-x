import btnPrev from "../../public/images/btn-prev.png";
import styles from "./ContentsPlayer.module.scss";
import {FC} from "react";

/**
 * Prevボタンコンポーネント
 * position: fixed なので Image コンポーネントは不使用
 * @param onClickListener クリックイベントリスナー
 */

type Props = {
    onClickListener: () => void,
    visible: boolean
}

const PrevButton: FC<Props> = ({onClickListener, visible}) => {
    return (
        <a onClick={onClickListener}
           style={{
               visibility: visible ? "visible" : "hidden"
           }}
        >
            <img src={btnPrev.src} className={`${styles.btnPlayer} ${styles.btnPlayerPrev}`}
                 alt="前"/>
        </a>
    );
};

export default PrevButton;
