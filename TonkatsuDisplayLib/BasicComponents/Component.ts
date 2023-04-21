import {DisplayObject} from "../Display/DisplayObject";
import {Transform} from "../Display/Transform";
import {CanvasLayer} from "../Display/CanvasLayer";

/**
 * 表示オブジェクトのコンポーネント基本クラス
 * 親の表示クラスの update, draw メソッドで
 * すべてのコンポーネントの update, draw が呼ばれる
 * ※ draw メソッドは元の名前は render だったが、
 * Vercel 上で FC と区別が付かなくなるようで
 * ビルドエラーになるので draw にした
 */
export class Component {
    private _parent: DisplayObject;
    private _isActive: boolean = true;
    private _canSkipRender: boolean = false;
    private _transform: Transform = new Transform();

    get transform(): Transform {
        return this._transform;
    }

    set transform(value: Transform) {
        this._transform = value;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }

    get canSkipRender(): boolean {
        return this._canSkipRender;
    }

    set canSkipRender(value: boolean) {
        this._canSkipRender = value;
    }

    get parent(): DisplayObject {
        return this._parent;
    }

    set parent(value: DisplayObject) {
        this._parent = value;
    }

    constructor(parent: DisplayObject) {
        this._parent = parent;
        parent.attachComponent(this);
    }

    update() {
    };

    draw(layer?: CanvasLayer) {
    };

}