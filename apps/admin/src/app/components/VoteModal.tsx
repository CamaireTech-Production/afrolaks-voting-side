import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Share2 } from 'lucide-react';
import { useState } from 'react';

interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  nomineeName: string;
  category: string;
}

export function VoteModal({ isOpen, onClose, nomineeName, category }: VoteModalProps) {
  const [shared, setShared] = useState(false);

  const handleShare = (platform: 'whatsapp' | 'instagram' | 'twitter') => {
    const message = `I just voted for ${nomineeName} in the ${category} category at the Afrolaks Awards! 🎉 Cast your vote now!`;
    
    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, so we'll just show a success message
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
    }
    
    window.open(url, '_blank');
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

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
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="relative bg-gradient-to-br from-black via-[#1a1a1a] to-black border-2 border-[#FFBD01] rounded-3xl p-8 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Success Icon */}
              <motion.div
                className="flex justify-center mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 bg-[#FFBD01] rounded-full blur-xl opacity-50"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.7, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <CheckCircle className="w-20 h-20 text-[#FFBD01] relative z-10" />
                </div>
              </motion.div>

              {/* Message */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold uppercase mb-2">
                  <span className="bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] bg-clip-text text-transparent">
                    Vote Submitted!
                  </span>
                </h3>
                <p className="text-gray-300 text-lg mb-2">
                  Your vote for <span className="text-[#FFBD01] font-bold">{nomineeName}</span>
                </p>
                <p className="text-gray-400 text-sm">
                  in the <span className="text-[#FF6A01]">{category}</span> category has been recorded.
                </p>
              </div>

              {/* Share Section */}
              <div className="space-y-4">
                <p className="text-center text-gray-400 text-sm">Share your vote:</p>
                <div className="flex gap-3 justify-center">
                  <motion.button
                    onClick={() => handleShare('whatsapp')}
                    className="flex-1 py-3 rounded-full bg-[#25D366]/20 border border-[#25D366] text-[#25D366] font-bold hover:bg-[#25D366] hover:text-black transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    WhatsApp
                  </motion.button>
                  <motion.button
                    onClick={() => handleShare('instagram')}
                    className="flex-1 py-3 rounded-full bg-[#E4405F]/20 border border-[#E4405F] text-[#E4405F] font-bold hover:bg-[#E4405F] hover:text-white transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Instagram
                  </motion.button>
                  <motion.button
                    onClick={() => handleShare('twitter')}
                    className="flex-1 py-3 rounded-full bg-[#1DA1F2]/20 border border-[#1DA1F2] text-[#1DA1F2] font-bold hover:bg-[#1DA1F2] hover:text-white transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Twitter
                  </motion.button>
                </div>
                
                {shared && (
                  <motion.div
                    className="text-center text-[#FFBD01] text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Share2 className="inline w-4 h-4 mr-1" />
                    Thanks for sharing!
                  </motion.div>
                )}
              </div>

              {/* Close Button */}
              <motion.button
                onClick={onClose}
                className="w-full mt-6 py-3 rounded-full bg-gradient-to-r from-[#FF0000] via-[#FF6A01] to-[#FFBD01] text-black font-bold uppercase"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Voting
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
