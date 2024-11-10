import {Timestamp} from "firebase/firestore";

export const formatTimestamp = (timestamp: Timestamp | null): string => {
    if (!timestamp) return 'たった今';

    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours < 24) {
        if (hours > 0) {
            return `${hours}時間前`;
        } else if (minutes > 0) {
            return `${minutes}分前`;
        } else {
            return 'たった今';
        }
    }

    return new Intl.DateTimeFormat('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};