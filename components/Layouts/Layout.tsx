import {NavBar} from "./NavBar";
import {ReactElement} from "react";
import styles from "./Layout.module.scss";
import {MainContent} from "./MainContent";

export const Layout = ({children}: { children: ReactElement[] }) => {
    return (
        <div className={styles.containerLayout}>
            <NavBar/>
            <MainContent>
                {children}
            </MainContent>
        </div>
    )
}