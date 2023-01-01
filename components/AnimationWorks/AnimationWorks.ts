import {DisplayObject} from "../../TonkatsuDisplayLib/Display/DisplayObject";
import {Mo01Sakura} from "./Motion01-Sakura/Mo01-Sakura";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";

export type AnimationWork = { id: string, displayObject: typeof DisplayObject };

/**
 * モーションワークを追加する時はこのリストに id とクラスを追加
 */
const works: AnimationWork[] = [
    {
        id: "181",
        displayObject: Mo01Sakura
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