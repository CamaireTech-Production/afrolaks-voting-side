"use client";

import { motion } from 'motion/react';
import { ArrowRight, Award, Radio, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';

export default function Home() {
  const galleryImages = [
    { url: '/dj.png', alt: 'DJ Performance' },
    { url: '/gitl in nightclub.png', alt: 'Girl in Nightclub' },
    { url: '/nightlife.png', alt: 'Nightlife Experience' },
    { url: '/nigth club.png', alt: 'Nightclub Scene' },
    { url: '/image.png', alt: 'Event Celebration' },
    { url: '/official flyers/Couverture video.jpg.jpeg', alt: 'Afrolaks Video Cover' },
  ];

  const podcastEpisodes = [
    { id: 1, title: 'The Art of the DJ', guest: 'DJ Spinall', duration: '45 min' },
    { id: 2, title: 'Hype MC Secrets', guest: 'MC Presido', duration: '38 min' },
    { id: 3, title: 'Building Nightlife Brands', guest: 'Obi Asika', duration: '52 min' },
    { id: 4, title: 'The Culture of the Dance Floor', guest: 'DJ Neptune', duration: '41 min' },
    { id: 5, title: 'Influencer Impact', guest: 'Toke Makinwa', duration: '36 min' },
  ];

  const features = [
    { icon: Award, title: 'Prestigious Awards', description: 'Celebrating excellence like the Grammys of nightlife' },
    { icon: Users, title: 'Community Driven', description: 'Fair and transparent public voting system' },
    { icon: Radio, title: 'Exclusive Podcast', description: 'Deep dives with industry leaders and creators' },
    { icon: Sparkles, title: 'Cultural Impact', description: 'Honoring the ecosystem of nightlife professionals' },
  ];

  const [isMounted, setIsMounted] = useState(false);
  const [backgroundElements, setBackgroundElements] = useState<{ width: number, height: number, left: string, top: string, x: number[], y: number[], duration: number }[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const elements = [...Array(6)].map(() => ({
      width: Math.random() * 300 + 100,
      height: Math.random() * 300 + 100,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      x: [0, Math.random() * 100 - 50],
      y: [0, Math.random() * 100 - 50],
      duration: Math.random() * 10 + 10,
    }));
    setBackgroundElements(elements);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-24 pb-12">
        {/* Animated Background Elements */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden">
            {backgroundElements.map((el, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full opacity-10"
                style={{
                  width: el.width,
                  height: el.height,
                  background: `linear-gradient(135deg, #FF0000, #FF6A01, #FFBD01)`,
                  left: el.left,
                  top: el.top,
                }}
                animate={{
                  x: el.x,
                  y: el.y,
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: el.duration,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            ))}
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Text */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase mb-6 tracking-tight leading-tight"
                style={{ fontFamily: 'var(--font-headline)' }}
              >
                <span className="block text-[#FFBD01]">REWARDING</span>
                <span className="block text-[#FFBD01]">EXCELLENCE,</span>
                <span className="block bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
                  REDEFINING
                </span>
                <span className="block bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
                  NIGHTLIFE
                </span>
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl text-gray-300 mb-10 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Celebrating the DJs, MCs, and Creators who drive the culture
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="inline-block"
              >
                <Link href="/awards?vote=true">
                  <motion.button
                    className="group relative px-10 py-4 sm:px-12 sm:py-5 rounded-full text-black font-bold text-lg sm:text-xl uppercase overflow-hidden"
                    style={{
                      background: 'linear-gradient(90deg, #FF0000, #FF6A01, #FFBD01)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      VOTE NOW
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Column: Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-12 lg:mt-0"
            >
              {/* Rounded Image */}
              <ImageWithFallback
                src="/official flyers/Couverture video.jpg.jpeg"
                alt="Afrolaks Nightlife Experience"
                className="relative z-10 w-full rounded-[2rem] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="p-6 rounded-3xl bg-white/5 border border-[#FFBD01]/20 backdrop-blur-sm hover:bg-white/10 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <feature.icon className="w-12 h-12 text-[#FFBD01] mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Experience Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold uppercase mb-4">
            <span className="bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
              THE EXPERIENCE
            </span>
          </h2>
          <p className="text-xl text-gray-400">Where culture meets celebration</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 auto-rows-[150px] sm:auto-rows-[200px] lg:auto-rows-[250px]">
          {galleryImages.map((image, index) => {
            // Create a dynamic spanning pattern
            let spanClass = '';

            // On mobile (cols-2):
            // items 0, 3 will span 1 col, 2 rows (portrait)
            // item 1 will span 1 col, 1 row (square)
            // item 2 will span 2 cols, 1 row (wide landscape)
            // item 4 will span 1 col, 1 row
            // item 5 will span 2 cols, 2 rows (large feature)

            if (index === 0) spanClass = 'col-span-1 row-span-2';
            else if (index === 1) spanClass = 'col-span-1 row-span-1';
            else if (index === 2) spanClass = 'col-span-2 md:col-span-1 row-span-1 md:row-span-2';
            else if (index === 3) spanClass = 'col-span-1 md:col-span-2 row-span-2 md:row-span-1';
            else if (index === 4) spanClass = 'col-span-1 row-span-1';
            else if (index === 5) spanClass = 'col-span-2 md:col-span-1 row-span-2';

            return (
              <motion.div
                key={index}
                className={`relative group overflow-hidden rounded-2xl cursor-pointer ${spanClass}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  className="absolute inset-0 border-2 border-[#FFBD01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  initial={false}
                  whileHover={{
                    boxShadow: '0 0 30px rgba(255, 189, 1, 0.6)',
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Podcast Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold uppercase mb-4">
              <span className="bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
                THE PODCAST
              </span>
            </h2>
            <p className="text-xl text-gray-400">Conversations that matter</p>
          </motion.div>

          <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#FFBD01] scrollbar-track-white/10">
            {podcastEpisodes.map((episode, index) => (
              <motion.div
                key={episode.id}
                className="min-w-[350px] snap-center p-6 rounded-3xl border border-[#FFBD01]/30 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm hover:border-[#FFBD01] transition-all cursor-pointer group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FFBD01] flex items-center justify-center">
                    <Radio className="w-8 h-8 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-[#FFBD01] font-bold uppercase">
                      Episode {episode.id.toString().padStart(2, '0')}
                    </div>
                    <div className="text-xs text-gray-400">{episode.duration}</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#FFBD01] transition-colors">
                  {episode.title}
                </h3>
                <p className="text-gray-400">with {episode.guest}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/podcast">
              <motion.button
                className="px-8 py-3 rounded-full border-2 border-[#FF6A01] text-[#FF6A01] font-bold uppercase hover:bg-[#FF6A01] hover:text-black transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All Episodes
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF0000]/20 via-[#FF6A01]/20 to-[#FFBD01]/20" />
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-6xl font-bold uppercase mb-6">
            <span className="bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
              CAST YOUR VOTE
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Support your favorite DJs, MCs, and nightlife creators. Your voice matters.
          </p>
          <Link href="/awards?vote=true">
            <motion.button
              className="px-12 py-5 rounded-full bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold text-xl uppercase"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Vote Now
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
