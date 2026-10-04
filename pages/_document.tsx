import {Html, Head, Main, NextScript} from 'next/document'
import {Analytics} from '@vercel/analytics/react';
import {SpeedInsights} from '@vercel/speed-insights/react';

export default function Document() {
    return (
        <Html lang="ja">
            <Head/>
            <body>
            <Main/>
            <NextScript/>
            <Analytics/>
            <SpeedInsights/>
            </body>
        </Html>
    )
}
