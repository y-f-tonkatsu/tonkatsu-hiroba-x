import styles from "./Layout.module.scss";
import {NavBarMenuItem} from "./NavBarMenuItem";

/**
 * ナビゲーションバーを表すコンポーネント
 */
export const NavBar = () => {

    const items = [
        {
            label: "ホーム"
        },
        {
            label: "イラスト"
        },
        {
            label: "写真"
        },
        {
            label: "マンガ"
        },
        {
            label: "ゲーム"
        },
        {
            label: "アニメ"
        },
    ]

    return (
        <div className={styles.contentNavbar}>
            {items.map((item, i)=><NavBarMenuItem key={i} id={i} name={item.label} />)}
        </div>
    )
}