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

function MyApp({Component, pageProps}: AppPropsWithLayout) {

    const getLayout = Component.getLayout ?? ((page:ReactNode) => page)

    return getLayout(<Component {...pageProps} />);

}

export default MyApp
