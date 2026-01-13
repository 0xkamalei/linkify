import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LinkCard from '../components/LinkCard';
import type { Link } from '../types';
import { User, Activity, Layout } from 'lucide-react';

const UserSpacePage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        fetch(`/api/links?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                setLinks(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [userId]);

    const handleVote = (id: string, isLike: number) => {
        console.log('Voting for:', id, isLike);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            {/* User Profile Header */}
            <div className="bg-white border-2 border-retro-border p-8 md:p-12 retro-shadow flex flex-col md:flex-row items-center md:items-start gap-10">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-retro-accent border-2 border-retro-border flex items-center justify-center text-white text-4xl font-black retro-shadow-sm -rotate-2">
                    {userId?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center md:text-left space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-retro-text tracking-tighter uppercase italic">
                            Dossier: {userId}
                        </h1>
                        <p className="text-retro-accent font-mono font-bold text-xs flex items-center justify-center md:justify-start gap-3 uppercase tracking-widest">
                            <User className="w-4 h-4" />
                            CLASSIFIED EXPLORER
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                        <div className="bg-retro-bg/30 px-6 py-3 border-2 border-retro-border/10 flex items-center gap-3">
                            <Activity className="w-4 h-4 text-retro-accent" />
                            <span className="text-xs font-mono font-bold text-retro-text uppercase tracking-widest">{links.length} DISPATCHES</span>
                        </div>
                        <div className="bg-retro-bg/30 px-6 py-3 border-2 border-retro-border/10 flex items-center gap-3">
                            <Layout className="w-4 h-4 text-retro-accent" />
                            <span className="text-xs font-mono font-bold text-retro-text uppercase tracking-widest">CLEARANCE_01</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submissions Feed */}
            <div className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="h-[2px] flex-1 bg-retro-border/10"></div>
                    <h2 className="text-[10px] font-mono font-bold text-retro-text uppercase tracking-[0.3em]">
                        ACTIVITY_LOG
                    </h2>
                    <div className="h-[2px] flex-1 bg-retro-border/10"></div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-48 bg-white border-2 border-retro-border/10 animate-pulse"></div>
                        ))}
                    </div>
                ) : links.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {links.map(link => (
                            <LinkCard key={link.id} link={link} onVote={handleVote} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-retro-bg/20 border-2 border-dashed border-retro-border/10 retro-shadow-sm">
                        <h3 className="text-xl font-serif italic text-retro-border/60 mb-4 italic">No transmissions recorded for this identifier.</h3>
                        <p className="text-xs font-mono font-bold text-retro-accent uppercase tracking-widest">The archive remains silent.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSpacePage;
