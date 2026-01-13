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
        <div className="bg-white border-2 border-retro-border p-8 mb-12 retro-shadow">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-6">
                    <div className="w-12 h-12 border-2 border-retro-border bg-retro-bg flex items-center justify-center flex-shrink-0 retro-shadow-sm">
                        <UserIcon className="w-6 h-6 text-retro-border" />
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={placeholder}
                            rows={4}
                            className="w-full bg-white border-2 border-retro-border px-4 py-3 text-retro-text focus:bg-retro-bg/10 outline-none transition-all placeholder:text-retro-border/30 resize-none font-serif text-lg italic"
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] font-bold text-retro-border/40 uppercase tracking-widest">
                        * Input required for archive entry
                    </span>
                    <button
                        type="submit"
                        disabled={!content.trim() || submitting}
                        className="retro-button px-8 py-3 flex items-center gap-2"
                    >
                        {submitting ? (
                            <div className="w-4 h-4 border-2 border-retro-border/30 border-t-retro-border rounded-none animate-spin"></div>
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        PUBLISH TO LOG
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentEditor;
