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
        <div className="bg-white border-2 border-retro-border p-5 transition-all retro-shadow-hover group">
            <div className="flex gap-6">
                {/* Voting Sidebar */}
                <div className="flex flex-col items-center gap-2 bg-retro-bg/50 border-r-2 border-retro-border px-3 py-4">
                    <button
                        onClick={() => onVote(link.id!, 1)}
                        className="p-1 hover:text-retro-accent transition-colors text-retro-border"
                    >
                        <ArrowBigUp className="w-6 h-6" />
                    </button>
                    <span className="font-mono font-black text-retro-text text-lg tabular-nums">{link.score || 0}</span>
                    <button
                        onClick={() => onVote(link.id!, -1)}
                        className="p-1 hover:text-retro-text transition-colors text-retro-border"
                    >
                        <ArrowBigDown className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-1">
                    <div className="flex items-center gap-3 mb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-retro-border/40">
                        <span>REF: #{link.id?.slice(-6).toUpperCase()}</span>
                        <span className="opacity-30">|</span>
                        <span>ENTRY: {new Date(link.createTime?.seconds * 1000 || Date.now()).toLocaleDateString('en-GB')}</span>
                    </div>

                    <div className="space-y-4">
                        <Link to={`/links/${link.id}`} className="block group/title">
                            <h3 className="text-2xl font-bold text-retro-text group-hover/title:text-retro-accent transition-colors tracking-tighter italic leading-none">
                                {link.title}
                            </h3>
                        </Link>

                        <div className="flex items-center gap-3">
                            <a
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono font-bold text-retro-border/60 hover:text-retro-accent transition-colors uppercase tracking-widest flex items-center gap-2"
                            >
                                <ExternalLink className="w-3 h-3" />
                                SOURCE_ACCESS
                            </a>
                        </div>

                        <Link to={`/links/${link.id}`} className="block">
                            {link.firstComment && (
                                <p className="text-retro-text/70 text-base font-serif italic border-l-4 border-retro-accent/20 pl-4 py-1 leading-relaxed hover:text-retro-text transition-colors">
                                    "{link.firstComment}"
                                </p>
                            )}
                        </Link>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <Link to={`/t/${link.topicId}`} className="font-mono text-[10px] font-bold text-white bg-retro-accent px-3 py-1 hover:bg-retro-border transition-colors uppercase tracking-[0.1em]">
                                {link.topicId}
                            </Link>

                            <Link to={`/links/${link.id}`} className="flex items-center gap-2 text-retro-border/60 hover:text-retro-accent transition-colors font-mono text-[10px] font-bold uppercase tracking-widest">
                                <MessageSquare className="w-4 h-4" />
                                <span>{link.commentCnt || 0} DEPOSITIONS</span>
                            </Link>
                        </div>

                        <button className="flex items-center gap-2 text-retro-border/40 hover:text-retro-accent transition-colors font-mono text-[10px] font-bold uppercase tracking-widest group/share">
                            <Share2 className="w-4 h-4 group-hover/share:rotate-12 transition-transform" />
                            <span className="hidden sm:inline">RELAY</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkCard;
