import {NavBar} from "./NavBar";
import {ReactElement} from "react";
import styles from "./Layout.module.scss";
import {MainContent} from "./MainContent";
import Head from "next/head";
import favicon from "../../public/favicon.ico";
import Script from 'next/script'

/**
 * レイアウト定義
 */
export const Layout = ({children}: { children: ReactElement[] }) => {
    return (
        <>
            <Head>
                <title>とんかつひろば</title>
                <meta name="description" content="Y.F.とんかつの絵などがある"/>
                <link rel="icon" href={favicon.src}/>
            </Head>

            <div className={styles.containerLayout}>
                <NavBar/>
                <MainContent>
                    {children}
                </MainContent>
            </div>
        </>
    )
}