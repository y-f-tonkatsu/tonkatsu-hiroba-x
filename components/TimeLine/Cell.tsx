import {NextPage} from "next";
import {Work} from "../../types/Work";

type Props = {
    work: Work
}

export const Cell:NextPage<Props> = (props:Props)=>{

    const {work} = props;

    return (
        <div>
        </div>
    );

}