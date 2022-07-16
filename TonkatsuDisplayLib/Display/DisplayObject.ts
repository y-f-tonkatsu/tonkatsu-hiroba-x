import {Transform} from "./Transform";
import {Component} from "../BasicComponents/Component";

export type Update = (delta: number) => void;
export type Render = (ctx: CanvasRenderingContext2D) => void;

/**
 * 表示可能なオブジェクト
 * position は canvas 上の座標
 * ゲームループに加えると
 * フレームが更新されるたびに、
 * update, render が呼ばれる。
 * update, render メソッド上で
 * children 及び components に含まれるオブジェクトの
 * update, render が再帰的に呼ばれる。
 */
export class DisplayObject {
    private _transform: Transform = new Transform();
    private _renderTransform: Transform = new Transform();
    private _components: Component[] = [];
    private _children: DisplayObject[] = [];
    private _parent: DisplayObject | undefined;
    private _isActive: boolean = true;

    get parent(): DisplayObject | undefined {
        return this._parent;
    }

    set parent(value: DisplayObject | undefined) {
        this._parent = value;
    }

    get children(): DisplayObject[] {
        return this._children;
    }

    set children(value: DisplayObject[]) {
        this._children = value;
    }

    get transform(): Transform {
        return this._transform;
    }

    set transform(value: Transform) {
        this._transform = value;
    }

    get renderTransform(): Transform {
        return this._renderTransform;
    }

    set renderTransform(value: Transform) {
        this._renderTransform = value;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }

    /**
     * 別の DisplayObject を children に加える
     * 対象オブジェクトの parent も設定される。
     * @param displayObject 加える DisplayObject
     */
    add(displayObject: DisplayObject) {
        displayObject._parent = this;
        this._children.push(displayObject);
    }

    /**
     * コンポーネントを追加する。
     * 対象コンポーネントの parent も設定される。
     * @param components 追加対象の Component
     */
    attachComponent(...components: Component[]) {
        components.forEach(component => {
            component.parent = this;
            this._components.push(component)
        })
    }

    update(delta: number) {
        if (!this.isActive) return;
        this._renderTransform.substitute(this.transform);
        this._components.forEach(compo => {
            if (!compo.isActive) return;
            compo.update(delta);
            if (compo.transform) {
                this._renderTransform.add(compo.transform);
            }
        })
    };

    render(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) return;
        this._components.forEach(compo => {
            if (!compo.isActive) return;
            compo.render(ctx);
        })
    };

    constructor() {

    }
}