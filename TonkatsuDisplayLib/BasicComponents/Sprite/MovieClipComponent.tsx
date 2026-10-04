import {Size} from "../../Display/Size";
import {DisplayObject} from "../../Display/DisplayObject";
import {CanvasLayer} from "../../Display/CanvasLayer";
import {ImageFile} from "../../ImageLoader/ImageFile";
import {Point} from "../../Display/Point";
import {SpriteComponent} from "./SpriteComponent";

export type MovieClipComponentOptions = {
    parent: DisplayObject,
    images: ImageFile[],
    size: Size,
    centerPosition?: Point | "center",
    loop: boolean
}

/**
 * SpriteComponent の派生クラス。
 * 画像リストの画像をフレームごとに更新してアニメーションを描画するコンポーネント。
 * 各画像のサイズは同じである想定。
 */
export class MovieClipComponent extends SpriteComponent {
    get loop(): boolean {
        return this._loop;
    }

    set loop(value: boolean) {
        this._loop = value;
    }

    get currentFrame(): number {
        return this._currentFrame;
    }

    set currentFrame(value: number) {
        this._currentFrame = value;
    }

    get totalFrames() {
        return this._images.length
    }

    protected _images: ImageFile[];
    private _loop: boolean = false;
    private _currentFrame: number = 0;

    /**
     * 画像を表示するコンポーネント
     * @param parent 親の DisplayObject
     * @param image 表示する画像
     * @param size 画像の表示サイズ。元画像と合わせる必要はない。
     * @param centerPosition 中心点の相対座標。デフォルトは(0, 0).
     */
    constructor(options: MovieClipComponentOptions) {
        super({
            parent: options.parent,
            image: options.images[0],
            size: options.size,
            centerPosition: options.centerPosition
        });
        this._images = options.images;
        this._loop = options.loop;
    }

    update() {
        super.update();

        if (this.totalFrames === 0) return;

        this._currentFrame++;
        if (this._loop) {
            while (this._currentFrame > this.totalFrames - 1) {
                this._currentFrame -= this.totalFrames;
            }
        } else {
            if (this._currentFrame > this.totalFrames - 1) {
                this._currentFrame = this.totalFrames - 1;
            }
        }
        this._image = this._images[this._currentFrame];
    }

    override draw(layer: CanvasLayer) {
        super.draw(layer);
    }

}