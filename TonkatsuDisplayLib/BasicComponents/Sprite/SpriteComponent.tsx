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
    image: ImageFile;
    size: Size;
    centerPosition: Point;

    /**
     * 画像を表示するコンポーネント
     * @param parent 親の DisplayObject
     * @param image 表示する画像
     * @param size 画像の表示サイズ。元画像と合わせる必要はない。
     * @param centerPosition 中心点の相対座標。デフォルトは(0, 0).
     */
    constructor(parent: DisplayObject, image: ImageFile, size: Size, centerPosition?: Point) {
        super(parent);
        this.image = image;
        this.size = size;
        this.centerPosition = centerPosition || new Point(0, 0);
    }

    override render(layer: CanvasLayer) {
        if (!this.parent) return;
        if (!this.image) return;

        const ctx = layer.context;
        const {position, scale, rotation} = this.parent.renderTransform;
        const {x, y} = position;
        const w = this.size.width * scale.x;
        const h = this.size.height * scale.y;
        const cx = x + w * 0.5;
        const cy = y + h * 0.5;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.drawImage(this.image.element, -w * 0.5, -h * 0.5, w, h);
        ctx.restore();
    }

}