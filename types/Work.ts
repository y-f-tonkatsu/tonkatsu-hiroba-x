import {GameWorkOptions} from "./GameWorkOptions";
import {JSXElement} from "@babel/types";

export type Work = {
    id: number,
    title: string,
    description: string,
    info: string,
    path: string,
    thumb: string,
    lastBuildDate: string,
    width: number,
    height: number
    thumbWidth: number,
    thumbHeight: number,
    category: string,
    link?: string,
    gameWorkOptions?: GameWorkOptions,
};