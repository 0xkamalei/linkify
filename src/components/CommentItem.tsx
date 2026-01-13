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
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="group py-8 border-b-2 border-retro-border/10 last:border-0">
            <div className="flex gap-6">
                {/* Avatar */}
                <div className="w-12 h-12 border-2 border-retro-border bg-white flex items-center justify-center flex-shrink-0 text-retro-border retro-shadow-sm">
                    <UserIcon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-widest text-retro-border/60">
                            <span className="text-retro-text">User_Archive_#{comment.id?.slice(-4)}</span>
                            <span>/</span>
                            <span>{formatDate(comment.createTime)}</span>
                        </div>
                    </div>

                    <p className="text-retro-text leading-relaxed font-serif text-lg italic">
                        {comment.content}
                    </p>

                    <div className="flex items-center gap-8 pt-4">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => onVote(comment.id!, 1)}
                                className="flex items-center gap-2 text-retro-border/60 hover:text-retro-accent transition-colors group/btn font-mono text-[10px] font-bold uppercase"
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span>Agree / {comment.agree || 0}</span>
                            </button>
                            <button
                                onClick={() => onVote(comment.id!, 2)}
                                className="flex items-center gap-2 text-retro-border/60 hover:text-red-600 transition-colors group/btn font-mono text-[10px] font-bold uppercase"
                            >
                                <ThumbsDown className="w-4 h-4" />
                                <span>Reject / {comment.disagree || 0}</span>
                            </button>
                        </div>

                        {isOwner && (
                            <button
                                onClick={() => onDelete?.(comment.id!)}
                                className="flex items-center gap-2 text-retro-border/30 hover:text-red-600 transition-colors ml-auto font-mono text-[10px] font-bold uppercase"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Expunge</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
