"use client";

import { motion } from 'motion/react';
import { Play, Calendar, Clock } from 'lucide-react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

export default function Podcast() {
    const episodes = [
        {
            id: 1,
            number: '01',
            title: 'The Art of the DJ',
            guest: 'DJ Spinall',
            description: 'Exploring the craft behind the decks with one of Africa\'s finest DJs.',
            duration: '45 min',
            date: 'Feb 15, 2026',
            image: 'https://images.unsplash.com/photo-1600542552868-56ed242290e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxESiUyMHR1cm50YWJsZXMlMjBtaXhpbmd8ZW58MXx8fHwxNzcxOTI4NTI3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 2,
            number: '02',
            title: 'Hype MC Secrets',
            guest: 'MC Presido',
            description: 'The untold secrets of controlling the crowd and keeping the energy high.',
            duration: '38 min',
            date: 'Feb 12, 2026',
            image: 'https://images.unsplash.com/photo-1746189861370-7a41351d7f11?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFsZSUyME1DJTIwcGVyZm9ybWVyfGVufDF8fHx8MTc3MTkyODU5MXww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 3,
            number: '03',
            title: 'Building Nightlife Brands',
            guest: 'Obi Asika',
            description: 'From concept to execution: creating experiences that last.',
            duration: '52 min',
            date: 'Feb 8, 2026',
            image: 'https://images.unsplash.com/photo-1712903276003-b814091e7770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMG9yZ2FuaXplciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzE5Mjg1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 4,
            number: '04',
            title: 'The Culture of the Dance Floor',
            guest: 'DJ Neptune',
            description: 'Understanding the connection between music, movement, and culture.',
            duration: '41 min',
            date: 'Feb 5, 2026',
            image: 'https://images.unsplash.com/photo-1683549581667-6a0203d3f24a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbHViJTIwcGFydHklMjBjcm93ZCUyMGRhbmNpbmd8ZW58MXx8fHwxNzcxOTI4NTI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 5,
            number: '05',
            title: 'Influencer Impact',
            guest: 'Toke Makinwa',
            description: 'How social media is reshaping the nightlife ecosystem.',
            duration: '36 min',
            date: 'Feb 1, 2026',
            image: 'https://images.unsplash.com/photo-1559154352-06e29e1e11aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZmVtYWxlJTIwaW5mbHVlbmNlcnxlbnwxfHx8fDE3NzE5Mjg1OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
            id: 6,
            number: '06',
            title: 'Behind the Booth',
            guest: 'DJ Cuppy',
            description: 'A global perspective on African nightlife and musical identity.',
            duration: '43 min',
            date: 'Jan 28, 2026',
            image: 'https://images.unsplash.com/photo-1673447067622-bbc8a34e2c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBESnxlbnwxfHx8fDE3NzE5Mjg1OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
    ];

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
                <motion.div
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-[#FFBD01]/30"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="grid md:grid-cols-2 gap-0">
                        <div className="relative aspect-square md:aspect-auto">
                            <ImageWithFallback
                                src={episodes[0].image}
                                alt={episodes[0].title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent md:hidden" />
                        </div>

                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                            <div className="inline-block px-4 py-1 rounded-full bg-[#FFBD01] text-black text-sm font-bold uppercase mb-4 self-start">
                                Latest Episode
                            </div>

                            <div className="text-sm text-[#FF6A01] font-bold uppercase mb-2">
                                Episode {episodes[0].number}
                            </div>

                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{episodes[0].title}</h2>

                            <p className="text-xl text-gray-300 mb-4">with {episodes[0].guest}</p>

                            <p className="text-gray-400 mb-6 leading-relaxed">
                                {episodes[0].description}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {episodes[0].date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {episodes[0].duration}
                                </div>
                            </div>

                            <motion.button
                                className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold uppercase self-start"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Play className="w-5 h-5 fill-current" />
                                Listen Now
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* All Episodes */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold uppercase mb-8">
                    <span className="text-[#FFBD01]">All Episodes</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {episodes.map((episode, index) => (
                        <motion.div
                            key={episode.id}
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
                        </motion.div>
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
