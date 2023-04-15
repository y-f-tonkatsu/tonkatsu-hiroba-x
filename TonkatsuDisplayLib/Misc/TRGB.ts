export type TRGB = {
    r: number,
    g: number,
    b: number
};

export const randomByte = () => {
    return Math.floor(Math.random() * 255);
}

export const randomRGB = (): TRGB => {
    return {
        r: randomByte(),
        g: randomByte(),
        b: randomByte(),
    };
}

export const randomMonoRGB = (): TRGB => {
    const v = randomByte();
    return {
        r: v,
        g: v,
        b: v,
    };
}

export const rgbToColor = (rgb: TRGB): string => {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

export const mixRGB = (a: TRGB, b: TRGB): TRGB => {
    return {
        r: (a.r + b.r) * 0.5,
        g: (a.g + b.g) * 0.5,
        b: (a.b + b.b) * 0.5,
    }
}

