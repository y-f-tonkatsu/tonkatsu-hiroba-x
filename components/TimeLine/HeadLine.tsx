import {FC} from "react";
import styles from "./TimeLine.module.scss";

type Props = {

}

const HeadLine:FC<Props> = ({})=>{
    return (
        <div className={styles.containerHeadline}>
            <canvas width="500" height="500"></canvas>
        </div>
    )
}

export default HeadLine;