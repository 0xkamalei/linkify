import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as LinkIcon, Type, MessageSquare, Hash, Save, X, PlusCircle, Check, ChevronDown } from 'lucide-react';

const SharePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [topicOpen, setTopicOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        firstComment: '',
        topicId: '',
        tags: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    userId: 'demo-user', // Temporary
                    score: 0,
                    agree: 0,
                    disagree: 0,
                    commentCnt: 0,
                }),
            });
            if (res.ok) {
                navigate('/');
            }
        } catch (err) {
            console.error('Submission failed', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12">
            <div className="bg-white border-2 border-retro-border overflow-hidden retro-shadow">
                <div className="bg-retro-text px-10 py-12 text-white relative">
                    <h1 className="text-4xl font-bold relative z-10 flex items-center gap-4 uppercase italic tracking-tighter">
                        <PlusCircle className="w-10 h-10 text-retro-accent" />
                        Dispatch Entry
                    </h1>
                    <p className="text-neutral-400 mt-4 relative z-10 font-mono text-xs uppercase tracking-widest leading-relaxed">
                        Contributing to the collective archive since 2026. <br />
                        Please provide accurate metadata for indexing.
                    </p>
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10">
                        <Save className="w-32 h-32" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-10 md:p-16 space-y-12">
                    {/* Link URL */}
                    <div className="space-y-4">
                        <label className="text-xs font-mono font-bold text-retro-text uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-2 h-2 bg-retro-accent"></span>
                            01. Source Resource (URL)
                        </label>
                        <input
                            type="url"
                            required
                            placeholder="https://archive.org/entry/..."
                            value={formData.link}
                            onChange={e => setFormData({ ...formData, link: e.target.value })}
                            className="w-full bg-white border-2 border-retro-border px-6 py-4 text-retro-text focus:bg-retro-bg/10 outline-none transition-all font-mono text-sm placeholder:text-retro-border/20"
                        />
                    </div>

                    {/* Title */}
                    <div className="space-y-4">
                        <label className="text-xs font-mono font-bold text-retro-text uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-2 h-2 bg-retro-accent"></span>
                            02. Descriptive Label (Title)
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="What makes this link special?"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-white border-2 border-retro-border px-6 py-4 text-retro-text focus:bg-retro-bg/10 outline-none transition-all font-serif text-xl italic placeholder:text-retro-border/20"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Topic Selection */}
                        <div className="space-y-4">
                            <label className="text-xs font-mono font-bold text-retro-text uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-2 h-2 bg-retro-accent"></span>
                                03. Classification
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setTopicOpen(!topicOpen)}
                                    className={`w-full bg-white border-2 px-6 py-4 text-left font-mono text-xs font-bold flex items-center justify-between transition-all ${topicOpen ? 'border-retro-accent shadow-[2px_2px_0px_0px_rgba(210,105,30,1)]' : 'border-retro-border hover:bg-retro-bg/50 text-retro-text'}`}
                                >
                                    {formData.topicId ? (
                                        <span className="uppercase text-retro-accent">{formData.topicId}</span>
                                    ) : (
                                        <span className="text-retro-border/40 uppercase">Select Topic</span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 transition-transform ${topicOpen ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {topicOpen && (
                                    <div className="absolute top-full left-0 w-full mt-2 bg-white border-2 border-retro-border z-50 retro-shadow-sm max-h-60 overflow-y-auto">
                                        {['Tech', 'Design', 'AI', 'Business', 'Sports', 'Art'].map((topic) => (
                                            <button
                                                key={topic}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, topicId: topic });
                                                    setTopicOpen(false);
                                                }}
                                                className="w-full px-6 py-3 text-left font-mono text-xs font-bold uppercase hover:bg-retro-accent hover:text-white transition-colors border-b border-retro-border/10 last:border-0"
                                            >
                                                {topic}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-4">
                            <label className="text-xs font-mono font-bold text-retro-text uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-2 h-2 bg-retro-accent"></span>
                                04. Meta Tags
                            </label>
                            <input
                                type="text"
                                placeholder="tag1, tag2, tag3"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full bg-white border-2 border-retro-border px-6 py-4 text-retro-text focus:bg-retro-bg/10 outline-none transition-all font-mono text-xs placeholder:text-retro-border/20"
                            />
                        </div>
                    </div>

                    {/* Initial Comment */}
                    <div className="space-y-4">
                        <label className="text-xs font-mono font-bold text-retro-text uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-2 h-2 bg-retro-accent"></span>
                            05. Curatorial Note (Optional)
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Why should others explore this resource?"
                            value={formData.firstComment}
                            onChange={e => setFormData({ ...formData, firstComment: e.target.value })}
                            className="w-full bg-white border-2 border-retro-border px-6 py-4 text-retro-text focus:bg-retro-bg/10 outline-none transition-all font-serif italic text-lg placeholder:text-retro-border/20 resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t-2 border-retro-border/10">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="font-mono text-[10px] font-bold uppercase tracking-widest text-retro-border/40 hover:text-red-600 transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Abort Operation
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="retro-button px-12 py-4 flex items-center gap-3"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-retro-border/30 border-t-retro-border rounded-none animate-spin"></div>
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            COMMIT TO ARCHIVE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SharePage;
