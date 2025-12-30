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
        <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-2xl shadow-neutral-100">
                <div className="bg-neutral-900 px-8 py-10 text-white relative overflow-hidden">
                    <h1 className="text-3xl font-extrabold relative z-10 flex items-center gap-3">
                        <PlusCircle className="w-8 h-8 text-blue-400" />
                        Share something great
                    </h1>
                    <p className="text-neutral-400 mt-2 relative z-10 font-medium">Contribute to the collective knowledge of the community.</p>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                    {/* Link URL */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                            <LinkIcon className="w-4 h-4 text-blue-600" />
                            Resource URL
                        </label>
                        <input
                            type="url"
                            required
                            placeholder="https://example.com/awesome-article"
                            value={formData.link}
                            onChange={e => setFormData({ ...formData, link: e.target.value })}
                            className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 text-neutral-900 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium placeholder:text-neutral-300"
                        />
                    </div>

                    {/* Title */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                            <Type className="w-4 h-4 text-blue-600" />
                            Compelling Title
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="What makes this link special?"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 text-neutral-900 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium placeholder:text-neutral-300"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Topic Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                                <Hash className="w-4 h-4 text-blue-600" />
                                Select Topic
                            </label>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setTopicOpen(!topicOpen)}
                                    className={`w-full bg-neutral-50 border-2 rounded-2xl px-6 py-4 text-left font-bold flex items-center justify-between transition-all ${topicOpen ? 'border-blue-500 bg-white ring-4 ring-blue-500/10' : 'border-neutral-100 hover:bg-white text-neutral-900'}`}
                                >
                                    <span className={formData.topicId ? 'text-neutral-900' : 'text-neutral-400'}>
                                        {formData.topicId
                                            ? { tech: 'Technology', design: 'Design', ai: 'Artificial Intelligence', biz: 'Business' }[formData.topicId]
                                            : 'Choose a topic'}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${topicOpen ? 'rotate-180 text-blue-500' : ''}`} />
                                </button>

                                {topicOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-100 rounded-2xl shadow-xl shadow-blue-500/10 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-200">
                                        {[
                                            { id: 'tech', label: 'Technology', desc: 'Code, Gadgets, Innovation' },
                                            { id: 'design', label: 'Design', desc: 'UI/UX, Art, Creativity' },
                                            { id: 'ai', label: 'Artificial Intelligence', desc: 'LLMs, ML, Future' },
                                            { id: 'biz', label: 'Business', desc: 'Startups, Finance, Strategy' }
                                        ].map((topic) => (
                                            <button
                                                key={topic.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, topicId: topic.id });
                                                    setTopicOpen(false);
                                                }}
                                                className="w-full text-left px-6 py-4 hover:bg-blue-50 transition-colors flex items-center justify-between group border-b border-neutral-50 last:border-0"
                                            >
                                                <div>
                                                    <span className={`block font-bold ${formData.topicId === topic.id ? 'text-blue-600' : 'text-neutral-900'}`}>
                                                        {topic.label}
                                                    </span>
                                                    <span className="text-xs text-neutral-400 font-medium">{topic.desc}</span>
                                                </div>
                                                {formData.topicId === topic.id && (
                                                    <Check className="w-5 h-5 text-blue-600" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-neutral-900 uppercase tracking-widest">Tags (Optional)</label>
                            <input
                                type="text"
                                placeholder="Separate with commas"
                                value={formData.tags}
                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 text-neutral-900 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium placeholder:text-neutral-300"
                            />
                        </div>
                    </div>

                    {/* Recommendation Comment */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-blue-600" />
                            Recommendation Reason
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Why should people check this out? Give some context..."
                            value={formData.firstComment}
                            onChange={e => setFormData({ ...formData, firstComment: e.target.value })}
                            className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-6 py-4 text-neutral-900 focus:border-blue-500 focus:bg-white outline-none transition-all font-medium placeholder:text-neutral-300 resize-none"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full sm:flex-1 bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all active:scale-[0.98] shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Publish Resource
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full sm:w-auto bg-neutral-100 text-neutral-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3"
                        >
                            <X className="w-5 h-5" />
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SharePage;
