import {DisplayObject, DisplayObjectOptions} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {TileMapComponent} from "../../../TonkatsuDisplayLib/BasicComponents/TileMap/TileMapComponent";
import {TileMapWalkerComponent} from "../../../TonkatsuDisplayLib/BasicComponents/TileMap/TileMapWalkerComponent";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";

export class Game03TowerDefense extends DisplayObject {

    private readonly _map: DisplayObject;

    constructor(layer: CanvasLayer, options: DisplayObjectOptions) {
        super(layer, options);

        //タイルマップオブジェクトを作る
        const mapLayer = options.layerList[0];
        mapLayer.autoRefresh = false;
        this._map = new DisplayObject(mapLayer);
        this.add(this._map);
        const tileMapComp = new TileMapComponent(this._map, {
            imageList: options.imageFileList,
            tileSize: {width: 100, height: 100},
            mapData: [
                [0, 1, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 0],
                [0, 1, 0, 0, 1, 0],
                [0, 1, 0, 1, 1, 0],
                [0, 1, 0, 0, 0, 0],
                [0, 1, 1, 1, 1, 0],
                [0, 0, 0, 0, 1, 0],
            ]
        });
        this._map.attachComponent(tileMapComp);

        const enemySprites = options.imageFileList.filter(file=>file.id.indexOf("enemy_1") === 0);
        const mainLayer = options.layerList[1];
        const enemy = new DisplayObject(mapLayer);
        const walkerComponent = new TileMapWalkerComponent({
            parent: this,
            size: {width: 200, height: 200},
            images: enemySprites,
            centerPosition: "center",
            loop: true,
            cood: new Point(1, 1)
        });
        enemy.attachComponent(walkerComponent);
        this.add(enemy);

    }

    override update() {
        super.update();
    }

    override draw() {
        super.draw();
        const ctx = this.layer.context;
    }

}
