import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { motion } from 'motion/react';
import afrolaksLogo from '../../assets/9b4daf83341b435a708bbed11c60e3d0c8605561.png';

export function Footer() {
  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-black border-t border-[#FFBD01]/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img
              src={afrolaksLogo}
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