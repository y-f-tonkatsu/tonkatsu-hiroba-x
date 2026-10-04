import '../styles/globals.scss'
import type {AppProps} from 'next/app'
import {ReactElement, ReactNode} from "react";
import {NextPage} from "next";
import {AppData} from "../Resource/AppData";

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({Component, pageProps}: AppPropsWithLayout) {

    const getLayout = Component.getLayout ?? ((page: ReactNode) => page)

    return getLayout(<Component {...pageProps} key={AppData.title}/>);

}

export default MyApp
