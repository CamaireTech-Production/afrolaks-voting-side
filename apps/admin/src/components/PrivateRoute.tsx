import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, LogOut, Tags, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function PrivateRoute() {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-10 h-10 border-4 border-[#FFBD01] border-t-transparent flex rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen flex bg-black text-white">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col hidden md:flex">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold uppercase text-[#FFBD01] tracking-wider">
                        Afrolaks Admin
                    </h2>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {[
                        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
                        { name: 'Categories', icon: Tags, path: '/dashboard/categories' },
                        { name: 'Nominees', icon: Users, path: '/dashboard/nominees' },
                    ].map((item) => (
                        <a
                            key={item.name}
                            href={item.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-[#FFBD01] transition-colors group"
                        >
                            <item.icon className="w-5 h-5 group-hover:text-[#FF6A01]" />
                            <span className="font-medium tracking-wide">{item.name}</span>
                        </a>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => supabase.auth.signOut()}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <div className="md:hidden p-4 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                    <h2 className="text-xl font-bold uppercase text-[#FFBD01]">Afrolaks</h2>
                    <button onClick={() => supabase.auth.signOut()} className="text-red-500">
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
