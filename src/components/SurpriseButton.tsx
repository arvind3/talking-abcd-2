import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface SurpriseButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const SurpriseButton: React.FC<SurpriseButtonProps> = ({ onClick, disabled }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-4 rounded-full font-bold text-lg shadow-xl shadow-purple-500/30 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-white"
    >
      <Sparkles className="w-6 h-6" />
      Surprise Me!
    </motion.button>
  );
};
