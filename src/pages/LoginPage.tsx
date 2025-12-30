import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, LogIn, Github, Chrome, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // @ts-ignore
    const from = location.state?.from || '/';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signIn(email, password);
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-1000">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-neutral-200 shadow-2xl shadow-neutral-100 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

                <div className="relative">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <LogIn className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-neutral-900 tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-center text-sm text-neutral-500 font-medium">
                        Discover resources, join discussions, grow together.
                    </p>
                </div>

                <form className="mt-8 space-y-6 relative" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-neutral-300 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-4 bg-neutral-50 border-2 border-neutral-100 rounded-2xl text-neutral-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium placeholder:text-neutral-300"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Password</label>
                                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-neutral-300 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-4 bg-neutral-50 border-2 border-neutral-100 rounded-2xl text-neutral-900 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium placeholder:text-neutral-300"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] shadow-xl shadow-blue-100 disabled:opacity-50"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-neutral-400 font-bold uppercase tracking-widest text-xs">Or continue with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center py-3 border-2 border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors gap-2 font-bold text-sm text-neutral-700">
                            <Github className="w-5 h-5" />
                            Github
                        </button>
                        <button className="flex items-center justify-center py-3 border-2 border-neutral-100 rounded-xl hover:bg-neutral-50 transition-colors gap-2 font-bold text-sm text-neutral-700">
                            <Chrome className="w-5 h-5" />
                            Google
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-center text-sm text-neutral-600 font-medium">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Register now
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
