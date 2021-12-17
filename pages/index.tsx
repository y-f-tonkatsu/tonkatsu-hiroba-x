import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {TimeLine} from "../components/TimeLine/TimeLine";
import {ReactElement, ReactNode} from "react";
import {Layout} from "../components/Layouts/Layout";

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
                <link rel="icon" href="/favicon.ico"/>
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
