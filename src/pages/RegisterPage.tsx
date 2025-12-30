import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, UserPlus, ShieldCheck, AlertCircle } from 'lucide-react';

const RegisterPage: React.FC = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        setError('');
        try {
            await signUp(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-1000">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl border border-neutral-200 shadow-2xl shadow-neutral-100 relative overflow-hidden">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

                <div className="relative">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <UserPlus className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-2 text-center text-3xl font-extrabold text-neutral-900 tracking-tight">
                        Create Account
                    </h2>
                    <p className="mt-2 text-center text-sm text-neutral-500 font-medium">
                        Join our community and start sharing amazing things.
                    </p>
                </div>

                <form className="mt-8 space-y-6 relative" onSubmit={handleRegister}>
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
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Password</label>
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

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest px-1">Confirm Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <ShieldCheck className="h-5 w-5 text-neutral-300 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            'Create Account'
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-neutral-600 font-medium">
                    Already have an account?{' '}
                    <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        Log in instead
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
