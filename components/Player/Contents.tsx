import {Work} from "../../types/Work";
import styles from "./ContentsPlayer.module.scss";
import {motion} from "framer-motion";
import {TransitAnimation} from "./ContentsPlayer";
import {FC} from "react";

type Props = {
    work: Work;
    transitAnimation: TransitAnimation | null;
}

/**
 * コンテンツのカテゴリに応じたコンポーネントを作って返す
 * @param work コンテンツ
 */
const Contents: FC<Props> = ({work, transitAnimation}) => {

    let image = null;
    let newImage = null;
    let klass = getKlass(work.category);

    if (transitAnimation == null || transitAnimation.status === "stop") {
        if (transitAnimation) work = transitAnimation.to;
        return (
            <img key={`${work.path}`}
                 className={klass}
                 width={work.width}
                 height={work.height}
                 src={`${work.path}`}
                 alt={work.title}
            />
        );
    } else {
        const newWork = transitAnimation.to;
        const newKlass = getKlass(newWork.category);

        let anim;
        let newAnim = {opacity: 1, marginLeft: "0%"};
        let newStyle;
        if (transitAnimation.direction == "prev") {
            anim = {scale: 0, marginLeft: "-100%"}
            newStyle = {opacity: 0, marginLeft: "100%"}
        } else {
            anim = {scale: 0, marginLeft: "100%"}
            newStyle = {opacity: 0, marginLeft: "-100%"}
        }

        newImage = (
            <motion.img
                animate={newAnim}
                transition={{duration: 0.5}}
                key={`${newWork.path}`}
                className={`${newKlass} ${styles.imageNew}`}
                style={newStyle}
                width={newWork.width}
                height={newWork.height}
                src={`${newWork.path}`}
                alt={newWork.title}
            />
        );


        image = (
            <motion.img
                animate={anim}
                transition={{duration: 0.5}}
                onAnimationComplete={transitAnimation.onAnimationCompleteListener}
                key={`${work.path}`}
                className={klass}
                style={{
                    position: "absolute"
                }}
                width={work.width}
                height={work.height}
                src={`${work.path}`}
                alt={work.title}
            />
        );
        return (
            <>
                {[image, newImage]}
            </>
        );
    }

}

const getKlass = function (category: string): string {
    if (category === "manga") {
        return styles.imageManga;
    } else {
        return styles.imageMain;
    }

}

export default Contents;
