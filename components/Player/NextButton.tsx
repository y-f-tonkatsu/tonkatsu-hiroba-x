import btnNext from "../../public/images/btn-next.png";
import styles from "./ContentsPlayer.module.scss";
import {FC} from "react";

/**
 * Nextボタンコンポーネント
 * position: fixed なので Image コンポーネントは不使用
 * @param onClickListener クリックイベントリスナー
 */

type Props = {
    onClickListener: () => void,
    visibility: "visible" | "hidden";
}

const NextButton: FC<Props> = ({onClickListener, visibility}) => {
    return (
        <a onClick={onClickListener}>
            <img src={btnNext.src}
                 className={`${styles.btnPlayer} ${styles.btnPlayerNext}`}
                 style={{
                     visibility: visibility
                 }}
                 alt="次"/>
        </a>
    );
};

export default NextButton;
