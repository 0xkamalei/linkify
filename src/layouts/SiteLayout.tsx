import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Search, Globe, User, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SiteLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/t/${searchQuery.trim().toLowerCase()}`);
            setSearchQuery('');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-retro-bg flex flex-col font-serif">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-retro-bg border-b-2 border-retro-border h-20 flex items-center px-4 md:px-8">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="border-2 border-retro-border p-1 bg-retro-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-retro-text tracking-tighter uppercase italic">LinkSite</span>
                        </Link>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="hidden md:flex relative group">
                            <input
                                type="text"
                                placeholder="Search archives..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 lg:w-96 bg-white border-2 border-retro-border px-10 py-2 text-sm font-mono focus:outline-none focus:retro-shadow-sm transition-all"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-retro-border" />
                        </form>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/share" className="flex items-center gap-2 font-mono text-sm font-bold uppercase hover:text-retro-accent transition-colors">
                            <PlusCircle className="w-5 h-5" />
                            <span className="hidden sm:inline">Dispatch</span>
                        </Link>

                        <div className="h-8 w-0.5 bg-retro-border hidden sm:block"></div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/account" className="flex items-center gap-2 border-2 border-retro-border bg-white px-4 py-1.5 font-mono text-sm font-bold retro-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                                    <div className="w-5 h-5 bg-retro-accent border border-retro-border flex items-center justify-center text-[10px] text-white">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-retro-border hover:text-red-600 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="retro-button">
                                <span className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Sign In
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-12">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-retro-bg border-t-2 border-retro-border py-16 mt-auto">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Globe className="w-6 h-6 text-retro-accent" />
                                <span className="text-xl font-bold text-retro-text uppercase tracking-widest">LinkSite</span>
                            </div>
                            <p className="text-sm font-mono text-retro-border max-w-xs leading-relaxed">
                                Curating the digital frontier since 2026. A minimalist repository for valuable web discoveries.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
                            <div className="space-y-4">
                                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-retro-accent">Navigation</h4>
                                <nav className="flex flex-col gap-2 text-sm font-bold">
                                    <a href="#" className="hover:underline decoration-2">About</a>
                                    <a href="#" className="hover:underline decoration-2">Archives</a>
                                    <a href="#" className="hover:underline decoration-2">Newsletter</a>
                                </nav>
                            </div>
                            <div className="space-y-4">
                                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-retro-accent">Legal</h4>
                                <nav className="flex flex-col gap-2 text-sm font-bold">
                                    <a href="#" className="hover:underline decoration-2">Privacy</a>
                                    <a href="#" className="hover:underline decoration-2">Terms</a>
                                </nav>
                            </div>
                        </div>

                        <div className="text-sm font-mono text-retro-border border-l-2 border-retro-border pl-6 py-2">
                            EST. 2026<br />
                            &copy; {new Date().getFullYear()} LinkSite<br />
                            All Rights Reserved
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SiteLayout;
