import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setActiveLetter(null);
    utteranceRef.current = null;
  }, []);

  const play = useCallback((text: string, letter: string, onEnd?: () => void) => {
    // Only cancel if currently speaking to avoid interrupting the new utterance setup
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Explicitly set language
    
    // Store in ref to prevent garbage collection before onend fires (Chrome bug)
    utteranceRef.current = utterance;
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const preferredVoice = voices.find(v => 
        v.name.includes('Google') && v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    // Kid-friendly settings
    utterance.rate = 0.85; // Slightly slower
    utterance.pitch = 1.2; // Slightly higher/friendlier
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setActiveLetter(letter);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setActiveLetter(null);
      if (onEnd) onEnd();
      utteranceRef.current = null;
    };

    utterance.onerror = (e: any) => {
      // Ignore errors that are just from canceling the previous speech
      if (e.error === 'canceled' || e.error === 'interrupted') {
        return;
      }
      console.error('Speech synthesis error:', e.error || e);
      setIsPlaying(false);
      setActiveLetter(null);
      utteranceRef.current = null;
    };

    // Resume if the speech synthesis was paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Speak immediately within the same synchronous execution block as the user click
    window.speechSynthesis.speak(utterance);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    // Warm up voices
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { play, stop, isPlaying, activeLetter };
}
