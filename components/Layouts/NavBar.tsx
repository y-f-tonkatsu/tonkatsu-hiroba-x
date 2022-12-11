import styles from "./Layout.module.scss";
import {NavBarMenuItem} from "./NavBarMenuItem";

/**
 * ナビゲーションバーを表すコンポーネント
 */
export const NavBar = () => {

    const items = [
        {
            label: "ホーム",
            link: "/works/all/0"
        },
        {
            label: "イラスト",
            link: "/works/painting/0"
        },
        {
            label: "写真",
            link: "/works/photo/0"
        },
        {
            label: "マンガ",
            link: "/works/manga/0"
        },
        {
            label: "ゲーム",
            link: "/works/game/0"
        },
    ]

    return (
        <div className={styles.contentNavbar}>
            {items.map((item, i) => <NavBarMenuItem key={i} id={i} name={item.label} link={item.link}/>)}
        </div>
    )
}