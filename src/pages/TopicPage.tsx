import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LinkCard from '../components/LinkCard';
import type { Link as LinkType, Topic } from '../types';
import { Hash, Info } from 'lucide-react';

const TopicPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [links, setLinks] = useState<LinkType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Fetch Topic Detail
        fetch(`/api/topics/${topicId}`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) setTopic(data);
            });

        // Fetch Links for this topic
        fetch(`/api/links?topicId=${topicId}`)
            .then(res => res.json())
            .then(data => {
                setLinks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch links', err);
                setLoading(false);
            });
    }, [topicId]);

    const handleVote = async (_id: string, _isLike: number) => {
        // Voting logic
    };

    return (
        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-100">
                            <Hash className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-neutral-900 tracking-tight capitalize">{topic?.name || topicId}</h1>
                            <p className="text-neutral-500 font-medium">#{topic?.shortCode || topicId}</p>
                        </div>
                    </div>
                    <p className="text-neutral-600 max-w-2xl leading-relaxed">
                        Exploring the latest resources, discussions, and updates related to <strong>{topic?.name || topicId}</strong>.
                        Curated by the community for the community.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-white border border-neutral-200 text-neutral-700 px-6 py-3 rounded-xl font-bold hover:bg-neutral-50 transition-all active:scale-95 shadow-sm">
                        Follow
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100">
                        Share Link
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-8">
                    <div className="flex items-center gap-4 text-sm font-bold text-neutral-400 capitalize bg-neutral-50 p-1.5 rounded-xl w-fit">
                        <button className="bg-white text-blue-600 px-4 py-2 rounded-lg shadow-sm font-extrabold">Relevant</button>
                        <button className="px-4 py-2 hover:text-neutral-600 transition-colors">Popular</button>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-44 bg-white rounded-2xl border border-neutral-200 shadow-sm animate-pulse"></div>
                            ))}
                        </div>
                    ) : links.length > 0 ? (
                        <div className="space-y-6">
                            {links.map(link => (
                                <LinkCard key={link.id} link={link} onVote={handleVote} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-neutral-200 p-20 text-center">
                            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl"> 🍃 </div>
                            <p className="text-neutral-900 font-bold text-xl mb-2">No links in this topic yet</p>
                            <p className="text-neutral-400">Be the pioneer and share the first link for {topic?.name || topicId}!</p>
                        </div>
                    )}
                </div>

                <aside className="space-y-10">
                    <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5" />
                            About this Topic
                        </h3>
                        <p className="text-sm text-blue-800 leading-relaxed mb-6">
                            This space is dedicated to high-quality resources and conversation about {topic?.name || topicId}. Please follow the community guidelines when sharing.
                        </p>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold text-blue-900/60 uppercase tracking-widest">
                                <span>Subscribers</span>
                                <span>2.4k</span>
                            </div>
                            <div className="w-full bg-blue-100 rounded-full h-1.5">
                                <div className="bg-blue-500 w-3/4 h-full rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm">
                        <h3 className="font-bold text-neutral-900 mb-6">Related Communities</h3>
                        <div className="space-y-4">
                            {['Frontend Engineering', 'Backend Systems', 'UI/UX Design'].map(rel => (
                                <div key={rel} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-10 h-10 bg-neutral-100 rounded-xl group-hover:bg-blue-600 transition-colors flex items-center justify-center font-bold text-neutral-500 group-hover:text-white">
                                        {rel[0]}
                                    </div>
                                    <div className="font-bold text-sm text-neutral-900 group-hover:text-blue-600 transition-colors">{rel}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TopicPage;
