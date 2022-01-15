import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import styles from "../../../styles/Home.module.css";
import {NUM_COLS, TimeLine} from "../../../components/TimeLine/TimeLine";
import {Work} from "../../../types/Work";
import ContentsPlayer from "../../../components/Player/ContentsPlayer";
import worksJson from "../../../public/works/works-size-added.json";
import {ReactElement, ReactNode} from "react";
import {Layout} from "../../../components/Layouts/Layout";

export const ID_NO_CONTENTS: number = 0;

type Props = {
    id: number;
    works: Work[][];
}

type PageWithLayout = NextPage<Props> & {
    getLayout?: (page: ReactElement) => ReactNode
};

/**
 * URLで指定した Work を再生する
 */
const WorksPage: PageWithLayout = ({id, works}) => {

    let category = "all";
    //表示対象の Work を取得, 取得できなかったら null を返す
    const allWorks: Work[] = works.flat();
    const work = allWorks.find(work => work.id === id);
    let player = null;
    if (work && id !== ID_NO_CONTENTS) {
        let next, prev;
        prev = allWorks.find(w => w.id === work.id - 1) ? `../${category}/${(work.id - 1)}` : null;
        next = allWorks.find(w => w.id === work.id + 1) ? `../${category}/${(work.id + 1)}` : null;
        const links = {
            list: `../${category}/${ID_NO_CONTENTS}`,
            prev: prev,
            next: next,
        }
        player = <ContentsPlayer work={work} links={links}/>;
    }

    return (
        <div className={styles.homeContainer}>
            <TimeLine
                works={works}
            />
            {player}
        </div>
    )
}

WorksPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            {[page]}
        </Layout>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = worksJson.map((work) => ({
        params: {
            id: work.id.toString(),
            category: "all"
        },
    })).concat({
        params: {
            id: ID_NO_CONTENTS.toString(),
            category: "all"
        },
    });

    return {
        paths: paths,
        fallback: false
    }

}

export const getStaticProps: GetStaticProps = async (context) => {

    //列を表す2重配列 Cols × Works
    const cols: Work[][] = (new Array(NUM_COLS)).fill([]).map(() => ([]));
    //各列の高さの合計を集計
    const heights: number[] = (new Array(NUM_COLS)).fill(0);

    worksJson.forEach(work => {
        //一番低い列のインデックスを取得
        let n = heights.indexOf(Math.min(...heights));
        //追加と高さの記録
        heights[n] += work.thumbHeight * (240 / work.thumbWidth);
        cols[n].push(work)
    });

    const id = typeof context.params?.id === "string" ? parseInt(context.params.id) : ID_NO_CONTENTS;
    const props: Props = {
        id: id,
        works: cols,
    }

    return {
        props
    }
}


export default WorksPage;