import {DisplayObject} from "../Display/DisplayObject";
import {Transform} from "../Display/Transform";
import {CanvasLayer} from "../Display/CanvasLayer";

/**
 * 表示オブジェクトのコンポーネント基本クラス
 * 親の表示クラスの update, render メソッドで
 * すべてのコンポーネントの update, render が呼ばれる
 */
export class Component {
    private _parent?: DisplayObject;
    private _isActive: boolean = true;
    private _transform?: Transform;

    get transform(): Transform | undefined {
        return this._transform;
    }

    set transform(value: Transform | undefined) {
        this._transform = value;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }

    get parent(): DisplayObject | undefined {
        return this._parent;
    }

    set parent(value: DisplayObject | undefined) {
        this._parent = value;
    }

    constructor(parent: DisplayObject) {
        parent.attachComponent(this);
    }

    update() {
    };

    render(layer?: CanvasLayer) {
    };

}