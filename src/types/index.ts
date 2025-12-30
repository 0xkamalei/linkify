export interface Topic {
    id?: string;
    name: string;
    shortCode: string;
    icon?: string;
    tags?: string[];
    createBy: string;
    createTime: any;
    updateTime?: any;
    score?: number;
}

export interface Link {
    id?: string;
    link: string;
    title: string;
    description?: string;
    groupId?: string;
    tags?: string[];
    topicId: string;
    score: number;
    agree: number;
    disagree: number;
    commentCnt: number;
    createBy: string;
    createTime: any;
    updateTime?: any;
    firstComment?: string;
}

export interface Comment {
    id?: string;
    linkId: string;
    content: string;
    score: number;
    agree: number;
    disagree: number;
    createBy: string;
    createTime: any;
    updateTime?: any;
}
