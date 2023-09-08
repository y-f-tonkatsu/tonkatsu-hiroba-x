import {DisplayObject, DisplayObjectOptions} from "../../../TonkatsuDisplayLib/Display/DisplayObject";
import {CanvasLayer} from "../../../TonkatsuDisplayLib/Display/CanvasLayer";
import {TileMapComponent} from "../../../TonkatsuDisplayLib/BasicComponents/TileMap/TileMapComponent";
import {Point} from "../../../TonkatsuDisplayLib/Display/Point";
import {TileMapWalkerComponent} from "../../../TonkatsuDisplayLib/BasicComponents/TileMap/TileMapWalkerComponent";
import {SpawnerComponent} from "../../../TonkatsuDisplayLib/BasicComponents/Spawn/SpawnerComponent";
import {Size} from "../../../TonkatsuDisplayLib/Display/Size";

export class Game03TowerDefense extends DisplayObject {

    private readonly _map: DisplayObject;

    private _tileSize: Size;
    private _mapSize: Size = {width: 11, height: 11};
    private _spawner: SpawnerComponent;

    constructor(layer: CanvasLayer, options: DisplayObjectOptions) {
        super(layer, options);

        //レイヤー設定
        const mapLayer = options.layerList[0];
        mapLayer.autoRefresh = false;
        const mainLayer = options.layerList[1];
        mainLayer.autoRefresh = true;

        //TileMap
        const shorter = Math.min(mapLayer.width, mapLayer.height);
        this._tileSize = {
            width: Math.floor(shorter / this._mapSize.width),
            height: Math.floor(shorter / this._mapSize.height),
        }
        const {map, tileMapComp} = this.createMap(mapLayer, options);
        this._map = map;

        //Spawner
        this._spawner = this.createSpawner(mainLayer, options, tileMapComp);

    }

    private createMap(mapLayer: CanvasLayer, options: DisplayObjectOptions) {
        const map = new DisplayObject(mapLayer);
        this.add(map);
        let mapData: number[][] = [];
        let w = this._mapSize.width;
        let h = this._mapSize.height;
        for (let y = 0; y < h; y++) {
            mapData[y] = []
            for (let x = 0; x < w; x++) {

                //スタートとゴール
                if (
                    (y == 0 && x == 1) ||
                    (y == h - 1 && x == w - 2)
                ) {
                    mapData[y].push(0);
                    continue;
                }

                //外壁
                if (
                    y == 0 || y == h - 1 ||
                    x == 0 || x == w - 1
                ) {
                    mapData[y].push(1);
                    continue;
                }

                //内部の迷路
                if (y % 4 == 2 && x !== w - 2) {
                    mapData[y].push(1);
                    continue;
                }
                if (y % 4 == 0 && x !== 1) {
                    mapData[y].push(1);
                    continue;
                }

                mapData[y].push(0);

            }
        }
        const tileMapComp = new TileMapComponent(map, {
            imageList: options.imageFileList,
            tileSize: this._tileSize,
            mapData,
            start: new Point(1, 0),
            goal: new Point(mapData[0].length - 2, mapData.length - 1),
            tiles: [
                {
                    image: options.imageFileList[0].element,
                    isPassable: true,
                },
                {
                    image: options.imageFileList[1].element,
                    isPassable: false,
                },
                {
                    image: options.imageFileList[2].element,
                    isPassable: false,
                },
            ]
        });
        return {map, tileMapComp};
    }

    private createSpawner(mainLayer: CanvasLayer, options: DisplayObjectOptions, tileMapComp: TileMapComponent) {
        const enemySprites = options.imageFileList.filter(file => file.id.indexOf("enemy_1") === 0);

        const spawner = new DisplayObject(mainLayer);
        this.add(spawner);
        const spawnerComponent = new SpawnerComponent(spawner, () => {
            const enemy = new DisplayObject(mainLayer);
            new TileMapWalkerComponent({
                parent: enemy,
                size: this._tileSize,
                images: enemySprites,
                centerPosition: "center",
                loop: true,
                tileMap: tileMapComp,
                cood: new Point(1, 0),
                tileSize: this._tileSize,
                onGoal: () => {
                    spawnerComponent.kill(enemy)
                }
            });
            return enemy;
        });
        return spawnerComponent;
    }

    override update() {
        super.update();
        if (Math.random() > 0.9) {
            this._spawner.spawn();
        }
    }

    override draw() {
        super.draw();
    }

}
