import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import CommentItem from '../components/CommentItem';
import CommentEditor from '../components/CommentEditor';
import type { Link, Comment } from '../types';
import { ArrowBigUp, ArrowBigDown, MessageSquare, ExternalLink, Globe, Hash, Clock, ArrowLeft } from 'lucide-react';

const LinkDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [link, setLink] = useState<Link | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);

        // Fetch Link Detail
        fetch(`/api/links/${id}`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) setLink(data);
            });

        // Fetch Comments
        fetch(`/api/comments?linkId=${id}`)
            .then(res => res.json())
            .then(data => {
                setComments(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleLinkVote = async (isLike: number) => {
        // Vote logic
        console.log('Voting for link:', id, isLike);
    };

    const handleCommentVote = async (cid: string, isLike: number) => {
        // Vote logic
        console.log('Voting for comment:', cid, isLike);
    };

    const handleAddComment = async (content: string) => {
        if (!id) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    linkId: id,
                    content,
                    userId: 'demo-user',
                    agree: 0,
                    disagree: 0,
                }),
            });
            if (res.ok) {
                // Refresh comments (optimistic update could be better)
                const refreshRes = await fetch(`/api/comments?linkId=${id}`);
                const newComments = await refreshRes.json();
                setComments(newComments);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !link) {
        return (
            <div className="max-w-4xl mx-auto py-24 text-center">
                <div className="w-12 h-12 border-2 border-retro-border/20 border-t-retro-accent rounded-none animate-spin mx-auto mb-6"></div>
                <p className="text-retro-border font-mono font-bold uppercase tracking-widest text-sm italic">Synchronizing archive data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <RouterLink to="/" className="inline-flex items-center gap-3 text-retro-border/40 hover:text-retro-accent transition-colors mb-10 font-mono font-bold text-[10px] uppercase tracking-[0.2em] group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Return to Main Archive
            </RouterLink>

            {/* Link Detail Header */}
            {link && (
                <div className="bg-white border-2 border-retro-border retro-shadow p-8 md:p-12 mb-16 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                        {/* Vote Action */}
                        <div className="flex md:flex-col items-center gap-3 bg-retro-bg/30 border-2 border-retro-border/10 p-3 md:min-w-[72px]">
                            <button
                                onClick={() => handleLinkVote(1)}
                                className="p-2 hover:bg-retro-accent hover:text-white transition-all text-retro-border/30"
                            >
                                <ArrowBigUp className="w-8 h-8" />
                            </button>
                            <span className="font-mono font-black text-xl text-retro-text tabular-nums">
                                {link.agree - link.disagree}
                            </span>
                            <button
                                onClick={() => handleLinkVote(-1)}
                                className="p-2 hover:bg-retro-text hover:text-white transition-all text-retro-border/30"
                            >
                                <ArrowBigDown className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-6">
                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono font-bold text-retro-accent uppercase tracking-widest">
                                <span className="flex items-center gap-2 bg-retro-accent/5 px-2 py-1">
                                    <Hash className="w-3 h-3" />
                                    {link.topicId}
                                </span>
                                <span className="flex items-center gap-2 text-retro-border/40">
                                    <Clock className="w-3 h-3" />
                                    ENTRY: {new Date(link.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-retro-text leading-[1.1] tracking-tighter italic">
                                {link.title}
                            </h1>

                            <p className="text-retro-border/70 font-serif text-xl leading-relaxed">
                                {link.description}
                            </p>

                            <div className="pt-6 flex flex-wrap items-center gap-6">
                                <a
                                    href={link.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="retro-button px-8 py-4 flex items-center gap-3"
                                >
                                    <Globe className="w-5 h-5" />
                                    ACCESS RESOURCE
                                    <ExternalLink className="w-4 h-4 opacity-50" />
                                </a>
                                <div className="flex items-center gap-3 px-6 py-3 border-2 border-retro-border/10 bg-retro-bg/10 font-mono font-bold text-xs text-retro-border/60 uppercase tracking-widest">
                                    <MessageSquare className="w-4 h-4" />
                                    {comments.length} DEPOSITIONS
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <div className="space-y-12">
                <div className="flex items-center gap-4">
                    <div className="h-[2px] flex-1 bg-retro-border/10"></div>
                    <h2 className="text-[10px] font-mono font-bold text-retro-text uppercase tracking-[0.3em]">
                        DEPOSITIONS_TRANSCRIPT
                    </h2>
                    <div className="h-[2px] flex-1 bg-retro-border/10"></div>
                </div>

                <div className="bg-white border-2 border-retro-border p-8 md:p-10 retro-shadow-sm">
                    <h3 className="text-lg font-bold text-retro-text uppercase italic mb-8 border-l-4 border-retro-accent pl-4">
                        Submit New Entry
                    </h3>
                    <CommentEditor
                        onSubmit={handleAddComment}
                        submitting={submitting}
                        placeholder="Provide your analysis for the archive..."
                    />
                </div>

                <div className="space-y-8">
                    {comments.length > 0 ? (
                        comments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onVote={(isLike) => handleCommentVote(comment.id, isLike)}
                                isOwner={false}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-retro-bg/10 border-2 border-dashed border-retro-border/10">
                            <p className="text-retro-border/30 font-serif italic text-xl">
                                Archive currently contains no secondary data for this entry.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LinkDetailPage;
