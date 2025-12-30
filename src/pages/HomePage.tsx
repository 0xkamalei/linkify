import React, { useEffect, useState } from 'react';
import { ExternalLink, MessageSquare, ArrowBigUp } from 'lucide-react';

interface LinkItem {
    id: string;
    title: string;
    link: string;
    description: string;
    createTime: any;
    commentCnt: number;
    score: number;
}

const LinkList: React.FC = () => {
    const [links, setLinks] = useState<LinkItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/links')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setLinks(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch links", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-12 text-center text-neutral-400">Loading amazing content...</div>;
    if (links.length === 0) return <div className="p-12 text-center text-neutral-400">No links shared yet. Be the first!</div>;

    return (
        <div className="space-y-4">
            {links.map(link => (
                <div key={link.id} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                            <button className="text-neutral-400 hover:text-blue-600 transition-colors">
                                <ArrowBigUp className="w-8 h-8" />
                            </button>
                            <span className="font-bold text-neutral-900">{link.score || 0}</span>
                        </div>
                        <div className="flex-1 space-y-2">
                            <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-neutral-900 hover:text-blue-600 transition-colors flex items-center gap-2">
                                {link.title}
                                <ExternalLink className="w-4 h-4 text-neutral-400" />
                            </a>
                            <p className="text-neutral-600 line-clamp-2">{link.description}</p>
                            <div className="flex items-center gap-4 text-sm text-neutral-400 pt-2">
                                <span className="flex items-center gap-1 hover:text-neutral-600 cursor-pointer">
                                    <MessageSquare className="w-4 h-4" />
                                    {link.commentCnt || 0} comments
                                </span>
                                <span>•</span>
                                <span>{new Date((link.createTime?._seconds * 1000) || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const HomePage: React.FC = () => {
    return (
        <div className="space-y-8">
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-blue-100">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                    Discover and Share <br />the Best Links.
                </h1>
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl font-light">
                    A community-driven platform to curate and discuss valuable content across the web. Join us in building a better internet.
                </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-neutral-900 border-b border-neutral-200 pb-2">Recent Submissions</h2>
                    <LinkList />
                </div>

                <aside className="space-y-8">
                    <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
                        <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                            Trending Topics
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['Tech', 'Design', 'AI', 'Business', 'Sports', 'Art'].map(topic => (
                                <span key={topic} className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">
                                    #{topic}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default HomePage;
