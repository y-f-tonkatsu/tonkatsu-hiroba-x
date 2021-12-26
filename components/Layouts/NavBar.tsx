import styles from "./Layout.module.scss";
import {NavBarMenuItem} from "./NavBarMenuItem";

export const NavBar = () => {
    return (
        <div className={styles.contentNavbar}>
            <NavBarMenuItem id={1} name={"ホーム"} />
            <NavBarMenuItem id={1} name={"イラスト"} />
            <NavBarMenuItem id={0} name={"写真"} />
            <NavBarMenuItem id={2} name={"CGI"} />
            <NavBarMenuItem id={1} name={"マンガ"} />
            <NavBarMenuItem id={1} name={"ゲーム"} />
            <NavBarMenuItem id={2} name={"ジェネラティブ"} />
        </div>
    )
}