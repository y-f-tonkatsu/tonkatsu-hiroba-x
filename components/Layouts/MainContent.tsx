import {ReactElement} from "react";
import styles from "./Layout.module.scss";

/**
 * メインコンテンツ
 */
export const MainContent = ({children}: { children: ReactElement[] }) => {
    return (
        <main className={styles.contentMain}>
            {children}
        </main>
    )
}