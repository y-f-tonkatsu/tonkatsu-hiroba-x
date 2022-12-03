import styles from "./TimeLine.module.scss"

export type DescriptionOverlayProps = {
    //解説文
    description: string,
    //表示位置 left は %, top は px 指定を想定, null で非表示
    position: {
        left: string,
        top: number
    } | null;
    //スライドしてくる方向
    animation: "overlayDescriptionPopFromLeft" | "overlayDescriptionPopFromRight" | null
}

/**
 * タイムラインのセルのマウスオーバーで表示するオーバーレイを表すコンポーネント
 * @param props {DescriptionOverlayProps} position:null で非表示
 */
const DescriptionOverlay = (props: DescriptionOverlayProps) => {

    let {position, description, animation} = props;
    //position:null で非表示
    if (position === null) {
        return null;
    }

    return (
        <div className={styles.overlayDescription}
             style={{
                 top: position.top,
                 left: position.left,
                 animation: `${animation} 0.2s`
             }}>
            <div className={styles.overlayDescriptionTextBox}>
                <span className={styles.overlayDescriptionText}>{description}</span>
            </div>
        </div>
    )
}

export default DescriptionOverlay;