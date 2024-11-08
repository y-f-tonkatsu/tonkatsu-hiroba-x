import { doc, getDoc, updateDoc, setDoc, getFirestore } from 'firebase/firestore';
import { firebaseApp } from './FirebaseApp';

const db = getFirestore(firebaseApp);
const COLLECTION_NAME = 'pyoyi_totals';

interface PyoyiData {
    contentId: string;
    totalCount: number;  // 総ピョーイ数
    uniqueCount: number; // 何人がピョーイしたか（内部データ）
}

// 表示用に合計値のみを返す
export const getPyoyiCount = async (contentId: string): Promise<number> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, contentId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data().totalCount || 0) : 0;
    } catch (error) {
        console.error("Error getting pyoyi count:", error);
        return 0;
    }
};

// 内部では両方のカウントを更新
export const incrementPyoyiCount = async (contentId: string, incrementBy: number = 1): Promise<number> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, contentId);
        const docSnap = await getDoc(docRef);

        let newTotalCount: number;
        if (docSnap.exists()) {
            const currentData = docSnap.data() as PyoyiData;
            newTotalCount = (currentData.totalCount || 0) + incrementBy;
            await updateDoc(docRef, {
                totalCount: newTotalCount,
                uniqueCount: (currentData.uniqueCount || 0) + 1
            });
        } else {
            newTotalCount = incrementBy;
            await setDoc(docRef, {
                contentId,
                totalCount: newTotalCount,
                uniqueCount: 1
            });
        }

        return newTotalCount;
    } catch (error) {
        console.error("Error updating pyoyi count:", error);
        throw error;
    }
};