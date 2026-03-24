"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { Disc3, Mic2, Users, Calendar } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { VoteModal } from '@/components/VoteModal';
import { useCategories } from '@/hooks/useCategories';
import { useNominees } from '@/hooks/useNominees';

type Category = {
    id: string;
    name: string;
    icon?: React.ElementType;
    description: string;
    order?: number;
};

type Nominee = {
    id: string;
    name: string;
    image: string;
    categoryId: string;
    createdAt: any;
};

function AwardsContent() {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string | null>('best-dj');
    const [voteModalOpen, setVoteModalOpen] = useState(false);
    const [selectedNominee, setSelectedNominee] = useState<{ name: string; category: string } | null>(null);

    // Fetch data from Firestore
    const { categories: firestoreCategories, loading: catLoading, error: catError } = useCategories();
    const { nominees: firestoreNominees, loading: nomLoading, error: nomError } = useNominees();

    // Map Firestore categories to include icons
    const getCategoryIcon = (categoryId: string) => {
        const iconMap: { [key: string]: React.ElementType } = {
            'best-dj': Disc3,
            'hype-mc': Mic2,
            'influencer': Users,
            'event-organizer': Calendar,
        };
        return iconMap[categoryId] || Disc3;
    };

    const categories: Category[] = firestoreCategories.map(cat => ({
        ...cat,
        icon: getCategoryIcon(cat.id),
    }));

    const nominees: Nominee[] = firestoreNominees.map(nom => ({
        id: nom.id,
        name: nom.name,
        image: nom.image,
        categoryId: nom.categoryId,
        createdAt: nom.createdAt,
    }));

    // Smooth scroll to categories section when coming from Home page "Vote Now" button
    useEffect(() => {
        const shouldScroll = searchParams.get('vote') === 'true';
        if (shouldScroll) {
            setTimeout(() => {
                const el = document.getElementById('categories');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        }
    }, [searchParams]);

    const handleVote = (nominee: Nominee) => {
        const category = categories.find((c) => c.id === nominee.categoryId);
        setSelectedNominee({
            name: nominee.name,
            category: category?.name || '',
        });
        setVoteModalOpen(true);
    };

    const formatDate = (date: any) => {
        if (!date) return '';
        try {
            const d = date.toDate ? date.toDate() : new Date(date);
            return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch {
            return '';
        }
    };

    // Show loading state while fetching Firestore data
    if (catLoading || nomLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFBD01]"></div>
                    <p className="mt-4 text-gray-400">Chargement des catégories...</p>
                </div>
            </div>
        );
    }

    // Show error state if data failed to load
    if (catError || nomError) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#FF0000] mb-4">Erreur de chargement</h2>
                    <p className="text-gray-400">{catError || nomError}</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[60vh] flex items-center">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle, #FFBD01 1px, transparent 1px)`,
                            backgroundSize: '40px 40px',
                        }}
                    />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-left"
                        >
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase mb-4">
                                <span className="bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
                                    THE AWARDS
                                </span>
                            </h1>
                            <p className="text-xl sm:text-2xl text-[#FFBD01] font-bold mb-4 uppercase tracking-wide">
                                Fair & Transparent Public Voting
                            </p>
                            <p className="text-gray-400 text-lg sm:text-xl max-w-xl">
                                Your vote matters. Select a category below and cast your vote for the professionals who define our nightlife culture.
                            </p>
                        </motion.div>

                        {/* Right Column: Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative flex justify-center lg:justify-end mt-12 lg:mt-0 lg:pr-8"
                        >
                            <img
                                src="/official flyers/Date Awards.jpg.jpeg"
                                alt="Afrolaks Awards Tracker"
                                className="relative z-10 w-full max-w-sm h-auto object-cover rounded-[2rem]"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Category Selection */}
            <section id="categories" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <motion.h2
                    className="text-3xl sm:text-4xl font-bold uppercase text-center mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <span className="text-[#FFBD01]">SELECT A CATEGORY</span>
                </motion.h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {categories.map((category, index) => {
                        const isSelected = selectedCategory === category.id;
                        const categoryNominees = nominees.filter(n => n.categoryId === category.id);

                        return (
                            <React.Fragment key={category.id}>
                                <motion.button
                                    onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                                    className={`group relative rounded-3xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center min-h-[200px] sm:min-h-[220px] ${isSelected
                                        ? 'border-[#FFBD01] shadow-[0_0_20px_rgba(255,189,1,0.4)]'
                                        : 'border-white/10 hover:border-[#FFBD01]/40'
                                        }`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {/* Nominee Images Clash Background */}
                                    <div className={`absolute inset-0 flex transition-opacity duration-500 ${isSelected ? 'opacity-80' : 'opacity-40 group-hover:opacity-70'}`}>
                                        {categoryNominees.map((n) => (
                                            <div key={`bg-${n.id}`} className="flex-1 h-full border-r border-black/30 last:border-0 relative">
                                                <img
                                                    src={n.image}
                                                    alt=""
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Dark Gradient Overlay to ensure text readability */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500 ${isSelected ? 'opacity-80' : 'opacity-90 group-hover:opacity-60'}`} />

                                    <div className="relative z-10 flex flex-col items-center text-center p-6 h-full justify-end">
                                        <img
                                            src="/category-icon.png"
                                            alt="Afrolaks Awards Logo"
                                            className={`w-14 h-14 mb-4 object-contain drop-shadow-[0_0_8px_rgba(255,189,1,0.5)] transition-all duration-300 ${isSelected ? 'scale-110 brightness-110' : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'}`}
                                        />
                                        <h3 className={`text-xl sm:text-2xl font-bold uppercase leading-tight tracking-wider drop-shadow-xl ${isSelected ? 'text-[#FFBD01]' : 'text-white'}`}>
                                            {category.name}
                                        </h3>
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="w-3 h-3 rounded-full bg-[#FFBD01] animate-pulse shadow-[0_0_10px_#FFBD01]" />
                                        </div>
                                    )}
                                </motion.button>

                                {/* Accordion Nominees Section */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                            className="col-span-1 sm:col-span-2 lg:col-span-3 overflow-hidden origin-top"
                                        >
                                            <div className="pt-6 pb-12 mb-4">
                                                <h2 className="text-xl sm:text-3xl font-bold uppercase text-center mb-10">
                                                    <span className="bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
                                                        VOTE FOR YOUR FAVORITE IN {category.name}
                                                    </span>
                                                </h2>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                                                    {categoryNominees.map((nominee, idx) => (
                                                        <Link key={nominee.id} href={`/awards/${nominee.id}`}>
                                                            <motion.div
                                                                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-[#FFBD01]/20 hover:border-[#FFBD01] transition-all flex flex-col cursor-pointer h-full"
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: idx * 0.1 }}
                                                                whileHover={{ y: -6, scale: 1.02 }}
                                                            >
                                                                {/* Nominee Photo with Laurel Overlay */}
                                                                <div className="relative aspect-square overflow-hidden shrink-0">
                                                                    <ImageWithFallback
                                                                        src={nominee.image}
                                                                        alt={nominee.name}
                                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                    />

                                                                    {/* Golden Laurel Wreath Overlay */}
                                                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                                                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                                                                        <svg
                                                                            viewBox="0 0 200 100"
                                                                            className="w-full h-auto opacity-80 group-hover:opacity-100 transition-opacity"
                                                                        >
                                                                            {/* Left Laurel Branch */}
                                                                            <path
                                                                                d="M 30 80 Q 25 70, 22 60 Q 20 50, 22 40 Q 25 30, 30 25"
                                                                                stroke="#FFBD01"
                                                                                strokeWidth="2"
                                                                                fill="none"
                                                                            />
                                                                            {/* Right Laurel Branch */}
                                                                            <path
                                                                                d="M 170 80 Q 175 70, 178 60 Q 180 50, 178 40 Q 175 30, 170 25"
                                                                                stroke="#FFBD01"
                                                                                strokeWidth="2"
                                                                                fill="none"
                                                                            />
                                                                            {/* Bottom Arc */}
                                                                            <path
                                                                                d="M 30 80 Q 100 90, 170 80"
                                                                                stroke="#FFBD01"
                                                                                strokeWidth="2.5"
                                                                                fill="none"
                                                                            />
                                                                            {/* Decorative Leaves */}
                                                                            {[25, 35, 45, 55, 65].map((x) => (
                                                                                <circle key={`left-${x}`} cx={x} cy={70 - (x - 25) * 2} r="3" fill="#FFBD01" />
                                                                            ))}
                                                                            {[135, 145, 155, 165, 175].map((x) => (
                                                                                <circle key={`right-${x}`} cx={x} cy={70 - (175 - x) * 2} r="3" fill="#FFBD01" />
                                                                            ))}
                                                                        </svg>
                                                                    </div>
                                                                </div>

                                                                {/* Nominee Info */}
                                                                <div className="p-3 sm:p-6 flex flex-col flex-1">
                                                                    <h3 className="text-base sm:text-xl font-bold mb-2 text-white group-hover:text-[#FFBD01] transition-colors line-clamp-1">
                                                                        {nominee.name}
                                                                    </h3>
                                                                    <p className="text-xs sm:text-sm text-gray-400 mb-1">{category.name}</p>
                                                                    <p className="text-xs text-gray-500 mb-3 sm:mb-4">{formatDate(nominee.createdAt)}</p>

                                                                    {/* Vote Button */}
                                                                    <motion.button
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleVote(nominee);
                                                                        }}
                                                                        className="w-full mt-auto py-2 sm:py-3 rounded-full border border-[#FF6A01] sm:border-2 text-[#FF6A01] font-bold uppercase text-[10px] sm:text-sm hover:bg-[#FF6A01] hover:text-black transition-all"
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        Vote
                                                                    </motion.button>
                                                                </div>

                                                                {/* Glassmorphism Effect */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                                            </motion.div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        );
                    })}
                </div>
            </section>

            {/* Vote Modal */}
            {selectedNominee && (
                <VoteModal
                    isOpen={voteModalOpen}
                    onClose={() => setVoteModalOpen(false)}
                    nomineeName={selectedNominee.name}
                    category={selectedNominee.category}
                />
            )}
        </div>
    );
}

export default function Awards() {
    return (
        <Suspense fallback={null}>
            <AwardsContent />
        </Suspense>
    );
}
