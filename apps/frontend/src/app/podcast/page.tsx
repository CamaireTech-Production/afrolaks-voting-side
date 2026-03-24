"use client";

import { motion } from 'motion/react';
import { Play, Calendar, Clock } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { usePodcasts } from '@/hooks/usePodcasts';

export default function Podcast() {
    const { podcasts, loading } = usePodcasts();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFBD01]"></div>
                    <p className="mt-4 text-gray-400">Chargement des podcasts...</p>
                </div>
            </div>
        );
    }

    const episodes = podcasts.map(ep => ({
        id: ep.id,
        number: String(ep.episodeNumber).padStart(2, '0'),
        title: ep.title,
        guest: ep.guest || '',
        description: ep.description || '',
        duration: ep.duration || '',
        date: ep.date || 'TBD',
        image: ep.image || 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=500&fit=crop',
        spotifyLink: ep.spotifyLink || '',
    }));

    const sortedEpisodes = [...episodes].sort((a, b) => parseInt(b.number) - parseInt(a.number));

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[60vh] flex items-center">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FF0000]/10 via-[#FF6A01]/10 to-transparent" />

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
                                    THE PODCAST
                                </span>
                            </h1>
                            <p className="text-xl sm:text-2xl text-[#FFBD01] font-bold mb-4 tracking-wide">
                                Deep Conversations with the Culture Shapers
                            </p>
                            <p className="text-gray-400 text-lg sm:text-xl max-w-xl">
                                Exclusive interviews with DJs, MCs, influencers, and event organizers who define the nightlife experience.
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
                                src="/official flyers/After episode.jpg.jpeg"
                                alt="Afrolaks Podcast"
                                className="relative z-10 w-full max-w-sm h-auto object-cover rounded-[2rem]"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Episode */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {sortedEpisodes.length > 0 && (
                    <motion.div
                        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-[#FFBD01]/30"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="grid md:grid-cols-2 gap-0">
                            <div className="relative aspect-square md:aspect-auto">
                                <ImageWithFallback
                                    src={sortedEpisodes[0].image}
                                    alt={sortedEpisodes[0].title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent md:hidden" />
                            </div>

                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="inline-block px-4 py-1 rounded-full bg-[#FFBD01] text-black text-sm font-bold uppercase mb-4 self-start">
                                    Latest Episode
                                </div>

                                <div className="text-sm text-[#FF6A01] font-bold uppercase mb-2">
                                    Episode {sortedEpisodes[0].number}
                                </div>

                                <h2 className="text-3xl lg:text-4xl font-bold mb-4">{sortedEpisodes[0].title}</h2>

                                <p className="text-xl text-gray-300 mb-4">with {sortedEpisodes[0].guest}</p>

                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    {sortedEpisodes[0].description}
                                </p>

                                <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {sortedEpisodes[0].date}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {sortedEpisodes[0].duration}
                                    </div>
                                </div>

                                <motion.a
                                    href={sortedEpisodes[0].spotifyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold uppercase self-start"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Listen Now
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </section>

            {/* All Episodes */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold uppercase mb-8">
                    <span className="text-[#FFBD01]">All Episodes</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {episodes.map((episode, index) => (
                        <motion.a
                            key={episode.id}
                            href={episode.spotifyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative rounded-3xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 border border-[#FFBD01]/20 hover:border-[#FFBD01] transition-all cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            {/* Episode Image */}
                            <div className="relative aspect-square overflow-hidden">
                                <ImageWithFallback
                                    src={episode.image}
                                    alt={episode.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <motion.div
                                        className="w-16 h-16 rounded-full bg-[#FFBD01] flex items-center justify-center"
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        <Play className="w-8 h-8 text-black fill-current ml-1" />
                                    </motion.div>
                                </div>

                                {/* Episode Number Badge */}
                                <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FFBD01] flex items-center justify-center font-bold text-black">
                                    {episode.number}
                                </div>
                            </div>

                            {/* Episode Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-[#FFBD01] transition-colors">
                                    {episode.title}
                                </h3>
                                <p className="text-gray-400 text-sm mb-4">with {episode.guest}</p>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                    {episode.description}
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {episode.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {episode.duration}
                                    </div>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </section>

            {/* Subscribe CTA */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl font-bold uppercase mb-4">
                        <span className="bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
                            Never Miss an Episode
                        </span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-8">
                        Subscribe to get notified about new episodes and exclusive content
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-[#FFBD01]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01]"
                        />
                        <motion.button
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold uppercase whitespace-nowrap"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Subscribe
                        </motion.button>
                    </div>

                    <p className="text-sm text-gray-500">
                        Available on Spotify, Apple Podcasts, and YouTube
                    </p>
                </motion.div>
            </section>
        </div>
    );
}
