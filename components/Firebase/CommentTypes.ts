import {FieldValue, Timestamp} from 'firebase/firestore';

export interface IconData {
    filename: string;
    name: string;
}

export interface Comment {
    id: string;
    name: string;
    comment: string;
    icon: IconData;
    timestamp: Timestamp;
}

export interface CommentFormData {
    name: string;
    comment: string;
    icon: IconData;
    timestamp: FieldValue;
}

export interface CommentsProps {
    contentId: string;
}