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
    private _parent?: DisplayObject;
    private _isActive: boolean = true;
    private _canSkipRender: boolean = false;
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

    get canSkipRender(): boolean {
        return this._canSkipRender;
    }

    set canSkipRender(value: boolean) {
        this._canSkipRender = value;
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

    draw(layer?: CanvasLayer) {
    };

}