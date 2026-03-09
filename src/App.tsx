import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Card } from './components/Card';
import { SurpriseButton } from './components/SurpriseButton';
import { useSpeech } from './hooks/useSpeech';
import lettersData from './data/letters.json';
import { Volume2 } from 'lucide-react';

export default function App() {
  const { play, stop, activeLetter } = useSpeech();
  const [listenedLetters, setListenedLetters] = useState<Set<string>>(new Set());

  // Load listened letters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sips-listened');
    if (saved) {
      try {
        setListenedLetters(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to parse listened letters', e);
      }
    }
  }, []);

  const markAsListened = useCallback((letter: string) => {
    setListenedLetters(prev => {
      const next = new Set(prev);
      next.add(letter);
      localStorage.setItem('sips-listened', JSON.stringify(Array.from(next)));
      return next;
    });
  }, []);

  const handlePlay = (letter: string, story: string) => {
    play(story, letter, () => {
      // On end
      markAsListened(letter);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32']
      });
    });
  };

  const handleSurprise = () => {
    const randomLetter = lettersData[Math.floor(Math.random() * lettersData.length)];
    
    // Scroll to the card
    const element = document.getElementById(`card-${randomLetter.letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Play immediately to preserve user gesture context
    handlePlay(randomLetter.letter, randomLetter.story);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-32">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-indigo-600 tracking-tight flex items-center gap-2">
              SIPs <span className="text-xl font-bold text-slate-400">ABCD</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">Tap a card to hear a story!</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-indigo-500 bg-indigo-50 px-4 py-2 rounded-full font-bold">
            <Volume2 className="w-5 h-5" />
            Turn on sound
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {lettersData.map((item) => (
            <div key={item.letter} id={`card-${item.letter}`}>
              <Card
                letter={item.letter}
                word={item.word}
                emoji={item.emoji}
                color={item.color}
                textColor={item.textColor}
                isActive={activeLetter === item.letter}
                isListened={listenedLetters.has(item.letter)}
                onPlay={() => handlePlay(item.letter, item.story)}
                onStop={stop}
              />
            </div>
          ))}
        </div>
      </main>

      <SurpriseButton onClick={handleSurprise} disabled={activeLetter !== null} />
    </div>
  );
}
