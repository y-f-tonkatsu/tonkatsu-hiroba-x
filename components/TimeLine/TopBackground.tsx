import bgImage from "../../public/images/opening/bg2.jpg";
import React from "react";
import {TheaterRect} from "../../pages/opening/OpeningTheater";
import {NextPage} from "next";
import {Aphorism} from "../../Resource/Aphorism"
import styles from "./TimeLine.module.css"

type Props = {
    theaterRect: TheaterRect | undefined,
    isMobile: boolean
}

const randomAphorisms: { main: string, author: string }[] = [];
Aphorism.forEach(item => {
    randomAphorisms.splice(Math.floor(Math.random() * randomAphorisms.length), 0, item);
})


export const TopBackground: NextPage<Props> = ({theaterRect, isMobile}) => {
    if (!theaterRect) return <></>;

    let layouts = [
        {
            width: "35%",
            left: "10%",
            top: theaterRect ? theaterRect.height * 0.2 : 0,
            fontSize: isMobile ? "0.8rem" : "1.4rem"
        },
        {
            width: "35%",
            left: "55%",
            top: theaterRect ? theaterRect.height * 0.2 : 0,
            fontSize: isMobile ? "0.8rem" : "1.4rem"
        },
    ];
    if (!isMobile) layouts = layouts.concat([
        {
            width: "35%",
            left: "10%",
            top: theaterRect ? theaterRect.height * 0.6 : 0,
            fontSize: isMobile ? "0.8rem" : "1.4rem"
        },
        {
            width: "35%",
            left: "55%",
            top: theaterRect ? theaterRect.height * 0.6 : 0,
            fontSize: isMobile ? "0.8rem" : "1.4rem"
        }
    ]);

    let i = -1;
    const aphorismElems = layouts.map(style => {
        i++;
        return <div
            key={"aphorism" + i}
            className={styles.aphorism}
            style={style}>
            {randomAphorisms[i].main}<br/><br/>
            {randomAphorisms[i].author}
        </div>
    });

    return (
        <div
            style={{
                position: "relative",
                top: theaterRect ? -theaterRect.height : 0,
                height: 0,
                width: theaterRect ? theaterRect.width : 0,
                marginLeft: theaterRect.margin,
                overflow: "visible"
            }}
        >
            <img src={bgImage.src}
                 style={{
                     height: theaterRect ? theaterRect.height : 0,
                 }}
                 alt="とんかつ背景"/>
            {aphorismElems}
        </div>
    )
}
