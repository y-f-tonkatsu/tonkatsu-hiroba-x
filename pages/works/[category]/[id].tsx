import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import styles from "../../../styles/Home.module.css";
import {NUM_COLS, TimeLine} from "../../../components/TimeLine/TimeLine";
import {Work} from "../../../types/Work";
import ContentsPlayer from "../../../components/Player/ContentsPlayer";
import worksJson from "../../../public/works/works-size-added.json";
import React, {ReactElement, ReactNode} from "react";
import {Layout} from "../../../components/Layouts/Layout";
import {Categories, CategoryID, isCategory} from "../../../types/Categories";
import HeadLine from "../../../components/TimeLine/HeadLine";
import Script from 'next/script'

/** コンテンツ指定なしのときの ID */
export const ID_NO_CONTENTS: number = 0;

type Props = {
    id: number;
    works: Work[][];
    timelineCategory: CategoryID
}
type PageWithLayout = NextPage<Props> & {
    getLayout?: (page: ReactElement) => ReactNode
};

/**
 * 指定されたカテゴリのタイムラインを表示する
 * また、URLで指定した Work を再生する
 */
const WorksPage: PageWithLayout = ({id, works, timelineCategory}) => {

    //2重リストをフラットにする
    const allWorks: Work[] = works.flat().sort((a, b) => a.id - b.id);
    //表示対象の Work とそのインデックスを取得
    const index = allWorks.findIndex(work => work.id === id);
    const work = allWorks[index];

    //ContentsPlayer を作る
    let player = null;
    if (work && id !== ID_NO_CONTENTS) {
        let next, prev;
        let prevWork = allWorks[index - 1];
        let nextWork = allWorks[index + 1];
        prev = index > 0 ? `/works/${timelineCategory}/${prevWork.id}` : null;
        next = index < allWorks.length - 1 ? `/works/${timelineCategory}/${nextWork.id}` : null;
        const links = {
            list: `/works/${timelineCategory}/${ID_NO_CONTENTS}`,
            prev: prev,
            next: next,
        }
        player =
            <ContentsPlayer key="ContentsPlayer" work={work} links={links} prevWork={prevWork} nextWork={nextWork}/>;
    }

    //タイムラインを作る
    const timeLine = (
        <TimeLine
            key="TimeLine"
            works={works}
            timeLineCategory={timelineCategory}
        />
    );

    return (
        <div className={styles.homeContainer}>

            <Script
                src="https://code.createjs.com/1.0.0/createjs.min.js"
                strategy={"beforeInteractive"}
            />
            <Script
                src="/anims/animation_ex.js"
                strategy={"beforeInteractive"}
            />
            <HeadLine/>

            {[timeLine, player]}
        </div>
    );
}

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

    //列を表す2重配列 Cols × Works
    const cols: Work[][] = (new Array(NUM_COLS)).fill([]).map(() => ([]));
    //各列の高さの合計を集計
    const heights: number[] = (new Array(NUM_COLS)).fill(0);

    //一番低い cols から work を順に追加していく
    const params = context.params || {};
    const category = isCategory(params.category) ? params.category : "all";
    const works = category === "all" ? worksJson : worksJson.filter(work => category === work.category);
    works.forEach(work => {
        //一番低い列のインデックスを取得
        let n = heights.indexOf(Math.min(...heights));
        //追加と高さの記録
        heights[n] += work.thumbHeight * (240 / work.thumbWidth);
        cols[n].push(work)
    });

    //props を作る
    const id = typeof params.id === "string" ? parseInt(params.id) : ID_NO_CONTENTS;
    const props: Props = {
        id: id,
        works: cols,
        timelineCategory: category
    }

    return {
        props
    }
}


export default WorksPage;