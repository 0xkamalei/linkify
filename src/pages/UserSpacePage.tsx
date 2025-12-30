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
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* User Profile Header */}
            <div className="bg-white rounded-3xl border border-neutral-200 p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-indigo-100 rotate-3">
                    {userId?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
                            {userId}'s Space
                        </h1>
                        <p className="text-neutral-500 font-bold flex items-center justify-center md:justify-start gap-2">
                            <User className="w-4 h-4" />
                            Community Explorer
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <div className="bg-neutral-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-neutral-100">
                            <Activity className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm font-bold text-neutral-700">{links.length} Submissions</span>
                        </div>
                        <div className="bg-neutral-50 px-4 py-2 rounded-xl flex items-center gap-2 border border-neutral-100">
                            <Layout className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold text-neutral-700">Level 1</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submissions Feed */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                    <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Recent Submissions</h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-48 bg-white rounded-3xl border border-neutral-100 animate-pulse"></div>
                        ))}
                    </div>
                ) : links.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {links.map(link => (
                            <LinkCard key={link.id} link={link} onVote={handleVote} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-neutral-50 rounded-[3rem] border-2 border-dashed border-neutral-200">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-sm"> 🚀 </div>
                        <h3 className="text-xl font-black text-neutral-900 mb-2">Passive Explorer Detected</h3>
                        <p className="text-neutral-500 font-medium">This user hasn't shared any links yet. The journey begins with a single click!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSpacePage;
