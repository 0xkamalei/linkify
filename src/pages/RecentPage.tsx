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
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div className="bg-neutral-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <h1 className="text-3xl font-extrabold flex items-center gap-3">
                        <Timer className="w-8 h-8 text-blue-400" />
                        Recent Discoveries
                    </h1>
                    <p className="text-neutral-400 mt-2 font-medium">Catch up with the latest links shared by the community.</p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/5 to-transparent"></div>
            </div>

            <div className="space-y-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-40 bg-white rounded-2xl border border-neutral-200 animate-pulse"></div>
                        ))}
                    </div>
                ) : links.length > 0 ? (
                    links.map(link => (
                        <LinkCard key={link.id} link={link} onVote={handleVote} />
                    ))
                ) : (
                    <div className="bg-white rounded-2xl border border-neutral-200 p-20 text-center">
                        <p className="text-neutral-400">No recent activity found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecentPage;
