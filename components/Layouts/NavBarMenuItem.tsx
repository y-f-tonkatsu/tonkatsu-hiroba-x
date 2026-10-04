import {FC} from "react";
import Link from "next/link";
import styles from "./NavBar.module.scss"

type Props = {
    id: number;
    name: string;
    link: string;
}

/**
 * ナビゲーションバーの各メニューアイテムを表すコンポーネント
 */
export const NavBarMenuItem: FC<Props> = ({id, name, link}) => {
    return (
        <Link key={id} href={link}>
            <a className={styles.containerLight}>
                <div className={styles.labelNavBar}>{name}</div>
            </a>
        </Link>
    );
}