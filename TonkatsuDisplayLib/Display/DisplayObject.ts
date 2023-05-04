import {Transform} from "./Transform";
import {Component} from "../BasicComponents/Component";
import {CanvasLayer} from "./CanvasLayer";
import {ImageFile} from "../ImageLoader/ImageFile";

export type Render = (ctx: CanvasRenderingContext2D) => void;
export type DisplayObjectOptions = {
    layerList: CanvasLayer[],
    imageFileList: ImageFile[]
}

/**
 * 表示可能なオブジェクト
 * position は canvas 上の座標
 * ゲームループに加えると
 * フレームが更新されるたびに、
 * update, render が呼ばれる。
 * 複数フレームが一度に更新される場合は
 * update が複数, render が1回だけ呼ばれることもある。
 * update, render メソッド上で
 * children 及び components に含まれるオブジェクトの
 * update, render が再帰的に呼ばれる。
 */
export class DisplayObject {
    get imageFileList(): ImageFile[] {
        return this._imageFileList;
    }

    set imageFileList(value: ImageFile[]) {
        this._imageFileList = value;
    }

    get layerList(): CanvasLayer[] {
        return this._layerList;
    }

    set layerList(value: CanvasLayer[]) {
        this._layerList = value;
    }

    get layer(): CanvasLayer {
        return this._layer;
    }

    set layer(value: CanvasLayer) {
        this._layer = value;
    }

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

    get canSkipRender(): boolean {
        return this._canSkipRender;
    }

    set canSkipRender(value: boolean) {
        this._canSkipRender = value;
    }

    private _transform: Transform = new Transform();
    private _renderTransform: Transform = new Transform();
    private _components: Component[] = [];
    private _children: DisplayObject[] = [];
    private _parent?: DisplayObject;
    private _isActive: boolean = true;
    private _canSkipRender: boolean = false;
    private _layer: CanvasLayer;
    private _layerList: CanvasLayer[] = [];
    private _imageFileList: ImageFile[] = [];

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

    update() {

        if (!this.isActive) return;

        //_renderTransform をコンポーネントとの合算前にリセット
        this._renderTransform.substitute(this.transform);
        this._components.forEach(compo => {
            if (!compo.isActive) return;
            compo.update();
            if (compo.transform) {
                //_renderTransform に全てのコンポーネントの transform を加算したものを算出してから draw に使う
                this._renderTransform.add(compo.transform);
            }
        })
        this._children.forEach(child => {
            if (!child.isActive) return;
            child.update();
        })
    };

    draw() {
        if (!this.isActive || this.canSkipRender) return;
        this._components.forEach(compo => {
            if (!compo.isActive || compo.canSkipRender) return;
            compo.draw(this._layer);
        })
        this._children.forEach(child => {
            if (!child.isActive || child.canSkipRender) return;
            child.draw();
        })
    };

    destruct() {
        this._children.forEach(child => {
            child.destruct();
        })
    }

    constructor(layer: CanvasLayer, options?: DisplayObjectOptions) {
        this._layer = layer;
        this._layerList = [];
        this._imageFileList = [];
        if (options) {
            this.layerList = options.layerList;
            this.imageFileList = options.imageFileList;
        }
    }
}