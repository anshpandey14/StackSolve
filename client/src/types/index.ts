export interface User {
    _id: string;
    name: string;
    email: string;
    reputation: number;
    bio?: string;
    avatar?: string;
    createdAt: string;
}

export interface Question {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    author: User;
    votes: number;
    answersCount: number;
    createdAt: string;
}

export interface Answer {
    _id: string;
    content: string;
    author: User;
    question: string;
    votes: number;
    createdAt: string;
}

export interface Comment {
    _id: string;
    content: string;
    author: User;
    parent: string;
    createdAt: string;
}

export interface Vote {
    _id: string;
    type: 'question' | 'answer';
    typeId: string;
    votedBy: string;
    voteStatus: 'upvoted' | 'downvoted';
}




