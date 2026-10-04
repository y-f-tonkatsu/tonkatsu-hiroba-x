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
    visibility: "visible" | "hidden";
}

const PrevButton: FC<Props> = ({onClickListener, visibility}) => {
    return (
        <a onClick={onClickListener}>
            <img src={btnPrev.src}
                 className={`${styles.btnPlayer} ${styles.btnPlayerPrev}`}
                 style={{
                     visibility: visibility
                 }}
                 alt="前"/>
        </a>
    );
};

export default PrevButton;
