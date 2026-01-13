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
        <div className="space-y-6">
            {links.map(link => (
                <div key={link.id} className="bg-white border-2 border-retro-border p-6 transition-all retro-shadow-hover group">
                    <div className="flex gap-6">
                        <div className="flex flex-col items-center gap-1 min-w-[3.5rem] border-r-2 border-retro-border pr-6">
                            <button className="text-retro-border hover:text-retro-accent transition-colors">
                                <ArrowBigUp className="w-8 h-8" />
                            </button>
                            <span className="font-mono font-bold text-lg text-retro-text">{link.score || 0}</span>
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between gap-4">
                                <a href={link.link} target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-retro-text hover:text-retro-accent transition-colors flex items-center gap-3 group-hover:underline decoration-2 underline-offset-4">
                                    {link.title}
                                    <ExternalLink className="w-4 h-4 text-retro-border/50" />
                                </a>
                            </div>
                            <p className="text-retro-text/80 text-lg leading-relaxed line-clamp-2">{link.description}</p>
                            <div className="flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider text-retro-border/60 pt-4">
                                <span className="flex items-center gap-1.5 hover:text-retro-accent cursor-pointer transition-colors border-2 border-transparent hover:border-retro-border hover:bg-white px-2 py-1 -ml-2">
                                    <MessageSquare className="w-4 h-4" />
                                    {link.commentCnt || 0} Comments
                                </span>
                                <span>/</span>
                                <span className="px-2 py-1 bg-retro-bg border border-retro-border/20">
                                    {new Date((link.createTime?._seconds * 1000) || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
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
        <div className="space-y-16">
            <section className="bg-white border-2 border-retro-border p-10 md:p-16 relative overflow-hidden retro-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-retro-accent opacity-10 translate-x-16 -translate-y-16 rotate-45"></div>
                <div className="relative z-10 max-w-3xl space-y-6">
                    <h1 className="text-5xl md:text-7xl font-bold text-retro-text leading-[0.9] tracking-tighter uppercase italic">
                        The Open<br />Archive of Web.
                    </h1>
                    <p className="text-xl md:text-2xl text-retro-text font-serif italic border-l-4 border-retro-accent pl-6 py-2">
                        A community-driven platform to curate and discuss valuable content across the web. Join us in building a better internet.
                    </p>
                    <div className="pt-4">
                        <button className="retro-button text-base px-8 py-3">
                            CONTRIBUTE TO ARCHIVE
                        </button>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between border-b-2 border-retro-border pb-4">
                        <h2 className="text-2xl font-bold text-retro-text uppercase tracking-widest italic">Recent Dispatches</h2>
                        <span className="font-mono text-xs font-bold text-retro-accent uppercase">Vol. 001 — 2026</span>
                    </div>
                    <LinkList />
                </div>

                <aside className="lg:col-span-4 space-y-10">
                    <div className="bg-white border-2 border-retro-border p-8 retro-shadow-sm">
                        <h3 className="font-bold text-lg text-retro-text mb-6 uppercase tracking-widest border-b-2 border-retro-border pb-2 italic">
                            Categories
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {['Tech', 'Design', 'AI', 'Business', 'Sports', 'Art'].map(topic => (
                                <span key={topic} className="px-3 py-1.5 border-2 border-retro-border font-mono text-xs font-bold uppercase hover:bg-retro-accent hover:text-white cursor-pointer transition-all active:translate-y-0.5">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="border-2 border-retro-border p-8 bg-retro-accent/5">
                        <h3 className="font-bold text-lg text-retro-text mb-4 uppercase tracking-widest italic">
                            Newsletter
                        </h3>
                        <p className="text-sm mb-6 font-serif italic">
                            Get weekly dispatches of the most valuable links delivered to your mailbox.
                        </p>
                        <div className="flex flex-col gap-3">
                            <input type="email" placeholder="email@example.com" className="bg-white border-2 border-retro-border p-2 font-mono text-xs focus:outline-none" />
                            <button className="retro-button w-full">SUBSCRIBE</button>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default HomePage;
