'use client';

import { useState, useEffect } from 'react';

interface TypewriterOptions {
  delay?: number;
  startDelay?: number;
}

export function useTypewriter(
  text: string, 
  options: TypewriterOptions = {}
) {
  const { delay = 50, startDelay = 0 } = options;
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Reset state when text changes
    setDisplayText('');
    setCurrentIndex(0);
    setIsDone(false);
    
    // Initial delay before starting to type
    const startTimeout = setTimeout(() => {
      // Don't start if text is empty
      if (!text) {
        setIsDone(true);
        return;
      }
      
      // Start typing effect
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          
          if (nextIndex > text.length) {
            clearInterval(interval);
            setIsDone(true);
            return prevIndex;
          }
          
          setDisplayText(text.slice(0, nextIndex));
          return nextIndex;
        });
      }, delay);
      
      return () => clearInterval(interval);
    }, startDelay);
    
    return () => clearTimeout(startTimeout);
  }, [text, delay, startDelay]);

  return {
    text: displayText,
    isDone,
    progress: text ? currentIndex / text.length : 1,
  };
}
