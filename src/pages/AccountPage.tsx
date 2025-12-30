import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Calendar, Settings, LogOut, Shield, Link as LinkIcon, MessageSquare } from 'lucide-react';

const AccountPage: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center bg-white rounded-3xl border border-neutral-200">
                <p className="text-neutral-500 font-bold">Please log in to view your account.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-2xl shadow-neutral-100">
                <div className="bg-neutral-900 h-32 md:h-48 relative">
                    <div className="absolute -bottom-12 left-8 md:left-12">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-600 rounded-3xl border-4 border-white flex items-center justify-center text-4xl md:text-5xl text-white font-black shadow-xl">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-10 px-8 md:px-12 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-100">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
                                {user.email?.split('@')[0]}
                            </h1>
                            <p className="text-neutral-500 font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-bold hover:bg-neutral-200 transition-all active:scale-95 shadow-sm">
                                <Settings className="w-4 h-4" />
                                Settings
                            </button>
                            <button
                                onClick={() => logout()}
                                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all active:scale-95 border border-red-100"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest px-1">Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-neutral-600 font-medium">
                                    <Calendar className="w-5 h-5 text-neutral-400" />
                                    <span>Joined Jan 2024</span>
                                </div>
                                <div className="flex items-center gap-3 text-neutral-600 font-medium">
                                    <Shield className="w-5 h-5 text-neutral-400" />
                                    <span>Identity Verified</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-6">
                            <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest px-1">Statistics</h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 hover:border-blue-200 transition-colors">
                                    <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                                        <LinkIcon className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase tracking-wider">Shared</span>
                                    </div>
                                    <div className="text-2xl font-black text-neutral-900">0</div>
                                </div>
                                <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100 hover:border-blue-200 transition-colors">
                                    <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase tracking-wider">Comments</span>
                                    </div>
                                    <div className="text-2xl font-black text-neutral-900">0</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-neutral-100">
                        <h3 className="text-sm font-bold text-neutral-400 uppercase tracking-widest px-1 mb-6">Recent Activity</h3>
                        <div className="text-center py-20 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-100 text-neutral-400 font-bold">
                            No activity yet. Start sharing resources!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
