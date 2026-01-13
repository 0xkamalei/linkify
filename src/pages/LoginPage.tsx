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
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-12 bg-white p-12 border-2 border-retro-border retro-shadow relative overflow-hidden">
                <div className="relative text-center">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 border-2 border-retro-border bg-retro-accent flex items-center justify-center retro-shadow-sm">
                            <LogIn className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-retro-text tracking-tighter uppercase italic">
                        Access Archive
                    </h2>
                    <p className="mt-4 text-xs font-mono font-bold text-retro-border/40 uppercase tracking-widest leading-relaxed">
                        Authorized personnel only.<br />
                        Please provide credentials for verification.
                    </p>
                </div>

                <form className="mt-8 space-y-8 relative" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 border-2 border-red-600 text-red-600 p-4 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            Error: {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-retro-text uppercase tracking-[0.2em]">01. Email Identifier</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-retro-border/30 group-focus-within:text-retro-accent transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-retro-border text-retro-text focus:outline-none focus:bg-retro-bg/10 transition-all font-mono text-sm placeholder:text-retro-border/20"
                                    placeholder="user@archive.net"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-mono font-bold text-retro-text uppercase tracking-[0.2em]">02. Access Token</label>
                                <a href="#" className="text-[10px] font-mono font-bold text-retro-accent hover:underline">RECOVER?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-retro-border/30 group-focus-within:text-retro-accent transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-retro-border text-retro-text focus:outline-none focus:bg-retro-bg/10 transition-all font-mono text-sm placeholder:text-retro-border/20"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="retro-button w-full py-4 text-base flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-retro-border/30 border-t-retro-border rounded-none animate-spin"></div>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5" />
                                INITIATE VERIFICATION
                            </>
                        )}
                    </button>

                    <div className="pt-8 border-t-2 border-retro-border/10 text-center">
                        <p className="text-[10px] font-mono font-bold text-retro-border/40 uppercase tracking-widest">
                            New to the archive?{' '}
                            <Link to="/register" className="text-retro-accent hover:underline decoration-2">
                                Register Identity
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
