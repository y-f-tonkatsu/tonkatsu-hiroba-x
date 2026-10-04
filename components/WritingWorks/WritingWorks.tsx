import {writing311} from "./311_books001";

export const WritingWorks = [{
    id: 311,
    content: writing311
}]

export const getWritingWorks = (id: number): JSX.Element => {
    const work = WritingWorks.find(work=> id===work.id);
    if (!work) return <></>
    return work.content;
}