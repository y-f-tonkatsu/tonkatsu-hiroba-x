import btnNext from "../../public/images/btn-next.png";
import styles from "./ContentsPlayer.module.scss";
import {FC} from "react";

/**
 * Nextボタンコンポーネント
 * position: fixed なので Image コンポーネントは不使用
 * @param onClickListener クリックイベントリスナー
 */

type Props = {
    onClickListener: () => void
}

const NextButton: FC<Props> = ({onClickListener}) => {
    return (
        <a onClick={onClickListener}>
            <img src={btnNext.src} className={`${styles.btnPlayer} ${styles.btnPlayerNext}`}
                 alt="次"/>
        </a>
    );
};

export default NextButton;
