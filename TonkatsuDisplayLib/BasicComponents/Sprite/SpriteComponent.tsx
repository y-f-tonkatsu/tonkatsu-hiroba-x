import {Component} from "../Component";
import {Size} from "../../Display/Size";
import {DisplayObject} from "../../Display/DisplayObject";
import {CanvasLayer} from "../../Display/CanvasLayer";

/**
 * 画像を表示するコンポーネント
 */
export class SpriteComponent extends Component {
    image: HTMLImageElement;
    size: Size;

    /**
     * 画像を表示するコンポーネント
     * @param parent 親の DisplayObject
     * @param image 表示する画像
     * @param size 画像の表示サイズ。元画像と合わせる必要はない。
     */
    constructor(parent: DisplayObject, image: HTMLImageElement, size: Size) {
        super(parent);
        this.image = image;
        this.size = size;
    }

    override render(layer: CanvasLayer) {
        if (!this.parent) return;
        if (!this.image) return;

        layer.context.drawImage(this.image,
            this.parent.renderTransform.position.x,
            this.parent.renderTransform.position.y,
            this.size.width,
            this.size.height
        )
    }

}