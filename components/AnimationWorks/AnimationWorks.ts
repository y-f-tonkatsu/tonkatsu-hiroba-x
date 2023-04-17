import {DisplayObject} from "../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Mo01Snow} from "./Motion01-Sakura/Mo01Snow";
import {Mo02CellAutomaton} from "./Motion02-CellAutomaton/Mo02CellAutomaton";
import {Mo03Falling} from "./Motion03-Falling/Mo03Falling";

export type AnimationWork = { id: string, displayObject: typeof DisplayObject };

/**
 * モーションワークを追加する時はこのリストに id とクラスを追加
 */
const works: AnimationWork[] = [
    {
        id: "181",
        displayObject: Mo01Snow
    },
    {
        id: "189",
        displayObject: Mo02CellAutomaton
    },
    {
        id: "190",
        displayObject: Mo03Falling
    },
];

/**
 * id を指定すると、対応するIDのモーションワークのインスタンスを返す
 * @param id モーションワークの ID
 * @param layer 表示レイヤー
 */
export const getAnimationWork = (id: string, layer: CanvasLayer): DisplayObject | null => {
    const work = works.find(work => work.id === id);
    if (!work) return null;
    return new work.displayObject(layer);
}