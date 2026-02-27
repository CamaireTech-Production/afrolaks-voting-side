"use client";

import { motion } from 'motion/react';
import { Mail, Send, Instagram } from 'lucide-react';

function TikTokIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" />
        </svg>
    );
}
import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const contactInfo = [
        {
            icon: Mail,
            title: 'Email',
            value: 'Afrolaks.cm@gmail.com',
            link: 'mailto:Afrolaks.cm@gmail.com',
        },
    ];

    const socialLinks = [
        { icon: Instagram, name: 'Instagram', handle: '@afrolaks.cm', color: '#E4405F', href: 'https://www.instagram.com/afrolaks.cm' },
        { icon: TikTokIcon, name: 'TikTok', handle: '@afrolaks.cameroon', color: '#00f2ea', href: 'https://www.tiktok.com/@afrolaks.cameroon' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[60vh] flex items-center">
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
                            <h1 className="text-4xl sm:text-6xl font-bold uppercase mb-6">
                                <span className="bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
                                    GET IN TOUCH
                                </span>
                            </h1>
                            <p className="text-xl sm:text-2xl text-[#FFBD01] font-bold mb-4 tracking-wide">
                                We&apos;d Love to Hear From You
                            </p>
                            <p className="text-gray-400 text-lg sm:text-xl max-w-xl">
                                Whether you have questions about the awards, want to partner with us, or just want to say hello, we&apos;re here for you.
                            </p>
                        </motion.div>

                        {/* Right Column: Image */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative mt-12 lg:mt-0"
                        >
                            {/* Rounded Image */}
                            <img
                                src="/official flyers/Guest.jpg.jpeg"
                                alt="Contact Us"
                                className="relative z-10 w-full rounded-[2rem] object-cover bg-black/60"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 max-w-md mx-auto gap-6 mb-16">
                    {contactInfo.map((info, index) => {
                        const Icon = info.icon;
                        return (
                            <motion.div
                                key={info.title}
                                className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-[#FFBD01]/20 hover:border-[#FFBD01] transition-all text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Icon className="w-10 h-10 text-[#FFBD01] mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-[#FF6A01] mb-2 uppercase">
                                    {info.title}
                                </h3>
                                {info.link ? (
                                    <a
                                        href={info.link}
                                        className="text-gray-300 hover:text-[#FFBD01] transition-colors"
                                    >
                                        {info.value}
                                    </a>
                                ) : (
                                    <p className="text-gray-300">{info.value}</p>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Contact Form & Social */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-[#FFBD01]/20">
                            <h2 className="text-3xl font-bold uppercase mb-6">
                                <span className="text-[#FFBD01]">Send Us a Message</span>
                            </h2>

                            {submitted ? (
                                <motion.div
                                    className="text-center py-12"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="w-20 h-20 rounded-full bg-[#FFBD01] flex items-center justify-center mx-auto mb-4">
                                        <Send className="w-10 h-10 text-black" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#FFBD01] mb-2">
                                        Message Sent!
                                    </h3>
                                    <p className="text-gray-400">
                                        We&apos;ll get back to you as soon as possible.
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-[#FFBD01]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                                                Your Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-[#FFBD01]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                                            Subject
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-[#FFBD01]/30 text-white focus:outline-none focus:border-[#FFBD01] transition-colors"
                                        >
                                            <option value="" className="bg-black">Select a subject</option>
                                            <option value="voting" className="bg-black">Voting Inquiry</option>
                                            <option value="partnership" className="bg-black">Partnership Opportunity</option>
                                            <option value="media" className="bg-black">Media & Press</option>
                                            <option value="general" className="bg-black">General Inquiry</option>
                                            <option value="feedback" className="bg-black">Feedback</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase">
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-[#FFBD01]/30 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFBD01] transition-colors resize-none"
                                            placeholder="Tell us what's on your mind..."
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold uppercase flex items-center justify-center gap-2"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Send className="w-5 h-5" />
                                        Send Message
                                    </motion.button>
                                </form>
                            )}
                        </div>
                    </motion.div>

                    {/* Social & Additional Info */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        {/* Social Media */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-[#FFBD01]/20">
                            <h3 className="text-xl font-bold uppercase mb-4">
                                <span className="text-[#FFBD01]">Follow Us</span>
                            </h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Stay updated with the latest news and announcements
                            </p>

                            <div className="space-y-3">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <motion.a
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FFBD01] transition-all group"
                                            whileHover={{ x: 5 }}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                                style={{ backgroundColor: `${social.color}20` }}
                                            >
                                                <Icon className="w-5 h-5" style={{ color: social.color }} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-white group-hover:text-[#FFBD01] transition-colors">
                                                    {social.name}
                                                </div>
                                                <div className="text-xs text-gray-500">{social.handle}</div>
                                            </div>
                                        </motion.a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Office Hours */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-[#FFBD01]/20">
                            <h3 className="text-xl font-bold uppercase mb-4">
                                <span className="text-[#FFBD01]">Office Hours</span>
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Monday - Friday</span>
                                    <span className="text-white font-bold">9AM - 6PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Saturday</span>
                                    <span className="text-white font-bold">10AM - 4PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Sunday</span>
                                    <span className="text-gray-500">Closed</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Response */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FFBD01]/10 to-[#FF6A01]/10 border border-[#FFBD01]/30">
                            <h3 className="text-lg font-bold text-[#FFBD01] mb-2">
                                Quick Response
                            </h3>
                            <p className="text-sm text-gray-300">
                                We typically respond to all inquiries within 24-48 hours.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>


        </div>
    );
}
