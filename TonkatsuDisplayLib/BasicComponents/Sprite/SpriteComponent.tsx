import {Component} from "../Component";
import {Size} from "../../Display/Size";
import {DisplayObject} from "../../Display/DisplayObject";
import {CanvasLayer} from "../../Display/CanvasLayer";
import {ImageFile} from "../../ImageLoader/ImageFile";
import {Point} from "../../Display/Point";

/**
 * 画像を表示するコンポーネント
 */
export class SpriteComponent extends Component {
    protected _image: ImageFile;
    protected _size: Size;
    protected _centerPosition: Point;

    /**
     * 画像を表示するコンポーネント
     * @param parent 親の DisplayObject
     * @param image 表示する画像
     * @param size 画像の表示サイズ。元画像と合わせる必要はない。
     * @param centerPosition 中心点の相対座標。デフォルトは(0, 0). 中央にセットするときは "center" を指定。
     */
    constructor(parent: DisplayObject, image: ImageFile, size: Size, centerPosition?: Point | "center") {
        super(parent);
        this._image = image;
        this._size = size;
        if(centerPosition === "center"){
            this._centerPosition =new Point(this._size.width * 0.5, this._size.height * 0.5);
        } else {
            this._centerPosition = centerPosition || new Point(0, 0);
        }

    }

    override draw(layer: CanvasLayer) {
        super.draw(layer);

        const ctx = layer.context;
        const {position, scale, rotation} = this.parent.renderTransform;
        const {x, y} = position;
        const w = this._size.width * scale.x;
        const h = this._size.height * scale.y;
        const cx = x + this._centerPosition.x;
        const cy = y + this._centerPosition.y;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.drawImage(this._image.element, -w * 0.5, -h * 0.5, w, h);
        ctx.restore();
    }

}