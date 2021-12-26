import {FC} from "react";
import Link from "next/link";
import styles from "./NavBar.module.scss"

type Props = {
    id: number;
    name: string;
}

export const NavBarMenuItem: FC<Props> = ({name, id}) => {
    return (
        <Link key={id} href={"/"}>
            <a className={styles.containerLight}>
                <div className={styles.labelNavBar}>{name}</div>
            </a>
        </Link>
    );
}