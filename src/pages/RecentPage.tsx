import React, { useEffect, useState } from 'react';
import LinkCard from '../components/LinkCard';
import type { Link as LinkType } from '../types';
import { Timer } from 'lucide-react';

const RecentPage: React.FC = () => {
    const [links, setLinks] = useState<LinkType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/links')
            .then(res => res.json())
            .then(data => {
                setLinks(data);
                setLoading(false);
            });
    }, []);

    const handleVote = async (_id: string, _isLike: number) => {
        // Voting logic
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-retro-border border-2 border-retro-border p-10 text-white relative overflow-hidden retro-shadow">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold flex items-center gap-4 tracking-tighter uppercase italic">
                        <Timer className="w-10 h-10 text-retro-accent" />
                        Latest Transmissions
                    </h1>
                    <p className="text-white/60 mt-4 font-mono font-bold text-xs uppercase tracking-widest leading-relaxed">
                        Real-time feed of newly cataloged resources.<br />
                        Archive status: <span className="text-retro-accent animate-pulse">SYNCHRONIZED</span>
                    </p>
                </div>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            </div>

            <div className="space-y-8">
                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-44 bg-white border-2 border-retro-border/10 animate-pulse"></div>
                        ))}
                    </div>
                ) : links.length > 0 ? (
                    links.map(link => (
                        <LinkCard key={link.id} link={link} onVote={handleVote} />
                    ))
                ) : (
                    <div className="bg-white border-2 border-retro-border p-24 text-center retro-shadow-sm">
                        <p className="text-retro-border/30 font-serif italic text-xl">
                            The transmission buffer is currently empty.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentPage;
