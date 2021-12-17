import {NextPage} from "next";
import {Work} from "../../types/Work";
import {Cell} from "./Cell";

type Props = {
    works: Work[]
}

export const TimeLine = (props: Props) => {

    const {works} = props;

    return (
        <div>
            {works.map(work => <Cell work={work} key={work.id} />)}
        </div>
    );

}