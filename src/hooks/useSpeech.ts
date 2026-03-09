import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Chrome bug fix: speech synthesis silently stops after ~15s
  // Keep it alive by calling resume() periodically while speaking
  const startKeepAlive = useCallback(() => {
    if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    keepAliveRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      } else {
        if (keepAliveRef.current) clearInterval(keepAliveRef.current);
      }
    }, 10000);
  }, []);

  const stopKeepAlive = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    stopKeepAlive();
    setIsPlaying(false);
    setActiveLetter(null);
    utteranceRef.current = null;
  }, [stopKeepAlive]);

  const play = useCallback((text: string, letter: string, onEnd?: () => void) => {
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    stopKeepAlive();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';

    // Store in ref to prevent garbage collection before onend fires (Chrome bug)
    utteranceRef.current = utterance;

    // Use cached voices — avoids getVoices() returning [] on first call
    const voices = voicesRef.current.length > 0
      ? voicesRef.current
      : window.speechSynthesis.getVoices();

    if (voices.length > 0) {
      const preferredVoice =
        voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) ||
        voices.find(v => v.lang.startsWith('en-US')) ||
        voices.find(v => v.lang.startsWith('en'));
      if (preferredVoice) utterance.voice = preferredVoice;
    }

    // Kid-friendly settings
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsPlaying(true);
      setActiveLetter(letter);
      startKeepAlive();
    };

    utterance.onend = () => {
      stopKeepAlive();
      setIsPlaying(false);
      setActiveLetter(null);
      if (onEnd) onEnd();
      utteranceRef.current = null;
    };

    utterance.onerror = (e: any) => {
      stopKeepAlive();
      if (e.error === 'canceled' || e.error === 'interrupted') return;
      console.error('Speech synthesis error:', e.error || e);
      setIsPlaying(false);
      setActiveLetter(null);
      utteranceRef.current = null;
    };

    // Chrome bug fix: ensure synthesis is not paused before speaking
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    window.speechSynthesis.speak(utterance);
  }, [startKeepAlive, stopKeepAlive]);

  // Load and cache voices; handle async voice loading in Chrome
  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) voicesRef.current = v;
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      window.speechSynthesis.cancel();
      stopKeepAlive();
    };
  }, [stopKeepAlive]);

  return { play, stop, isPlaying, activeLetter };
}
