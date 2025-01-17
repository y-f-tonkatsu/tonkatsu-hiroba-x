import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import styles from "../../../styles/Home.module.css";
import {NUM_COLS, TimeLine} from "../../../components/TimeLine/TimeLine";
import {Work} from "../../../types/Work";
import ContentsPlayer from "../../../components/Player/ContentsPlayer";
import worksJson from "../../../public/works/works-size-added.json";
import React, {ReactElement, ReactNode} from "react";
import {Layout} from "../../../components/Layouts/Layout";
import {Categories, CategoryID, isCategory} from "../../../types/Categories";
import Head from "next/head";
import {AppData} from "../../../Resource/AppData";

/** コンテンツ指定なしのときの ID */
export const ID_NO_CONTENTS: number = 0;

type Props = {
    id: number;
    works: Work[][];
    timelineCategory: CategoryID;
};
type PageWithLayout = NextPage<Props> & {
    getLayout?: (page: ReactElement) => ReactNode
};

export type PlayerState = "show" | "hide";

/**
 * 指定されたカテゴリのタイムラインを表示する
 * また、URLで指定した Work を再生する
 */
const WorksPage: PageWithLayout = ({id, works, timelineCategory}) => {

    //2重リストをフラットにしてソート
    const allWorks: Work[] = works.flat().sort((a, b) => a.id - b.id);
    //表示対象の Work とそのインデックスを取得
    const index = allWorks.findIndex(work => work.id === id);
    const work = allWorks[index];
    const playerState = id !== ID_NO_CONTENTS ? "show" : "hide";
    //タイムラインを作る
    const timeLine = (
        <TimeLine
            key="TimeLine"
            works={works}
            timeLineCategory={timelineCategory}
            playerState={playerState}
        />
    );

    //Head と ContentsPlayer を作る
    let player = null;
    let head = null;
    if (work && playerState === "show") {
        const title = `${work.title} - ${AppData.title}`;
        const url = `${AppData.baseUrl}/works/${timelineCategory}/${work.id}`;
        head = (
            <Head>
                <title key="title">{title}</title>
                <meta key="description" name="description" content={work.description}/>
                <link key="canonical" rel="canonical" href={url}/>

                <meta key="ogTitle" name="og:title" content={title}/>
                <meta key="ogUrl" property="og:url" content={url}/>
                <meta key="ogType" name="og:type" content={work.category}/>
                <meta key="ogDescription" name="og:description" content={work.description}/>
                <meta key="ogImage" property="og:image" content={`${AppData.baseUrl}${work.path}`}/>
                <meta key="ogImageWidth" property="og:image:width" content={work.width.toString()}/>
                <meta key="ogImageHeight" property="og:image:height" content={work.height.toString()}/>
            </Head>
        );
        player = createPlayer(allWorks, work, index, timelineCategory);
    }

    return (
        <div key={"containerHome"} className={styles.homeContainer}>
            {head}
            {[scripts, timeLine, player]}
        </div>
    );
}

/**
 * 外部読み込みのスクリプトをまとめる
 */
const scripts = (
    <div key={"scriptsTimeLine"}>
        <script
            key={"AdobeFontScript"}
            dangerouslySetInnerHTML={{
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
    </div>
);

/**
 * コンテンツデータからプレイヤーコンポーネントを作る
 */
const createPlayer = (
    allWorks: Work[],
    work: Work,
    index: number,
    timelineCategory: CategoryID,
) => {
    let next, prev;
    let prevWorks = [allWorks[index + 1], allWorks[index + 2]];
    let nextWorks = [allWorks[index - 1], allWorks[index - 2]];
    next = index > 0 ? `/works/${timelineCategory}/${nextWorks[0].id}` : null;
    prev = index < allWorks.length - 1 ? `/works/${timelineCategory}/${prevWorks[0].id}` : null;
    const links = {
        list: `/works/${timelineCategory}/${ID_NO_CONTENTS}`,
        prev: prev,
        next: next,
    }

    // 他のカテゴリの場合...
    return (
        <ContentsPlayer
            key="ContentsPlayer"
            work={work}
            links={links}
            prevWorks={prevWorks}
            nextWorks={nextWorks}/>
    );
};

/**
 * レイアウト設定
 */
WorksPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {[page]}
        </Layout>
    )
}

/**
 * パス設定
 */
export const getStaticPaths: GetStaticPaths = async () => {

    const paths = worksJson.map((work) => ({
        //カテゴリごとにタイムラインとコンテンツの組み合わせ配列を作る
        params: {
            id: work.id.toString(),
            category: work.category
        },
    })).concat(
        worksJson.map((work) => ({
            //all カテゴリは全てのコンテンツとの組み合わせを作る
            params: {
                id: work.id.toString(),
                category: "all"
            },
        }))
    ).concat(
        Categories.map(category => {
            //コンテンツなしは全てのカテゴリとの組み合わせを作る
            return {
                params: {
                    id: ID_NO_CONTENTS.toString(),
                    category: category
                }
            }
        })
    );

    return {
        paths: paths,
        fallback: false
    }

}

/**
 * SSG設定
 */
export const getStaticProps: GetStaticProps = async (context) => {
    // 列を表す2重配列 Cols × Works
    const cols: Work[][] = (new Array(NUM_COLS)).fill([]).map(() => ([]));
    const heights: number[] = (new Array(NUM_COLS)).fill(0);

    const params = context.params || {};
    const category = isCategory(params.category) ? params.category : "all";
    const works = category === "all" ? worksJson : worksJson.filter(work => category === work.category);
    works.forEach(work => {
        let n = heights.indexOf(Math.min(...heights));
        heights[n] += work.thumbHeight * (240 / work.thumbWidth);
        cols[n].push(work)
    });

    const id = typeof params.id === "string" ? parseInt(params.id) : ID_NO_CONTENTS;

    return {
        props: {
            id,
            works: cols,
            timelineCategory: category,
        }
    }
}


export default WorksPage;