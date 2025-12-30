import React from 'react';
import { ThumbsUp, ThumbsDown, Trash2, User as UserIcon } from 'lucide-react';
import type { Comment } from '../types';

interface CommentItemProps {
    comment: Comment;
    onVote: (id: string, isLike: number) => void;
    onDelete?: (id: string) => void;
    isOwner?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onVote, onDelete, isOwner }) => {
    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date.seconds * 1000);
        return d.toLocaleDateString();
    };

    return (
        <div className="group py-6 border-b border-neutral-100 last:border-0">
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-400">
                    <UserIcon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-neutral-900">Anonymous</span>
                            <span className="text-xs text-neutral-300">•</span>
                            <span className="text-xs text-neutral-400 font-medium">
                                {formatDate(comment.createTime)}
                            </span>
                        </div>
                    </div>

                    <p className="text-neutral-700 leading-relaxed text-[15px]">
                        {comment.content}
                    </p>

                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => onVote(comment.id!, 1)}
                                className="flex items-center gap-1.5 text-neutral-400 hover:text-blue-600 transition-colors group/btn"
                            >
                                <div className="p-1.5 rounded-lg group-hover/btn:bg-blue-50">
                                    <ThumbsUp className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold">{comment.agree || 0}</span>
                            </button>
                            <button
                                onClick={() => onVote(comment.id!, 2)}
                                className="flex items-center gap-1.5 text-neutral-400 hover:text-red-600 transition-colors group/btn"
                            >
                                <div className="p-1.5 rounded-lg group-hover/btn:bg-red-50">
                                    <ThumbsDown className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold">{comment.disagree || 0}</span>
                            </button>
                        </div>

                        {isOwner && (
                            <button
                                onClick={() => onDelete?.(comment.id!)}
                                className="flex items-center gap-1.5 text-neutral-300 hover:text-red-500 transition-colors ml-auto opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-xs font-bold">Delete</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
