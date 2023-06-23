import {Transform} from "../Display/Transform";

/**
 * アニメーションを定義するオブジェクトの基本クラス
 * これを継承してアニメーション制御クラスを作る
 */
export class Animation {
    _progress: number = 0;
    protected _duration: number = 0;

    animate(transform: Transform): boolean {
        return false;
    }
}