import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import {TimeLine} from "../components/TimeLine/TimeLine";
import {ReactElement, ReactNode} from "react";
import {Layout} from "../components/Layouts/Layout";
import worksJson from "../public/works/works-size-added.json";
import {Work} from "../types/Work";

type Props = {
    works: Work[][]
}

type Page = NextPage<Props> & {
    getLayout?: (page: ReactElement) => ReactNode
};

const Home: Page = (props: Props) => {

    console.log(props);
    return (
        <div className={styles.homeContainer}>
            <main>
                <TimeLine
                    works={props.works}
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

export async function getStaticProps() {

    const cols: Work[][] = [[], [], [], []];
    //各列の高さの合計を集計
    const heights: number[] = [0, 0, 0, 0];

    worksJson.forEach(work => {
        let n = heights.indexOf(Math.min(...heights));
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
