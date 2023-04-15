import {DisplayObject} from "../../TonkatsuDisplayLib/Display/DisplayObject";
import {Mo01Snow} from "./Motion01-Sakura/Mo01Snow";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Mo02CellAutomaton} from "./Motion02-CellAutomaton/Mo02CellAutomaton";

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