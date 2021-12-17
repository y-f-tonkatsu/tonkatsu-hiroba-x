import {ReactElement} from "react";
import styles from "./Layout.module.scss";

export const MainContent = ({children}: { children: ReactElement[] }) => {
    return (
        <div className={styles.contentMain}>
            {children}
        </div>
    )
}