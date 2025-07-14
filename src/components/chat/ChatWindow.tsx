'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import QuickReplyChips from './QuickReplyChips';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

export default function ChatWindow({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
}: ChatWindowProps) {
  const [quickReplies, setQuickReplies] = useState<string[]>([
    'See projects',
    'Skills summary',
    'Contact info'
  ]);
  
  // Show/hide window with animation
  const [isVisible, setIsVisible] = useState(false);
  
  // Refs for focus management
  const windowRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Animation and focus management
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      // Set focus to the input field when dialog opens
      // Small delay to ensure the component is rendered
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Matches transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  // Handle escape key to close the dialog
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);
  
  // Focus trap inside the chat dialog
  useEffect(() => {
    if (!isOpen || !windowRef.current) return;
    
    const focusableElements = windowRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      // If shift + tab and focus is on first element, move to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // If tab and focus is on last element, move to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    windowRef.current.addEventListener('keydown', handleTabKey);
    return () => windowRef.current?.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);
  
  if (!isOpen && !isVisible) return null;
  
  return (
    <div 
      ref={windowRef}
      className={`fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col transition-all duration-300 z-40 ${
        isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10 pointer-events-none'
      }`}
      role="dialog"
      aria-labelledby="chat-title"
      aria-modal="true"
      aria-live="polite"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 id="chat-title" className="text-lg font-semibold text-gray-900 dark:text-white">
          Alistair&apos;s Assistant
        </h2>
        <button 
          ref={closeButtonRef}
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="sr-only">Close chat dialog</span>
        </button>
      </div>
      
      {/* Messages */}
      <MessageList messages={messages} loading={isLoading} />
      
      {/* Quick Reply Chips */}
      {messages.length > 0 && !isLoading && (
        <QuickReplyChips 
          suggestions={quickReplies}
          onSelectSuggestion={onSendMessage}
        />
      )}
      
      {/* Input */}
      <ChatInput 
        ref={inputRef}
        onSendMessage={onSendMessage} 
        disabled={isLoading} 
      />
    </div>
  );
}
