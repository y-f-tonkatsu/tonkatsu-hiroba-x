import {Work} from "../../types/Work";
import styles from "./ContentsPlayer.module.scss";
import {motion} from "framer-motion";
import {TransitAnimation} from "./ContentsPlayer";
import {FC} from "react";
import CanvasWorkContent from "./CanvasWorkContent";

type Props = {
    work: Work;
    transitAnimation: TransitAnimation | null;
}

const containerStyle = {
    minWidth: "100%",
    maxWidth: "100%",
}

/**
 * コンテンツのカテゴリに応じたコンポーネントを作って返す
 */
const Contents: FC<Props> = ({work, transitAnimation}) => {

    let content;
    if (transitAnimation == null || transitAnimation.status === "stop") {
        //遷移アニメーションなしの場合
        //遷移してこの状態になった場合は TransitAnimation オブジェクトが表示すべき Work を持っている
        //そうでない場合は work にそのまま入っている
        if (transitAnimation) work = transitAnimation.to;
        content = getNoTransitionContent(work);
    } else {
        content = getTransitionContent(work, transitAnimation);
    }

    return (
        <div
            key={"contentCarousel"}
            className={styles.contentCarousel}
        >
            {content}
        </div>

    )
}

/**
 * Work オブジェクトからコンテンツのJSXを作って返す。
 * 遷移アニメーションがない場合。
 * @param work Work オブジェクト
 */
function getNoTransitionContent(work: Work) {
    let content;
    const klass = getKlass(work.category);
    if (isCanvasWork(work)) {
        content = <CanvasWorkContent
            work={work}
        />
    } else {
        content = (
            <img key={`${work.path}`}
                 className={klass}
                 width={work.width}
                 height={work.height}
                 src={`${work.path}`}
                 alt={work.title}
            />
        );
        if (work.link) {
            content = <a href={work.link}>{content}</a>
        }
    }

    content = (
        <div
            key={"newContentContainer_" + work.id}
            style={{
                ...containerStyle,
                marginLeft: "0",
                opacity: 1,
            }}
        >
            {content}
        </div>
    );

    return content;

}

/**
 * Work オブジェクトからコンテンツのJSXを作って返す。
 * 遷移アニメーションがある場合。
 * @param work Work オブジェクト
 * @param transitAnimation アニメーションオブエジェクト
 */
function getTransitionContent(work: Work, transitAnimation: TransitAnimation) {

    let oldContent;
    let newContent;

    //work が遷移前に表示される Work
    //transitAnimation.to が遷移後に表示される Work(newWork)
    const newWork = transitAnimation.to;
    const newKlass = getKlass(newWork.category);

    //アニメーションの設定
    const duration = 0.5;

    //入ってくる方の要素を作る
    if (isCanvasWork(newWork)) {
        //アニメ作品の場合
        newContent = (
            <CanvasWorkContent
                work={newWork}
            />
        );
    } else {
        newContent = (
            <img
                className={`${newKlass}`}
                width={newWork.width}
                height={newWork.height}
                src={`${newWork.path}`}
                alt={newWork.title}
            />
        );
        //ゲームなどリンクが設定されている場合は <a> タグで囲む
        if (work.link) {
            newContent = <a href={work.link} key={`${newWork.path}`}>{newContent}</a>
        }
    }
    const newContainer = (
        <motion.div
            key={"newContentContainer_" + newWork.id}
            style={{
                ...containerStyle,
                opacity: 0,
                marginLeft: transitAnimation.direction === "next" ? "-100%" : 0,
            }}
            animate={{
                opacity: 1,
                marginLeft: 0,
            }}
            transition={{
                duration
            }}
            onAnimationComplete={transitAnimation.onAnimationCompleteListener}
        >
            {newContent}
        </motion.div>
    )


    //消える方の要素を作る
    if (isCanvasWork(work)) {
        oldContent = <CanvasWorkContent
            work={work}
        />
    } else {
        const klass = getKlass(work.category);
        oldContent = (
            <img
                className={klass}
                width={work.width}
                height={work.height}
                src={`${work.path}`}
                alt={work.title}
            />
        );
    }
    const oldContainer = (
        <motion.div
            key={"oldContentContainer_" + work.id}
            style={{
                ...containerStyle,
                marginLeft: "0",
                opacity: 1,
            }}
            animate={{
                marginLeft: transitAnimation.direction === "prev" ? "-100%" : "100%",
                opacity: 0,
            }}
            transition={{
                duration
            }}
        >
            {oldContent}
        </motion.div>
    )

    if (transitAnimation.direction === "prev") {
        return [oldContainer, newContainer];
    } else {
        return [newContainer, oldContainer];
    }
}

/**
 * work がモーションやゲームのような Canvas コンテンツがどうかを判定する。
 * ただし、リンクが張ってあるだけのものは false を返す。
 */
function isCanvasWork(work: Work):boolean {
    return work.category === "animation" ||
        (work.category === "game" && typeof work.link === "undefined");
}

/**
 * カテゴリに応じてコンテナに付与すべき CSS クラスを返す
 * @param category カテゴリ
 */
const getKlass = function (category: string): string {
    if (category === "manga") {
        return styles.imageManga;
    } else {
        return styles.imageMain;
    }

}

export default Contents;
