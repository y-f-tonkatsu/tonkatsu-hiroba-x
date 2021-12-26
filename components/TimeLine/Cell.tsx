import {NextPage} from "next";
import {Work} from "../../types/Work";
import Image from "next/image"

type Props = {
    work: Work
}

export const Cell: NextPage<Props> = (props: Props) => {

    const {work} = props;

    return (
        <div key={work.id}>
            <Image
                src={`/works/${work.thumb}`}
                alt={work.description}
                width={work.thumbWidth}
                height={work.thumbHeight}
                layout="responsive"
            />
        </div>
    );

}