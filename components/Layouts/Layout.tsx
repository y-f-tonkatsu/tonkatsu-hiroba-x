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
                <title>とんかつ道場</title>
                <meta name="description" content="Y.F.とんかつの絵などがある"/>
                <link rel="icon" href={favicon.src}/>
            </Head>

            <Script dangerouslySetInnerHTML={{
                __html:
                    `
                          (function(d) {
                            var config = {
                              kitId: 'jer2ken',
                              scriptTimeout: 3000,
                              async: true
                            },
                            h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\\bwf-loading\\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
                          })(document);
                        `
            }}/>

            <div className={styles.containerLayout}>
                <NavBar/>
                <MainContent>
                    {children}
                </MainContent>
            </div>
        </>
    )
}