import {NavBar} from "./NavBar";
import {ReactElement} from "react";
import styles from "./Layout.module.scss";
import {MainContent} from "./MainContent";
import Head from "next/head";
import favicon from "../../public/favicon.ico";
import {AppData} from "../../Resource/AppData";

/**
 * レイアウト定義
 */
export const Layout = ({children}: { children: ReactElement[] }) => {
    return (
        <>
            <Head>

                <title key="title">{AppData.title + " - ホーム"}</title>
                <meta key="author" name="author" content={AppData.author}/>
                <meta key="description" name="description" content={AppData.description}/>

                <link key="canonical" rel="canonical" href={AppData.baseUrl}/>
                <link key="icon" rel="icon" href={favicon.src}/>

                <meta key="ogTitle" property="og:title" content={AppData.title + " - ホーム"}/>
                <meta key="ogUrl" property="og:url" content={AppData.baseUrl}/>
                <meta key="ogType" property="og:type" content="website"/>
                <meta key="ogDescription" property="og:description" content={AppData.description}/>
                <meta key="ogImage" property="og:image" content={`${AppData.baseUrl}/images/app/main_bg.jpg`}/>
                <meta key="ogImageWidth" property="og:image:width" content="1920"/>
                <meta key="ogImageHeight" property="og:image:height" content="1080"/>
                <meta key="ogSiteName" property="og:site_name" content={AppData.title}/>

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "とんかつひろば",
                            "url": "https://www.tonkatsuhiroba.com/"
                        }),
                    }}
                />
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