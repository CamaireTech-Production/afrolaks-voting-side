import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-10 h-10 border-4 border-[#FFBD01] border-t-transparent flex rounded-full animate-spin"></div>
            </div>
        );
    }

    if (session) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen py-20 px-4 bg-black flex items-center justify-center relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000]/10 via-[#FF6A01]/10 to-[#FFBD01]/10" />

            <div className="relative z-10 w-full max-w-md p-8 rounded-3xl bg-white/5 border border-[#FFBD01]/20 backdrop-blur-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold uppercase text-white mb-2">
                        Afrolaks <span className="text-[#FFBD01]">Admin</span>
                    </h1>
                    <p className="text-gray-400">Sign in to manage voting & categories</p>
                </div>

                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: '#FF6A01',
                                    brandAccent: '#FFBD01',
                                    inputBackground: 'rgba(255,255,255,0.05)',
                                    inputText: 'white',
                                    inputBorder: 'rgba(255,189,1,0.3)',
                                    inputBorderHover: 'rgba(255,189,1,0.6)',
                                    inputBorderFocus: '#FFBD01',
                                    messageText: '#FFBD01',
                                    anchorTextColor: '#FFBD01',
                                    anchorTextHoverColor: '#FF6A01',
                                    dividerBackground: 'rgba(255,255,255,0.1)',
                                },
                                radii: {
                                    borderRadiusButton: '20px',
                                    buttonBorderRadius: '20px',
                                    inputBorderRadius: '12px',
                                },
                            },
                        },
                        className: {
                            container: 'supabase-auth-ui',
                            label: 'text-gray-300 font-bold uppercase text-xs mb-2',
                            button: 'font-bold uppercase tracking-wider',
                        },
                    }}
                    providers={[]}
                    theme="dark"
                />
            </div>
        </div>
    );
}
