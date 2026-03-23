import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { LayoutDashboard, LogOut, Tags, Users, TrendingUp, Music, Mail, Image, Menu, X } from 'lucide-react';

export function PrivateRoute() {
    const { user, loading, signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Catégories', icon: Tags, path: '/dashboard/categories' },
        { name: 'Nominations', icon: Users, path: '/dashboard/nominees' },
        { name: 'Votes', icon: TrendingUp, path: '/dashboard/votes' },
        { name: 'Podcasts', icon: Music, path: '/dashboard/podcasts' },
        { name: 'Contacts', icon: Mail, path: '/dashboard/contacts' },
        { name: 'Galerie', icon: Image, path: '/dashboard/gallery' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#FFBD01] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Chargement du dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen w-full flex flex-col bg-black text-white">
            {/* Desktop Sidebar */}
            <div className="w-full flex flex-1 overflow-hidden">
                <aside className="w-64 border-r border-white/10 bg-[#0a0a0a] flex flex-col hidden md:flex">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold uppercase text-[#FFBD01] tracking-wider">
                            Afrolaks Admin
                        </h2>
                    </div>
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => (
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
                            onClick={signOut}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Déconnexion</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile Header - Fixed */}
                {/* Desktop Main */}
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
                        <h2 className="text-lg font-bold uppercase text-[#FFBD01]">Afrolaks</h2>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 hover:bg-white/10 rounded transition-colors"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Overlay */}
                    {mobileMenuOpen && (
                        <>
                            <div
                                className="md:hidden fixed inset-0 z-40 bg-black/50"
                                onClick={() => setMobileMenuOpen(false)}
                            />
                            <nav className="md:hidden fixed top-16 left-0 right-0 z-40 bg-[#0a0a0a] border-b border-white/10 p-4 space-y-2 max-h-96 overflow-y-auto">
                                {navItems.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 rounded text-gray-400 hover:bg-white/5 hover:text-[#FFBD01] transition-colors"
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </a>
                                ))}
                                <button
                                    onClick={signOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Déconnexion</span>
                                </button>
                            </nav>
                        </>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-auto pt-16 md:pt-0 p-4 md:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
