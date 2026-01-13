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
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-12 bg-white p-12 border-2 border-retro-border retro-shadow relative overflow-hidden">
                <div className="relative text-center">
                    <div className="flex justify-center mb-8">
                        <div className="w-20 h-20 border-2 border-retro-border bg-retro-accent flex items-center justify-center retro-shadow-sm">
                            <UserPlus className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-retro-text tracking-tighter uppercase italic">
                        Register Identity
                    </h2>
                    <p className="mt-4 text-xs font-mono font-bold text-retro-border/40 uppercase tracking-widest leading-relaxed">
                        Secure your place in the archive.<br />
                        New entries are subject to validation.
                    </p>
                </div>

                <form className="mt-8 space-y-8 relative" onSubmit={handleRegister}>
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
                            <label className="text-[10px] font-mono font-bold text-retro-text uppercase tracking-[0.2em]">02. Access Token</label>
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

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-retro-text uppercase tracking-[0.2em]">03. Token Verification</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <ShieldCheck className="h-5 w-5 text-retro-border/30 group-focus-within:text-retro-accent transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                <UserPlus className="w-5 h-5" />
                                CREATE ENTRY
                            </>
                        )}
                    </button>

                    <div className="pt-8 border-t-2 border-retro-border/10 text-center">
                        <p className="text-[10px] font-mono font-bold text-retro-border/40 uppercase tracking-widest">
                            Already registered?{' '}
                            <Link to="/login" className="text-retro-accent hover:underline decoration-2">
                                Login to Identity
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
