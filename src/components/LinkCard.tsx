import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowBigUp, ArrowBigDown, Share2, ExternalLink } from 'lucide-react';
import type { Link as LinkType } from '../types';

interface LinkCardProps {
    link: LinkType;
    onVote: (id: string, isLike: number) => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onVote }) => {
    return (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex gap-4">
                {/* Voting Sidebar */}
                <div className="flex flex-col items-center gap-1 bg-neutral-50 px-2 py-3 rounded-xl">
                    <button
                        onClick={() => onVote(link.id!, 1)}
                        className="p-1 hover:bg-blue-100 hover:text-blue-600 rounded transition-colors text-neutral-400"
                    >
                        <ArrowBigUp className="w-6 h-6" />
                    </button>
                    <span className="text-sm font-bold text-neutral-700">{link.score || 0}</span>
                    <button
                        onClick={() => onVote(link.id!, 2)}
                        className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors text-neutral-400"
                    >
                        <ArrowBigDown className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-neutral-400">Shared by Anonymous</span>
                        <span className="text-xs text-neutral-300">•</span>
                        <span className="text-xs text-neutral-400">2 hours ago</span>
                    </div>

                    <div className="space-y-2">
                        <a
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-bold text-neutral-900 hover:text-blue-600 transition-colors flex items-center gap-2 group/title"
                        >
                            <span className="truncate">{link.title}</span>
                            <ExternalLink className="w-4 h-4 opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
                        </a>

                        <Link to={`/links/${link.id}`} className="block">
                            {link.firstComment && (
                                <p className="text-neutral-600 text-sm line-clamp-2 leading-relaxed italic hover:text-neutral-900 transition-colors">
                                    "{link.firstComment}"
                                </p>
                            )}
                        </Link>
                    </div>

                    <div className="mt-4 flex items-center gap-6">
                        <Link to={`/t/${link.topicId}`} className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors uppercase tracking-wider">
                            {link.topicId}
                        </Link>

                        <div className="flex items-center gap-4">
                            <Link to={`/links/${link.id}`} className="flex items-center gap-1.5 text-neutral-500 hover:text-blue-600 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs font-semibold">{link.commentCnt || 0}</span>
                            </Link>
                            <button className="flex items-center gap-1.5 text-neutral-500 hover:text-blue-600 transition-colors">
                                <Share2 className="w-4 h-4" />
                                <span className="text-xs font-semibold">Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkCard;
