import {useState, useEffect, useRef} from 'react';
import {getPyoyiCount, incrementPyoyiCount} from './PyoyiStore';
import styles from './PyoyiButton.module.css';

interface PyoyiButtonProps {
    contentId: string;
}

interface PopupText {
    text: string;
    isAnimating: boolean;
    key: number;
}

export default function PyoyiButton({contentId}: PyoyiButtonProps) {
    const [totalCount, setTotalCount] = useState(0);
    const [clickCount, setClickCount] = useState(0);
    const [isAcceptingClicks, setIsAcceptingClicks] = useState(true);
    const [popupText, setPopupText] = useState<PopupText | null>(null);
    const [animationKey, setAnimationKey] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const lastClickTimeRef = useRef(0);

    // 全状態のリセット関数
    const resetState = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setClickCount(0);
        setIsAcceptingClicks(true);
        setPopupText(null);
        setAnimationKey(0);
        lastClickTimeRef.current = 0;
    };

    useEffect(() => {
        // contentId変更時にリセット
        resetState();

        // 新しいcontentIdの初期カウント取得
        const fetchInitialCount = async () => {
            try {
                const count = await getPyoyiCount(contentId);
                setTotalCount(count);
            } catch (error) {
                console.error('Failed to fetch initial count:', error);
            }
        };

        fetchInitialCount();

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [contentId]);  // contentIdの変更を監視
    const getTimeoutDuration = (clicks: number) => {
        return Math.max( 10000 / (clicks * 3 + 10), 10);
    };

    const getPyoyiText = (count: number) => {
        if (count <= 1) return 'ピョーイ！';
        if (count === 2) return 'ピョイピョーイ！';
        if (count === 3) return 'ピョイピョイピョーイ！';
        if (count === 4) return 'ピョピョイピョイピョーイ！';
        return 'ピョ'.repeat(count - 3) + 'ピョイピョイピョーイ！';
    };

    const finalizePyoyi = async (finalCount: number) => {
        // 最後のテキストをフェードアウト
        setPopupText(prev => prev ? {...prev, isAnimating: true} : null);

        // カウントを送信（最終クリック回数を送信）
        const newTotal = await incrementPyoyiCount(contentId, finalCount);
        setTotalCount(newTotal);

        // クリック受付を停止
        setIsAcceptingClicks(false);
    };

    const handleClick = () => {
        if (!isAcceptingClicks) return;

        const now = Date.now();
        const isValidClick = clickCount === 0 ||
            (now - lastClickTimeRef.current) <= getTimeoutDuration(clickCount);

        if (isValidClick) {
            // 前のタイマーをクリア
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            const newClickCount = clickCount + 1;
            setClickCount(newClickCount);
            lastClickTimeRef.current = now;

            // アニメーションをリセットして新しいテキストを表示
            setAnimationKey(prev => prev + 1);
            setPopupText({
                text: getPyoyiText(newClickCount),
                isAnimating: false,
                key: animationKey
            });

            // 新しいタイマーを設定
            timeoutRef.current = setTimeout(() => {
                finalizePyoyi(newClickCount);
            }, getTimeoutDuration(newClickCount));
        }
    };

    return (
        <div className={styles.container}>
            <button
                onClick={handleClick}
                className={styles.button}
                disabled={!isAcceptingClicks}
            >
                ピョーイ！👍️
                <span className={styles.subText}>
          {isAcceptingClicks ? '連打しよう💩' : `${clickCount}ピョーイ！ おめでとう💩`}
        </span>
            </button>

            <div className={styles.popupContainer}>
                {popupText && (
                    <div
                        key={popupText.key}
                        className={`${styles.popupText} ${popupText.isAnimating ? styles.fadeOut : ''}`}
                    >
                        {popupText.text}
                    </div>
                )}
            </div>

            <div className={styles.totalCount}>
                {totalCount} ピョーイ！
            </div>
        </div>
    );
}