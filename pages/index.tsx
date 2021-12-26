import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {TimeLine} from "../components/TimeLine/TimeLine";
import {ReactElement, ReactNode} from "react";
import {Layout} from "../components/Layouts/Layout";
import favicon from "../public/favicon.ico"
type Props = {

}

type Page = NextPage<Props> & {
    getLayout?: (page: ReactElement) => ReactNode
};

const Home: Page = (props: Props) => {

    return (
        <div className={styles.container}>
            <Head>
                <title>とんかつ道場</title>
                <meta name="description" content="Y.F.とんかつの絵などがある"/>
                <link rel="icon" href={favicon.src}/>
                <script dangerouslySetInnerHTML={{
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
            </Head>

            <main className={styles.main}>
                <TimeLine
                    works={[
                        {
                            id: 0,
                            path: "",
                            width: 100,
                            height: 100,
                        },
                        {
                            id: 1,
                            path: "",
                            width: 100,
                            height: 100,
                        },
                        {
                            id: 2,
                            path: "",
                            width: 100,
                            height: 100,
                        },
                    ]}
                />
            </main>

        </div>
    )
}

Home.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {[page]}
        </Layout>
    )
}

export default Home;
