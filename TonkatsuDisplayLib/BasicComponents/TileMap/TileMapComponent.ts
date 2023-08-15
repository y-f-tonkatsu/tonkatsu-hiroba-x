import {Component} from "../Component";
import {DisplayObject} from "../../Display/DisplayObject";
import {CanvasLayer} from "../../Display/CanvasLayer";
import {ImageFile} from "../../ImageLoader/ImageFile";
import {Size} from "../../Display/Size";
import {Point} from "../../Display/Point";

export type MapData = number[][];
export type TileMapComponentOptions = {
    imageList: ImageFile[], tileSize: Size, mapData: MapData
}

export class TileMapComponent extends Component {
    get mapData(): MapData {
        return this._mapData;
    }

    set mapData(value: MapData) {
        this.canSkipRender = false;
        this._mapData = value;
    }

    private _imageList: ImageFile[];
    private _mapData: MapData = [];
    private _tileSize: Size;

    constructor(parent: DisplayObject, options: TileMapComponentOptions) {
        super(parent);
        this._imageList = options.imageList;
        this._tileSize = options.tileSize;
        this.mapData = options.mapData;
    }

    update() {
        super.update();
    }

    draw(layer: CanvasLayer) {
        super.draw(layer);

        this.mapData.forEach((row, y) => {
            row.forEach((id, x) => {
                this.drawTile(layer.context, this.getTileImage(id), x, y);
            })
        })

        //一度描画したらマップが更新されるまで再レンダーしない
        this.canSkipRender = true;
    }

    drawTile(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number) {
        const {position, scale, rotation} = this.parent.renderTransform;
        const w = this._tileSize.width * scale.x;
        const h = this._tileSize.height * scale.y;
        const cx = position.x;
        const cy = position.y;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);
        ctx.drawImage(img, x * w, y * h, w, h);
        ctx.restore();

    }

    getTileImage(id: number): HTMLImageElement {
        return this._imageList[id].element;
    }

}