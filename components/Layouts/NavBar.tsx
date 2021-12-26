import styles from "./Layout.module.scss";
import {NavBarMenuItem} from "./NavBarMenuItem";

export const NavBar = () => {
    return (
        <div className={styles.contentNavbar}>
            <NavBarMenuItem id={0} name={"写真"} />
            <NavBarMenuItem id={1} name={"絵"} />
            <NavBarMenuItem id={2} name={"CGI"} />
        </div>
    )
}