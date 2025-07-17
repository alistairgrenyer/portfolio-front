'use client';

import { useEffect } from 'react';

interface ChatLauncherProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ChatLauncher({ isOpen, onClick }: ChatLauncherProps) {
  // Handle keyboard shortcut (Alt+C) to toggle chat
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'KeyC') {
        e.preventDefault();
        onClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClick]);

  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-[var(--radius-full)] bg-[var(--color-accent)] hover:bg-opacity-80 text-[var(--color-bg)] flex items-center justify-center shadow-card-lg transition-all duration-300 z-40 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 ${
        isOpen ? 'rotate-90' : 'rotate-0'
      }`}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      title={isOpen ? "Close chat (Alt+C)" : "Open chat (Alt+C)"}
    >
      <span className="sr-only">{isOpen ? "Close chat" : "Open chat assistant"}</span>
      {isOpen ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )}
    </button>
  );
}
