import {DisplayObject} from "../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../TonkatsuDisplayLib/Display/CanvasLayer";
import {Mo01Snow} from "./Motion01-Sakura/Mo01Snow";
import {Mo02CellAutomaton} from "./Motion02-CellAutomaton/Mo02CellAutomaton";
import {Game02Falling} from "./Game02-Falling/Game02Falling";
import {ImageFile} from "../../TonkatsuDisplayLib/ImageLoader/ImageFile";
import {GameLoop} from "../../TonkatsuDisplayLib/GameLoop/GameLoop";
import {Game03TowerDefense} from "./Game03-TowerDefense/Game03TowerDefense";

export type CanvasContents = { id: string, displayObject: typeof DisplayObject };
export type CanvasWork = {
    root: DisplayObject,
    destruct: () => void,
}
/**
 * モーションワークを追加する時はこのリストに id とクラスを追加
 */
const canvasContents: CanvasContents[] = [
    {
        id: "202",
        displayObject: Game03TowerDefense
    },
    {
        id: "193",
        displayObject: Game02Falling
    },
    {
        id: "189",
        displayObject: Mo02CellAutomaton
    },
    {
        id: "181",
        displayObject: Mo01Snow
    },
];

/**
 * id を指定すると、対応するIDのモーションワークのインスタンスを返す
 */
export const getCanvasWork = (id: string, frameRate:number, layers: CanvasLayer[], imageFileList: ImageFile[] = []): CanvasWork | null => {

    const work = canvasContents.find(work => work.id === id);
    if (!work) return null;

    const displayObject = new work.displayObject(layers[0], {
        layerList: layers,
        imageFileList: imageFileList
    });

    const gameLoop = new GameLoop({
        layers,
        frameRate: frameRate,
    });
    gameLoop.displayList = [displayObject];
    gameLoop.start();

    return {
        root: displayObject,
        destruct: () => {
            gameLoop.stop();
            displayObject.destruct();
        }
    }
}