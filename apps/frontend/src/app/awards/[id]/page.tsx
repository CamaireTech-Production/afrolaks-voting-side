"use client";

import { useParams } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Calendar, Disc3 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { VoteModal } from '@/components/VoteModal';
import { useNominees } from '@/hooks/useNominees';
import { useCategories } from '@/hooks/useCategories';
import { useVotes } from '@/hooks/useVotes';

export default function NomineeDetail() {
  const params = useParams();
  const nomineeId = params.id as string;

  const { nominees } = useNominees();
  const { categories } = useCategories();
  const { votes } = useVotes();

  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nominee = nominees.find(n => n.id === nomineeId);
  const category = categories.find(c => c.id === nominee?.categoryId);

  // Count votes for this nominee
  const nomineeVotes = votes.filter(v => v.nomineeId === nomineeId);
  const totalVotes = nomineeVotes.reduce((sum, v) => sum + v.voteCount, 0);

  const formatDate = (date: any) => {
    if (!date) return '';
    try {
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '';
    }
  };

  if (!isMounted || !nominee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFBD01]"></div>
          <p className="mt-4 text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link href="/awards">
          <motion.button
            className="flex items-center gap-2 text-[#FFBD01] hover:text-[#FF6A01] transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux Awards
          </motion.button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
              <ImageWithFallback
                src={nominee.image}
                alt={nominee.name}
                className="w-full h-full object-cover"
              />

              {/* Laurel Wreath Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <svg viewBox="0 0 200 100" className="w-full h-auto opacity-90">
                  <path
                    d="M 30 80 Q 25 70, 22 60 Q 20 50, 22 40 Q 25 30, 30 25"
                    stroke="#FFBD01"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 170 80 Q 175 70, 178 60 Q 180 50, 178 40 Q 175 30, 170 25"
                    stroke="#FFBD01"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 30 80 Q 100 90, 170 80"
                    stroke="#FFBD01"
                    strokeWidth="2.5"
                    fill="none"
                  />
                </svg>
              </div>
            </div>

            {/* Votes Badge */}
            <motion.div
              className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-[#FF0000] to-[#FFBD01] flex items-center justify-center shadow-xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{totalVotes}</div>
                <div className="text-xs font-bold text-black uppercase">Votes</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Category */}
            <div>
              <p className="text-sm text-[#FFBD01] font-bold uppercase mb-2">Catégorie</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white uppercase">
                {category?.name}
              </h1>
            </div>

            {/* Name */}
            <div>
              <p className="text-sm text-gray-400 font-bold uppercase mb-2">Nominé</p>
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent uppercase">
                {nominee.name}
              </h2>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="p-4 rounded-2xl bg-white/5 border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs text-gray-400 mb-2">Date d'ajout</p>
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Calendar className="w-4 h-4 text-[#FFBD01]" />
                  {formatDate(nominee.createdAt)}
                </div>
              </motion.div>

              <motion.div
                className="p-4 rounded-2xl bg-white/5 border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-xs text-gray-400 mb-2">Total Votes</p>
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Heart className="w-4 h-4 text-[#FF0000]" />
                  {totalVotes} votes
                </div>
              </motion.div>
            </div>

            {/* Description if exists */}
            {nominee.bio && (
              <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gray-300 leading-relaxed">{nominee.bio}</p>
              </motion.div>
            )}

            {/* Vote Now Button */}
            <motion.button
              onClick={() => setVoteModalOpen(true)}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold text-xl uppercase hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Vote Now
            </motion.button>

            {/* Stats */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-xs text-gray-400 uppercase font-bold mb-3">Statistics</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Votes reçus</span>
                  <span className="text-white font-bold">{totalVotes}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#FF0000] to-[#FFBD01]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalVotes / 50) * 100, 100)}%` }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Vote Modal */}
      {voteModalOpen && (
        <VoteModal
          isOpen={voteModalOpen}
          onClose={() => setVoteModalOpen(false)}
          nomineeName={nominee.name}
          category={category?.name || ''}
        />
      )}
    </div>
  );
}
