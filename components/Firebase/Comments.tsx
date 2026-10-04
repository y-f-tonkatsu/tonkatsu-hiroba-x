import React, {useState, useEffect} from 'react';
import {db} from './FirebaseApp';
import {collection, addDoc, query, orderBy, getDocs, Timestamp, serverTimestamp} from 'firebase/firestore';
import styles from './Comments.module.css';
import sideStyles from '../Player/ContentsPlayer.module.css';
import {ICONS} from "./Icons";
import type {IconData, Comment, CommentFormData, CommentsProps} from './CommentTypes';
import {generateComment, generateName} from "./CommentGenerator";
import {formatTimestamp} from "./Timestamp";

const CELEBRATORY_MESSAGES: string[] = [
    "ヒューヒューパラリラパラリラ💩",
    "わっしょーい！わっしょーい！🎊",
    "ズンドコズンドコ🌟",
    "えいえいおー！🚀",
    "わちゃわちゃぽよよーん🎈"
];

const Comments: React.FC<CommentsProps> = ({contentId}) => {
    const [name, setName] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [selectedIcon, setSelectedIcon] = useState<IconData>(ICONS[0]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [celebration, setCelebration] = useState<string>('');

    useEffect(() => {
        const storedName = localStorage.getItem('commentName');
        const storedIcon = localStorage.getItem('commentIcon');
        if (storedName) {
            setName(storedName);
        } else {
            const generatedName = generateName();
            setName(generatedName);
        }
        if (storedIcon) {
            setSelectedIcon(JSON.parse(storedIcon));
        } else {
            const randomIcons = ICONS[Math.floor(Math.random() * ICONS.length)];
            setSelectedIcon(randomIcons);
        }
    }, []);

    useEffect(() => {
        setComment(generateComment());
    }, []);

    const fetchComments = async () => {
        const q = query(
            collection(db, 'comment_threads', contentId, 'comments'),
            orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedComments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Comment[];
        setComments(fetchedComments);
    };

    useEffect(() => {

        fetchComments();
    }, [contentId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !comment.trim()) return;

        try {
            const commentData: CommentFormData = {
                name,
                comment,
                icon: selectedIcon,
                timestamp: serverTimestamp()
            };

            await addDoc(collection(db, 'comment_threads', contentId, 'comments'), commentData);

            const message = CELEBRATORY_MESSAGES[
                Math.floor(Math.random() * CELEBRATORY_MESSAGES.length)
                ];
            setCelebration(message);
            setTimeout(() => setCelebration(''), 2000);

            setComment(generateComment());

            await fetchComments();

        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleIconSelect = (icon: IconData) => {
        setSelectedIcon(icon);
        localStorage.setItem('commentIcon', JSON.stringify(icon));
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setName(newName);
        localStorage.setItem('commentName', newName);
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    return (
        <div className={styles.container}>

            <div className={styles.commentList}>
                {comments.map((c) => (
                    <div key={c.id} className={[styles.commentItem, sideStyles.contentSideDescription].join(" ")}>
                        <div className={styles.commentNameRow}>
                            <div className={styles.commentIcon}>
                                <img src={`/images/icons/${c.icon.filename}`} alt={c.icon.name}/>
                            </div>
                            <div className={styles.commentName}>{c.name}</div>
                        </div>
                        <div>
                            <div>{c.comment}</div>
                        </div>
                        <div className={styles.timestamp}>
                            {formatTimestamp(c.timestamp)}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className={styles.labelSideCenter}>コメントしよう！</h3>
                <div className={styles.formGroup}>
                    <label className={styles.label}>おなまえ</label>
                    <input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.iconSelector}>
                    <label className={styles.label}>アイコン</label>
                    {selectedIcon && (
                        <div className={styles.iconPreviewContainer}>
                            <div className={styles.iconPreview}>
                                <img src={`/images/icons/${selectedIcon.filename}`} alt={selectedIcon.name}/>
                            </div>
                            <div className={styles.iconName}>{selectedIcon.name}</div>
                        </div>
                    )}
                    <div className={styles.iconGrid}>
                    {ICONS.map((icon) => (
                            <div
                                key={icon.filename}
                                className={`${styles.iconItem} ${selectedIcon.filename === icon.filename ? styles.selectedIcon : ''}`}
                                onClick={() => handleIconSelect(icon)}
                                title={icon.name}
                            >
                                <img src={`/images/icons/${icon.filename}`} alt={icon.name}/>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>コメント本文 (予想入力されています)</label>
                    <textarea
                        value={comment}
                        onChange={handleCommentChange}
                        className={styles.textarea}
                        required
                    />
                </div>

                <button type="submit" className={styles.button}>
                    コメントする
                </button>
            </form>

            {celebration && (
                <div className={styles.celebration}>
                    {celebration}
                </div>
            )}
        </div>
    );
};

export default Comments;