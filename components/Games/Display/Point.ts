export type Point = {
    x: number,
    y: number,
};

export const Zero = {x: 0, y: 0}

type DirectionsType = {
    up: 0b1000,
    right: 0b0100,
    down: 0b0010,
    left: 0b0001
}

export const Directions: DirectionsType = {
    up: 0b1000,
    right: 0b0100,
    down: 0b0010,
    left: 0b0001
}

type DirectionVectorsType = {
    up: { x: 0, y: -1 },
    right: { x: 1, y: 0 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 }
};

export const DirectionVectors: DirectionVectorsType = {
    up: {x: 0, y: -1},
    right: {x: 1, y: 0},
    down: {x: 0, y: 1},
    left: {x: -1, y: 0}
}

export const DirectionStrings = [
    "up", "right", "down", "left"
];
export const isSamePoint = (point1: Point, point2: Point) => {
    return point1.x === point2.x && point1.y === point2.y;
}

export const addPoints = (point1: Point, point2: Point) => {
    return {x: point1.x + point2.x, y: point1.y + point2.y};
}