import React from 'react';
import { Play, Square, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface CardProps {
  letter: string;
  word: string;
  emoji: string;
  color: string;
  textColor: string;
  isActive: boolean;
  isListened: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export const Card: React.FC<CardProps> = ({
  letter,
  word,
  emoji,
  color,
  textColor,
  isActive,
  isListened,
  onPlay,
  onStop,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex flex-col items-center justify-between p-6 rounded-3xl shadow-sm border-2 transition-all duration-300 ${
        isActive 
          ? 'border-yellow-400 shadow-xl shadow-yellow-200/50 scale-[1.02]' 
          : 'border-transparent hover:shadow-md'
      } ${color}`}
    >
      {isListened && (
        <div className="absolute top-4 right-4 text-yellow-500" title="You listened to this!">
          <Star className="w-6 h-6 fill-current" />
        </div>
      )}
      
      <div className="text-center w-full">
        <div className={`text-6xl font-black mb-1 ${textColor} font-sans tracking-tight`}>
          {letter}
        </div>
        <div className={`text-xl font-bold ${textColor} opacity-80 uppercase tracking-wider`}>
          {word}
        </div>
      </div>

      <div className="text-8xl my-6 filter drop-shadow-md select-none">
        {emoji}
      </div>

      <button
        onClick={isActive ? onStop : onPlay}
        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-lg font-bold text-white transition-all ${
          isActive 
            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
            : 'bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/30'
        }`}
        aria-label={isActive ? `Stop reading about ${word}` : `Play story about ${word}`}
      >
        {isActive ? (
          <>
            <Square className="w-6 h-6 fill-current" />
            Stop
          </>
        ) : (
          <>
            <Play className="w-6 h-6 fill-current" />
            Play
          </>
        )}
      </button>
    </motion.div>
  );
};
