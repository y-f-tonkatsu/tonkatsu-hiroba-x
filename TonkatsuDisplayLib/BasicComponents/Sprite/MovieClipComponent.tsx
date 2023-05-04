import {Component} from "../Component";
import {Size} from "../../Display/Size";
import {DisplayObject} from "../../Display/DisplayObject";
import {CanvasLayer} from "../../Display/CanvasLayer";
import {ImageFile} from "../../ImageLoader/ImageFile";
import {Point} from "../../Display/Point";
import {SpriteComponent} from "./SpriteComponent";
import {images} from "next/dist/build/webpack/config/blocks/images";

/**
 * 画像を表示するコンポーネント
 */
export class MovieClipComponent extends SpriteComponent {
    get currentFrame(): number {
        return this._currentFrame;
    }

    set currentFrame(value: number) {
        this._currentFrame = value;
    }

    get totalFrames(){
        return images.length
    }

    protected _images: ImageFile[];
    private _currentFrame:number = 0;

    /**
     * 画像を表示するコンポーネント
     * @param parent 親の DisplayObject
     * @param image 表示する画像
     * @param size 画像の表示サイズ。元画像と合わせる必要はない。
     * @param centerPosition 中心点の相対座標。デフォルトは(0, 0).
     */
    constructor(parent: DisplayObject, images: ImageFile[], size: Size, centerPosition?: Point | "center") {
        super(parent, images[0], size, centerPosition);
        this._images = images;
    }

    update() {
        super.update();
        this._currentFrame = Math.min(this._currentFrame + 1, this.totalFrames - 1);
        this._image = this._images[this._currentFrame];
    }

    override draw(layer: CanvasLayer) {
        super.draw(layer);
    }

}