import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Calendar, Settings, LogOut, Shield, Link as LinkIcon, MessageSquare } from 'lucide-react';

const AccountPage: React.FC = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center bg-white border-2 border-retro-border retro-shadow">
                <p className="text-retro-border font-mono font-bold uppercase tracking-widest">Access Denied: Please authenticate.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-white border-2 border-retro-border retro-shadow overflow-hidden relative">
                <div className="bg-retro-border h-32 md:h-48 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="absolute -bottom-12 left-8 md:left-12">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-retro-accent border-4 border-white flex items-center justify-center text-4xl md:text-5xl text-white font-black retro-shadow-sm">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-12 px-8 md:px-12 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b-2 border-retro-border/10">
                        <div className="space-y-3">
                            <h1 className="text-5xl font-bold text-retro-text tracking-tighter uppercase italic">
                                {user.email?.split('@')[0]}
                            </h1>
                            <p className="text-retro-border/60 font-mono font-bold text-xs flex items-center gap-3 uppercase tracking-widest">
                                <Mail className="w-4 h-4 text-retro-accent" />
                                {user.email}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="retro-button bg-retro-bg/50 px-6 py-3 text-sm flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                CONFIGURE
                            </button>
                            <button
                                onClick={() => logout()}
                                className="retro-button bg-red-50 text-red-600 px-6 py-3 text-sm flex items-center gap-2 hover:bg-red-100"
                            >
                                <LogOut className="w-4 h-4" />
                                DEPARTURE
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <h3 className="text-[10px] font-mono font-bold text-retro-text uppercase tracking-[0.2em] border-l-4 border-retro-accent pl-3">Dossier Details</h3>
                            <div className="space-y-5">
                                <div className="flex items-center gap-4 text-retro-text font-serif italic text-lg">
                                    <Calendar className="w-5 h-5 text-retro-accent" />
                                    <span>Joined Archive: Jan 2024</span>
                                </div>
                                <div className="flex items-center gap-4 text-retro-text font-serif italic text-lg">
                                    <Shield className="w-5 h-5 text-retro-accent" />
                                    <span>Identity Status: Verified</span>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-8">
                            <h3 className="text-[10px] font-mono font-bold text-retro-text uppercase tracking-[0.2em] border-l-4 border-retro-accent pl-3">Archive Statistics</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-retro-bg/30 p-8 border-2 border-retro-border/10 hover:border-retro-accent transition-colors text-center group">
                                    <div className="flex items-center justify-center gap-3 text-retro-border/40 mb-2 group-hover:text-retro-accent">
                                        <LinkIcon className="w-4 h-4" />
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Dispatched</span>
                                    </div>
                                    <div className="text-4xl font-bold text-retro-text tracking-tighter">00</div>
                                </div>
                                <div className="bg-retro-bg/30 p-8 border-2 border-retro-border/10 hover:border-retro-accent transition-colors text-center group">
                                    <div className="flex items-center justify-center gap-3 text-retro-border/40 mb-2 group-hover:text-retro-accent">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Deposited</span>
                                    </div>
                                    <div className="text-4xl font-bold text-retro-text tracking-tighter">00</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t-2 border-retro-border/10">
                        <h3 className="text-[10px] font-mono font-bold text-retro-text uppercase tracking-[0.2em] mb-8 border-l-4 border-retro-accent pl-3">Transmission Log</h3>
                        <div className="text-center py-24 bg-retro-bg/20 border-2 border-dashed border-retro-border/10 text-retro-border/30 font-serif italic text-xl">
                            No active transmissions detected.<br />
                            <span className="text-xs font-mono font-bold uppercase tracking-widest mt-4 block">Begin dispatching resources to update log.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;
