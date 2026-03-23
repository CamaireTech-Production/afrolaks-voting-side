import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const { user, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#FFBD01] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement...</p>
                </div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            if (!email || !password) {
                throw new Error('Email et mot de passe requis');
            }

            await signInWithEmailAndPassword(auth, email, password);
            setEmail('');
            setPassword('');
        } catch (err) {
            const msg = (err as Error).message;
            if (msg.includes('invalid-email')) setError('Email invalide');
            else if (msg.includes('user-not-found')) setError('Compte admin inexistant');
            else if (msg.includes('wrong-password')) setError('Mot de passe incorrect');
            else setError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen py-20 px-4 bg-black flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/10 via-[#FF6A01]/10 to-[#FFBD01]/10" />

            <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white/5 border border-[#FFBD01]/20 backdrop-blur-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold uppercase text-white mb-2">
                        Afrolaks <span className="text-[#FFBD01]">Admin</span>
                    </h1>
                    <p className="text-gray-400">Connexion Admin</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 rounded-2xl bg-[#FF0000]/20 border border-[#FF0000]/50">
                            <p className="text-[#FF0000] font-semibold text-sm">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@afrolaks.com"
                            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-[#FFBD01]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01]"
                            disabled={submitting}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-[#FFBD01]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01]"
                            disabled={submitting}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-3 rounded-full font-bold uppercase transition-all ${
                            submitting
                                ? 'bg-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] hover:shadow-lg text-black'
                        }`}
                    >
                        {submitting ? 'Connexion...' : 'Se connecter'}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                        Compte admin créé par l'administrateur principal
                    </p>
                </form>
            </div>
        </div>
    );
}

