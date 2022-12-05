import {Transform} from "../Display/Transform";

/**
 * アニメーションを定義するオブジェクトの基本クラス
 */
export class Animation {
    _progress: number = 0;
    protected _duration: number = 0;

    animate(transform: Transform): boolean {
        return false;
    }
}