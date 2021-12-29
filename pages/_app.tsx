import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ReactElement, ReactNode} from "react";
import {NextPage} from "next";

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

const AppTitle = "とんかつ道場";

function MyApp({Component, pageProps}: AppPropsWithLayout) {

    const getLayout = Component.getLayout ?? ((page:ReactNode) => page)

    return getLayout(<Component {...pageProps} key={AppTitle} />);

}

export default MyApp
