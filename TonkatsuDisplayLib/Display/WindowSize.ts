import {useEffect, useState} from "react";
import {AtRule} from "csstype";
import {Size} from "./Size";

export type ScreenState = {
    size: Size;
    isMobile: boolean;
}

export const useWindowSize = ():ScreenState | undefined => {

    const [screenState, setScreenState] = useState<ScreenState>();

    useEffect(() => {

        const handleResize = () => {
            setScreenState({
                size: {
                    width: window.innerWidth,
                    height: window.innerHeight,
                },
                isMobile: window.innerWidth < 1020
            })
        };
        window.addEventListener("resize", handleResize)

        handleResize();

    }, [])

    return screenState;
}