import {Work} from "../../types/Work";
import {Cell} from "./Cell";
import styles from "./TimeLine.module.scss"

type Props = {
    works: Work[][]
}

export const TimeLine = (props: Props) => {

    const {works} = props;

    const cols = works.map((col, index) => {
        return (
            <div key={index} className={styles.colsTimeLine}>
                {col.map((work) => <Cell work={work}/>)}
            </div>
        )
    });

    return (
        <div className={styles.containerTimeLine}>
            {cols}
        </div>
    );

}