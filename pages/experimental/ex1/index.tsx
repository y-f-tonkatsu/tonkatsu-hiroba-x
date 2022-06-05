import {NextPage} from "next";
import {useEffect, useRef, useState} from "react";
import {createGameLoop, GameLooper, GameLoopOptions} from "../../../components/Games/GameLoop/GameLoop";
import {DisplayObject} from "../../../components/Games/Display/DisplayObject";

type Field = {
    width: number;
    height: number;
    tileSize: number;
    fps: number;
}

const Ex1: NextPage = () => {

    const field: Field = {
        width: 40,
        height: 30,
        tileSize: 30,
        fps: 24
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const hero: DisplayObject = {
        position: {
            x: 0, y: 0
        },
        render: ctx => {
            if (!ctx) return;
            ctx.clearRect(
                0,
                0,
                field.width * field.tileSize,
                field.height * field.tileSize
            );
            ctx.fillRect(
                hero.position.x * field.tileSize,
                hero.position.y * field.tileSize,
                field.tileSize,
                field.tileSize,
            );
        },
        update: delta => {
            let {x, y} = hero.position;
            if (Math.random() > 0.5) {
                x += 1;
            } else {
                y += 1;
            }
            if (x > field.width) x -= (field.width - 1);
            if (y > field.height) y -= (field.height - 1);
            hero.position = {x, y};
        }
    };

    //DOM ロード時にゲームループをスタートする
    useEffect(() => {
        console.log("## Effect ##");

        //コンテキスト取得
        if (canvasRef.current === null) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const gameLoop = createGameLoop({
            frameRate: 24,
            ctx: ctx
        });

        gameLoop.setUpdateList([
            hero
        ]);
        gameLoop.start();

        return () => {
            console.log("## End ##");
            gameLoop.stop();
        };

    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                key="MainCanvas"
                width={field.width * field.tileSize}
                height={field.height * field.tileSize}>
            </canvas>
        </>
    );
}

export default Ex1;