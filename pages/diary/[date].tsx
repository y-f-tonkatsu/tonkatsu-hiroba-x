import {GetStaticPaths, GetStaticProps, NextPage} from "next";
import {Layout} from "../../components/Layouts/Layout";
import {ReactElement, ReactNode} from "react";

type Props = {
    article: string
};
type PageWithLayout = NextPage<Props> & {
    getLayout?: (page: ReactElement) => ReactNode
};

/**
 * 指定されたカテゴリのタイムラインを表示する
 * また、URLで指定した Work を再生する
 */
const DiaryPage: PageWithLayout = (props: Props) => {

    return (
        <div key={"containerDiary"}>
            日記
            {props.article}
        </div>
    );
}


/**
 * レイアウト設定
 */
DiaryPage.getLayout = function getLayout(page: ReactElement) {
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

    const paths = [
        {
            params: {
                date: "1"
            },
        },
        {
            params: {
                date: "2"
            },
        }

    ]

    return {
        paths: paths,
        fallback: false
    }

}

/**
 * SSG設定
 */
export const getStaticProps: GetStaticProps = async () => {

    const props: Props = {
        article: "aaa"
    }

    return {
        props
    }
}


export default DiaryPage;