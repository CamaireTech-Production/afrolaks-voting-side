"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Awards', path: '/awards' },
    { name: 'Podcast', path: '/podcast' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-[#FFBD01]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.img
              src="/logo.png"
              alt="Afrolaks"
              className="h-12 w-auto"
              whileHover={{ scale: 1.05 }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="relative py-2"
              >
                <motion.span
                  className={`text-base uppercase tracking-wide transition-colors ${pathname === link.path
                    ? 'text-[#FFBD01]'
                    : 'text-white hover:text-[#FFBD01]'
                    }`}
                  style={{ fontFamily: 'var(--font-body)' }}
                  whileHover={{ y: -2 }}
                >
                  {link.name}
                </motion.span>
                {pathname === link.path && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01]"
                    layoutId="underline"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#FFBD01] p-2 -mr-2 hover:bg-white/5 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Mobile Menu Side Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                style={{ height: '100dvh' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-[#0a0a0a] border-l border-[#FFBD01]/20 z-50 md:hidden flex flex-col shadow-2xl"
                style={{ height: '100dvh' }}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                <div className="flex items-center justify-between p-6 border-b border-white/5 h-20">
                  <span className="text-[#FFBD01] font-bold uppercase tracking-widest text-sm">Menu</span>
                  <button
                    className="text-[#FFBD01] p-2 -mr-2 hover:bg-white/5 rounded-full transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X size={28} />
                  </button>
                </div>
                <div className="flex-1 py-8 px-6 space-y-2 overflow-y-auto">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-4 px-5 text-lg font-medium uppercase tracking-wide transition-all rounded-2xl ${pathname === link.path
                        ? 'text-[#FFBD01] bg-[#FFBD01]/10 border border-[#FFBD01]/20'
                        : 'text-gray-300 hover:text-[#FFBD01] hover:bg-white/5'
                        }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}