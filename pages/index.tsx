import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import {NUM_COLS, TimeLine} from "../components/TimeLine/TimeLine";
import {ReactElement, ReactNode} from "react";
import {Layout} from "../components/Layouts/Layout";
import worksJson from "../public/works/works-size-added.json";
import {Work} from "../types/Work";

type Props = {
    works: Work[][]
}

//NextPage を拡張して getLayout を持った型を作る
type Page = NextPage<Props> & {
    getLayout?: (page: ReactElement) => ReactNode
};

/**
 * ナビゲーションを除いたメインコンテンツ
 * @param props {Props} Works データを受け取りタイムラインコンポーネントに渡す
 */
const Home: Page = (props: Props) => {

    return (
        <div className={styles.homeContainer}>
            <TimeLine
                works={props.works}
            />
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

export async function getStaticProps() {

    //列を表す2重配列 Cols × Works
    const cols: Work[][] = (new Array(NUM_COLS)).fill([]).map(e => ([]));
    //各列の高さの合計を集計
    const heights: number[] = (new Array(NUM_COLS)).fill(0);

    worksJson.forEach(work => {
        //一番低い列のインデックスを取得
        let n = heights.indexOf(Math.min(...heights));
        //追加と高さの記録
        heights[n] += work.thumbHeight * (240 / work.thumbWidth);
        cols[n].push(work)
    });

    return {
        props: {
            works: cols
        }
    }
}

export default Home;
