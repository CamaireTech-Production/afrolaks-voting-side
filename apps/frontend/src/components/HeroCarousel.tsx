'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

const HERO_IMAGES = [
  '/heroSection/WhatsApp Image 2026-03-23 at 16.22.06.jpeg',
  '/heroSection/WhatsApp Image 2026-03-23 at 16.22.47 (1).jpeg',
  '/heroSection/WhatsApp Image 2026-03-23 at 16.22.47 (2).jpeg',
  '/heroSection/WhatsApp Image 2026-03-23 at 16.22.47.jpeg',
  '/heroSection/WhatsApp Image 2026-03-23 at 16.22.49.jpeg',
  '/heroSection/WhatsApp Image 2026-03-23 at 16.22.50 (1).jpeg',
  '/heroSection/WhatsApp Image 2026-03-23 at 16.22.50 (2).jpeg',
  '/heroSection/WhatsApp Image 2026-03-23 at 16.22.50 (3).jpeg',
  '/heroSection/WhatsApp Image 2026-03-23 at 16.22.50 (4).jpeg',
  '/heroSection/WhatsApp Image 2026-03-23 at 16.22.50.jpeg',
];

export function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div className="relative z-10 w-full rounded-[2rem] overflow-hidden aspect-square sm:aspect-auto h-80 sm:h-96 md:h-[500px] bg-black" />
    );
  }

  return (
    <div className="relative z-10 w-full rounded-[2rem] overflow-hidden aspect-square sm:aspect-auto h-80 sm:h-96 md:h-[500px]">
      {/* Images Container */}
      <div className="relative w-full h-full">
        {HERO_IMAGES.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            style={{ zIndex: index === currentIndex ? 10 : 0 }}
          >
            <ImageWithFallback
              src={image}
              alt={`Afrolaks Experience ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_IMAGES.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`rounded-full transition-all ${
              index === currentIndex
                ? 'bg-[#FFBD01] w-8 h-2'
                : 'bg-white/40 w-2 h-2 hover:bg-white/60'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
}
