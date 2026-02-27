"use client";

import { Instagram } from 'lucide-react';
import { motion } from 'motion/react';

function TikTokIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" />
    </svg>
  );
}

export function Footer() {
  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/afrolaks.cm', label: 'Instagram' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@afrolaks.cameroon', label: 'TikTok' },
  ];

  return (
    <footer className="bg-black border-t border-[#FFBD01]/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img
              src="/logo.png"
              alt="Afrolaks"
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier nightlife recognition platform celebrating DJs, MCs, Influencers, and Event Organizers in the Anglophone region.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#FFBD01] font-bold uppercase mb-4 text-sm tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['Awards', 'Podcast', 'About Us', 'FAQ', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#FFBD01] transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-[#FFBD01] font-bold uppercase mb-4 text-sm tracking-wider">
              Follow Us
            </h4>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-[#FFBD01]/30 flex items-center justify-center text-[#FFBD01] hover:bg-[#FFBD01] hover:text-black transition-all"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#FFBD01]/20 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Afrolaks. All rights reserved. Rewarding Excellence, Redefining Nightlife.
          </p>
        </div>
      </div>
    </footer>
  );
}