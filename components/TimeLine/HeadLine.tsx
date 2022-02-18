import {FC} from "react";
import styles from "./TimeLine.module.scss";
import "../Animator/Animator";
import Animator from "../Animator/Animator";

type Props = {}

const HeadLine: FC<Props> = ({}) => {
    return (
        <div className={styles.containerHeadline}>
            <Animator height={100} width={100}/>
        </div>
    )
}

export default HeadLine;