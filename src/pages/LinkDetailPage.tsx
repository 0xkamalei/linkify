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
            <div className="max-w-4xl mx-auto py-20 text-center">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                <p className="text-neutral-400 mt-4 font-bold tracking-tight">Loading discussion...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Back Button */}
            <RouterLink to="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-blue-600 transition-colors mb-8 font-bold text-sm group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Feed
            </RouterLink>

            {/* Link Detail Header */}
            {link && (
                <div className="bg-white rounded-3xl border border-neutral-200 p-8 md:p-10 shadow-sm mb-12 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                        {/* Vote Action */}
                        <div className="flex md:flex-col items-center gap-2 bg-neutral-50 px-3 py-4 rounded-2xl md:min-w-[64px]">
                            <button
                                onClick={() => handleLinkVote(1)}
                                className="p-1.5 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors text-neutral-400"
                            >
                                <ArrowBigUp className="w-8 h-8" />
                            </button>
                            <span className="text-lg font-extrabold text-neutral-900">{link.score || 0}</span>
                            <button
                                onClick={() => handleLinkVote(2)}
                                className="p-1.5 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors text-neutral-400"
                            >
                                <ArrowBigDown className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="flex items-center gap-4">
                                <RouterLink to={`/t/${link.topicId}`} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest hover:bg-blue-100 transition-colors">
                                    <Hash className="w-3 h-3" />
                                    {link.topicId}
                                </RouterLink>
                                <div className="flex items-center gap-2 text-neutral-400 text-xs font-medium">
                                    <Clock className="w-3 h-3" />
                                    2 hours ago
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 leading-tight tracking-tight">
                                {link.title}
                            </h1>

                            <a
                                href={link.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xl shadow-neutral-200"
                            >
                                <Globe className="w-5 h-5 text-blue-400" />
                                Visit Official Website
                                <ExternalLink className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>

                            {link.firstComment && (
                                <div className="bg-neutral-50 border-l-4 border-blue-500 p-6 rounded-r-2xl italic text-neutral-600 leading-relaxed text-lg">
                                    "{link.firstComment}"
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Decorative background circle */}
                    <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
                </div>
            )}

            {/* Discussion Section */}
            <div className="space-y-10">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                    <h2 className="text-2xl font-bold text-neutral-900 flex items-center gap-3">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        Discussion
                        <span className="text-sm font-bold bg-neutral-100 text-neutral-500 px-3 py-1 rounded-full ml-2">
                            {comments.length}
                        </span>
                    </h2>
                    <div className="flex gap-4 text-sm font-bold">
                        <button className="text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4.5">Top</button>
                        <button className="text-neutral-400 hover:text-neutral-600 transition-colors">Newest</button>
                    </div>
                </div>

                <CommentEditor onSubmit={handleAddComment} submitting={submitting} />

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 bg-white rounded-2xl border border-neutral-100 animate-pulse"></div>
                        ))}
                    </div>
                ) : comments.length > 0 ? (
                    <div className="bg-white rounded-3xl border border-neutral-200 p-8 md:px-12 shadow-sm">
                        {comments.map(comment => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                onVote={handleCommentVote}
                                isOwner={false} // Demo logic
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-sm"> 💬 </div>
                        <p className="text-neutral-900 font-bold text-xl mb-2">No comments yet</p>
                        <p className="text-neutral-400">Be the first to share your thoughts on this resource!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LinkDetailPage;
