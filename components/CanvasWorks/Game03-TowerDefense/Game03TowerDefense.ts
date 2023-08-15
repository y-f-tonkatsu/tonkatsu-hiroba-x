import {DisplayObject, DisplayObjectOptions} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {TileMapComponent} from "../../../TonkatsuDisplayLib/BasicComponents/TileMap/TileMapComponent";

export class Game03TowerDefense extends DisplayObject {

    private readonly _map: DisplayObject;

    constructor(layer: CanvasLayer, options: DisplayObjectOptions) {
        super(layer, options);
        const mapLayer = options.layerList[0];
        mapLayer.autoRefresh = false;
        this._map = new DisplayObject(mapLayer);
        this.add(this._map);
        const tileMapComp = new TileMapComponent(this._map, {
            imageList: options.imageFileList,
            tileSize: {width: 100, height: 100},
            mapData: [[0, 1], [2, 3]]
        });
        this._map.attachComponent(tileMapComp);

    }

    override update() {
        super.update();
    }

    override draw() {
        super.draw();
        const ctx = this.layer.context;
    }

}
