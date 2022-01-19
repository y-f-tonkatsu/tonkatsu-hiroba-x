import {NextPage} from "next";
import {Work} from "../../types/Work";
import Image from "next/image"
import React from "react";
import styles from "./TimeLine.module.scss"
import Link from "next/link"
import {CategoryID} from "../../types/Categories";

type Props = {
    work: Work,
    onMouseOver: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, work: Work, columnIndex: number) => void,
    onMouseOut: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    columnIndex: number,
    timeLineCategory: CategoryID
}

/**
 * タイムラインのセルを表すコンポーネント
 * @param work コンテンツ
 * @param onMouseOver マウスオーバーリスナー
 * @param onMouseOut マウスアウトリスナー
 * @param columnIndex 列のインデックス
 * @param timeLineCategory 表示中のタイムラインのカテゴリ
 */
export const Cell: NextPage<Props> = ({work, onMouseOver, onMouseOut, columnIndex, timeLineCategory}) => {

    return (
        <Link href={`/works/${timeLineCategory}/${work.id.toString()}/`}>
            <a>
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
                        src={`${work.thumb}`}
                        alt={work.description}
                        width={work.thumbWidth}
                        height={work.thumbHeight}
                        layout="responsive"
                    />
                </div>
            </a>
        </Link>
    );

}