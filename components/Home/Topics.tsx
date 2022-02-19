import {FC} from "react";
import styles from "./Topics.module.scss";

type Props = {

}

const Topics:FC<Props> = ()=>{

    return (
        <div key={"ContainerTopics"} className={styles.containerTopics}>
            <h2 className={styles.titleTopics}>トピック</h2>
            <div>
                本日白昼、大学生と見られる男ら３人が埼玉県春日部市の山田うどんにヒロミチナカノのパーカー等を着用して押し入り、生姜焼き定食等を注文した上、うどんをセットにするなどした疑いが持たれている。捜査関係者によると店に被害はなく、売上総額は2530円に上るという。
            </div>
        </div>
    );
}

export default Topics;
