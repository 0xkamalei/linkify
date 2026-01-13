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
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b-2 border-retro-border/10 pb-12">
                <div className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-retro-accent border-2 border-retro-border flex items-center justify-center text-4xl font-bold retro-shadow-sm">
                            <Hash className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-bold text-retro-text tracking-tighter uppercase italic">{topic?.name || topicId}</h1>
                            <p className="text-retro-accent font-mono font-bold text-sm tracking-widest mt-1">CATALOG_ID: {topic?.shortCode || topicId}</p>
                        </div>
                    </div>
                    <p className="text-retro-border/70 max-w-2xl font-serif text-xl leading-relaxed italic">
                        Accessing records for <strong>{topic?.name || topicId}</strong>. 
                        Cross-referenced data and community depositions available below.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="retro-button bg-retro-bg px-8 py-3 text-sm">
                        SUBSCRIBE
                    </button>
                    <button className="retro-button px-8 py-3 text-sm">
                        DISPATCH ENTRY
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-10">
                    <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-retro-border/40 uppercase tracking-[0.2em] bg-retro-bg/50 p-2 border-2 border-retro-border/5 w-fit">
                        <button className="bg-retro-accent text-white px-4 py-2 retro-shadow-sm">RELEVANT</button>
                        <button className="px-4 py-2 hover:text-retro-accent transition-colors">POPULAR</button>
                    </div>

                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-44 bg-white border-2 border-retro-border/10 animate-pulse"></div>
                            ))}
                        </div>
                    ) : links.length > 0 ? (
                        <div className="space-y-8">
                            {links.map(link => (
                                <LinkCard key={link.id} link={link} onVote={handleVote} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-retro-border p-24 text-center retro-shadow-sm">
                            <p className="text-retro-border/30 font-serif italic text-xl">
                                No records found for this classification identifier.
                            </p>
                            <p className="text-xs font-mono font-bold text-retro-accent uppercase tracking-widest mt-4">
                                Be the first to catalog a resource.
                            </p>
                        </div>
                    )}
                </div>

                <aside className="space-y-10">
                    <div className="bg-retro-border p-8 border-2 border-retro-border text-white retro-shadow">
                        <h3 className="font-bold text-retro-accent mb-6 flex items-center gap-3 uppercase tracking-tighter text-lg italic">
                            <Info className="w-5 h-5" />
                            CLASSIFICATION INFO
                        </h3>
                        <div className="space-y-6 font-mono text-xs leading-relaxed text-white/70 uppercase tracking-widest">
                            <p>All entries under this identifier are subject to community review and validation.</p>
                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="flex justify-between">
                                    <span>Total Entries</span>
                                    <span className="text-white font-bold">{links.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Active Observers</span>
                                    <span className="text-white font-bold">--</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default TopicPage;
