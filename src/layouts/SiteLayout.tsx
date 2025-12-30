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
        <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200 shadow-sm h-16 flex items-center px-4 md:px-8">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-neutral-900 tracking-tight">LinkSite</span>
                        </Link>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="hidden md:flex relative group">
                            <input
                                type="text"
                                placeholder="Search topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 lg:w-96 bg-neutral-100 border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-500" />
                        </form>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/share" className="flex items-center gap-1.5 text-neutral-600 hover:text-blue-600 transition-colors px-3 py-1.5 rounded-md hover:bg-blue-50">
                            <PlusCircle className="w-5 h-5" />
                            <span className="hidden sm:inline text-sm font-medium">Share</span>
                        </Link>

                        <div className="h-6 w-px bg-neutral-200 hidden sm:block"></div>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link to="/account" className="flex items-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-all border border-neutral-200">
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-neutral-800 transition-all active:scale-95 shadow-lg shadow-neutral-200">
                                <User className="w-4 h-4" />
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-neutral-200 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-blue-600" />
                            <span className="text-lg font-bold text-neutral-900">LinkSite</span>
                        </div>

                        <nav className="flex items-center gap-8 text-sm font-medium text-neutral-500">
                            <a href="#" className="hover:text-blue-600 transition-colors">About</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Blog</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                        </nav>

                        <div className="text-sm text-neutral-400">
                            &copy; {new Date().getFullYear()} LinkSite. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SiteLayout;
