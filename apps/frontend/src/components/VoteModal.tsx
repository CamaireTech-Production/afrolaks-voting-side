"use client";

import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Instagram, Minus, Plus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

function TikTokIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.16z" />
    </svg>
  );
}

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  nomineeName: string;
  category: string;
}

const PRICE_PER_VOTE = 100; // XAF per vote

export function VoteModal({ isOpen, onClose, nomineeName, category }: VoteModalProps) {
  const [step, setStep] = useState<'select' | 'success'>('select');
  const [voteCount, setVoteCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shared, setShared] = useState(false);

  // Reset state when modal is opened afresh
  useEffect(() => {
    if (isOpen) {
      setStep('select');
      setVoteCount(1);
      setIsProcessing(false);
      setShared(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleVote = async () => {
    setIsProcessing(true);
    // Simulate Payment API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep('success');
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const incrementVotes = () => setVoteCount(prev => prev + 1);
  const decrementVotes = () => setVoteCount(prev => (prev > 1 ? prev - 1 : 1));

  const totalXAF = voteCount * PRICE_PER_VOTE;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? handleClose : undefined}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative bg-gradient-to-br from-black via-[#1a1a1a] to-black border-2 border-white/20 rounded-3xl p-8 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              {!isProcessing && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              )}

              {step === 'select' ? (
                // --- STEP 1: SELECT VOTES & PAY ---
                <div className="flex flex-col items-center">
                  <h3 className="text-2xl font-bold uppercase mb-2 text-center">
                    Vote for <span className="text-[#FFBD01]">{nomineeName}</span>
                  </h3>
                  <p className="text-gray-400 text-sm mb-8 text-center uppercase tracking-wider">
                    {category}
                  </p>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full mb-8">
                    <p className="text-center text-gray-300 font-medium mb-4 uppercase text-sm">
                      How many votes?
                    </p>

                    <div className="flex items-center justify-center gap-6 mb-6">
                      <button
                        onClick={decrementVotes}
                        disabled={voteCount <= 1}
                        className="w-12 h-12 rounded-full border border-[#FFBD01]/50 text-[#FFBD01] flex items-center justify-center hover:bg-[#FFBD01]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                      >
                        <Minus size={20} />
                      </button>

                      <div className="text-4xl font-bold text-white w-20 text-center">
                        {voteCount}
                      </div>

                      <button
                        onClick={incrementVotes}
                        className="w-12 h-12 rounded-full border border-[#FFBD01]/50 text-[#FFBD01] flex items-center justify-center hover:bg-[#FFBD01]/10 transition-all"
                      >
                        <Plus size={20} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-white/10">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-2xl font-bold text-[#FFBD01]">{totalXAF.toLocaleString()} XAF</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleVote}
                    disabled={isProcessing}
                    className="w-full py-4 rounded-full bg-white text-black font-bold uppercase flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:hover:bg-white"
                    whileHover={!isProcessing ? { scale: 1.02 } : {}}
                    whileTap={!isProcessing ? { scale: 0.98 } : {}}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay ${totalXAF.toLocaleString()} XAF to Vote`
                    )}
                  </motion.button>
                </div>
              ) : (
                // --- STEP 2: SUCCESS & SHARE ---
                <div className="flex flex-col items-center">
                  <motion.div
                    className="flex justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="w-20 h-20 text-[#25D366]" />
                  </motion.div>

                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold uppercase mb-2">
                      <span className="bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
                        Vote Submitted!
                      </span>
                    </h3>
                    <p className="text-gray-300 text-lg mb-2">
                      You added <span className="text-white font-bold">{voteCount}</span> vote{voteCount > 1 ? 's' : ''} for <span className="text-[#FFBD01] font-bold">{nomineeName}</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      in the <span className="text-[#FF6A01]">{category}</span> category.
                    </p>
                  </div>

                  {/* Share Section */}
                  <div className="w-full space-y-4 mb-8">
                    <p className="text-center text-gray-400 text-sm uppercase tracking-wider">Share on your socials</p>
                    <div className="flex gap-4 justify-center">
                      <motion.button
                        onClick={() => handleShare()}
                        className="py-3 px-6 rounded-full bg-[#E4405F]/10 border border-[#E4405F] text-[#E4405F] font-bold hover:bg-[#E4405F] hover:text-white transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Instagram className="w-5 h-5" />
                        Instagram
                      </motion.button>
                      <motion.button
                        onClick={() => handleShare()}
                        className="py-3 px-6 rounded-full bg-[#00f2ea]/10 border border-[#00f2ea] text-[#00f2ea] font-bold hover:bg-[#00f2ea] hover:text-black transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <TikTokIcon className="w-5 h-5" />
                        TikTok
                      </motion.button>
                    </div>

                    {shared && (
                      <motion.div
                        className="text-center text-[#FFBD01] text-sm mt-4"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <CheckCircle className="inline w-4 h-4 mr-1" />
                        Copied to clipboard! Share it with your friends!
                      </motion.div>
                    )}
                  </div>

                  {/* Close Button */}
                  <motion.button
                    onClick={handleClose}
                    className="w-full py-3 rounded-full bg-white text-black font-bold uppercase hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Voting
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
