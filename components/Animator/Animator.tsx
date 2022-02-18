import {FC, useEffect, useRef, useState} from "react";
import styles from "./Animator.module.scss";
import AnimateCC, {GetAnimationObjectParameter} from "react-adobe-animate";

type AnimatorProps = {
    width: number,
    height: number
}

const Animator: FC<AnimatorProps> = (animationProps: AnimatorProps) => {


    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [anim, setAnim] = useState({});
    const [animationObject, getAnimationObject] = useState<GetAnimationObjectParameter | null>(null);

    useEffect(() => {

        const canvas = canvasRef.current;
        if (!canvas) return;

        /*
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;
        ctx.moveTo(0, 0);
        ctx.lineTo(200, 100);
        ctx.stroke();
        */

    }, [anim]);


    return (
        <div className={styles.containerAnimator}
        >
            <AnimateCC
                animationName="animation_ex"
                getAnimationObject={getAnimationObject}
            />
        </div>
    );

}

export default Animator;