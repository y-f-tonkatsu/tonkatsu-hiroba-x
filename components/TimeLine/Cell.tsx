import {NextPage} from "next";
import {Work} from "../../types/Work";
import Image from "next/image"
import React from "react";
import styles from "./TimeLine.module.scss"

type Props = {
    work: Work,
    onMouseOver: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, work: Work, columnIndex: number) => void,
    onMouseOut: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    columnIndex: number
}

/**
 * タイムラインのセルを表すコンポーネント
 * @param props {Props}
 * @constructor
 */
export const Cell: NextPage<Props> = (props: Props) => {

    const {work, onMouseOver, onMouseOut, columnIndex} = props;

    return (
        <div
            className={styles.containerCell}
            onMouseOver={(e) => {
                onMouseOver(e, work, columnIndex)
            }}
            onMouseOut={onMouseOut}
        >
            <Image
                key={work.id}
                className={styles.containerCellImage}
                src={`/works/${work.thumb}`}
                alt={work.description}
                width={work.thumbWidth}
                height={work.thumbHeight}
                layout="responsive"
            />
        </div>
    );

}