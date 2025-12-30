import React, { useState } from 'react';
import { Send, User as UserIcon } from 'lucide-react';

interface CommentEditorProps {
    onSubmit: (content: string) => Promise<void>;
    placeholder?: string;
    submitting?: boolean;
}

const CommentEditor: React.FC<CommentEditorProps> = ({ onSubmit, placeholder = "Share your thoughts...", submitting = false }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || submitting) return;
        await onSubmit(content);
        setContent('');
    };

    return (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-5 h-5 text-neutral-400" />
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={placeholder}
                            rows={3}
                            className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-xl px-4 py-3 text-neutral-900 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-neutral-300 resize-none font-medium"
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!content.trim() || submitting}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2 shadow-lg shadow-blue-50"
                    >
                        {submitting ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        Post Comment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentEditor;
