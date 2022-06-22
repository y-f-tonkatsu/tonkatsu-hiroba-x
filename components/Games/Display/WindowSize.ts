import {useEffect, useState} from "react";
import {AtRule} from "csstype";
import {Size} from "./Size";

export const useWindowSize = () => {

    const [size, setSize] = useState<Size>();

    useEffect(() => {

        const handleResize = () => {
            setSize({
                width: window.innerWidth - 120,
                height: window.innerHeight,
            })
        };
        window.addEventListener("resize", handleResize)

        handleResize();

    }, [])

    return size;
}