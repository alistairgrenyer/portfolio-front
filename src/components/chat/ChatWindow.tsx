'use client';

import { useState, useEffect, useRef, useCallback, MutableRefObject, MouseEvent } from 'react';
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
  
  // State for resizable window
  const [size, setSize] = useState({ width: 384, height: 600 }); // Default size (w-96 = 384px)
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<'left' | 'top' | 'corner' | null>(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  
  // Refs to store the latest values for event handlers
  const isResizingRef = useRef(isResizing);
  const resizeTypeRef = useRef(resizeType);
  const startPositionRef = useRef(startPosition);
  const startSizeRef = useRef(startSize);
  const sizeRef = useRef(size);
  
  // Update refs when state changes
  useEffect(() => {
    isResizingRef.current = isResizing;
    resizeTypeRef.current = resizeType;
    startPositionRef.current = startPosition;
    startSizeRef.current = startSize;
    sizeRef.current = size;
  }, [isResizing, resizeType, startPosition, startSize, size]);
  
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
  
  // Define resize move handler
  const handleResizeMove = useCallback((e: globalThis.MouseEvent) => {
    if (!isResizingRef.current) return;
    
    // Request animation frame for smoother resizing
    requestAnimationFrame(() => {
      const deltaX = e.clientX - startPositionRef.current.x;
      const deltaY = e.clientY - startPositionRef.current.y;
      
      // Calculate new size based on resize type
      let newWidth = sizeRef.current.width;
      let newHeight = sizeRef.current.height;
      
      if (resizeTypeRef.current === 'left' || resizeTypeRef.current === 'corner') {
        newWidth = Math.max(280, startSizeRef.current.width - deltaX); // Minimum width: 280px
      }
      
      if (resizeTypeRef.current === 'top' || resizeTypeRef.current === 'corner') {
        newHeight = Math.max(400, startSizeRef.current.height - deltaY); // Minimum height: 400px
      }
      
      setSize({ width: newWidth, height: newHeight });
    });
  }, []);
  
  // Define resize end handler
  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeType(null);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleResizeMove as unknown as EventListener);
    document.removeEventListener('mouseup', handleResizeEnd as unknown as EventListener);
    document.body.style.cursor = '';
  }, []);
  
  // Handle resize start
  const handleResizeStart = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get resize type from data attribute
    const type = (e.currentTarget.dataset.resizeType || 'corner') as 'left' | 'top' | 'corner';
    
    setIsResizing(true);
    setResizeType(type);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setStartSize({ width: sizeRef.current.width, height: sizeRef.current.height });
    
    // Add cursor styles to body during resize
    if (type === 'left') document.body.style.cursor = 'ew-resize';
    if (type === 'top') document.body.style.cursor = 'ns-resize';
    if (type === 'corner') document.body.style.cursor = 'nwse-resize';
    
    // Add event listeners for resize
    document.addEventListener('mousemove', handleResizeMove as unknown as EventListener);
    document.addEventListener('mouseup', handleResizeEnd as unknown as EventListener);
  }, [handleResizeMove, handleResizeEnd]);
  
  // Cleanup event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove as unknown as EventListener);
      document.removeEventListener('mouseup', handleResizeEnd as unknown as EventListener);
      document.body.style.cursor = '';
    };
  }, [handleResizeMove, handleResizeEnd]);
  
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
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        maxHeight: '85vh'
      }}
      className={`fixed bottom-24 right-6 bg-[var(--color-surface)] rounded-[var(--radius-card)] shadow-card-lg flex flex-col transition-all duration-300 z-40 ${isResizing ? 'select-none' : ''} ${
        isOpen ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10 pointer-events-none'
      }`}
      role="dialog"
      aria-labelledby="chat-title"
      aria-modal="true"
      aria-live="polite"
    >
      {/* Resize handles */}
      <div 
        className="absolute top-0 left-0 w-6 h-6 cursor-nwse-resize z-50 group"
        onMouseDown={handleResizeStart}
        data-resize-type="corner"
        aria-label="Resize chat window"
        role="button"
        tabIndex={0}
      >
        <div className="absolute bottom-1 right-1 w-3 h-3 border-l border-t border-[var(--color-accent)] opacity-0 group-hover:opacity-70 transition-opacity" />
      </div>
      <div 
        className="absolute top-0 left-8 right-8 h-3 cursor-ns-resize z-50 group hover:bg-[var(--color-highlight)]"
        onMouseDown={handleResizeStart}
        data-resize-type="top"
        aria-label="Resize chat window height"
        role="button"
        tabIndex={0}
      >
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[var(--color-accent)] rounded-full opacity-0 group-hover:opacity-70 transition-opacity" />
      </div>
      <div 
        className="absolute top-8 left-0 bottom-8 w-3 cursor-ew-resize z-50 group hover:bg-[var(--color-highlight)]"
        onMouseDown={handleResizeStart}
        data-resize-type="left"
        aria-label="Resize chat window width"
        role="button"
        tabIndex={0}
      >
        <div className="absolute left-1 top-1/2 transform -translate-y-1/2 h-8 w-1 bg-[var(--color-accent)] rounded-full opacity-0 group-hover:opacity-70 transition-opacity" />
      </div>
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center">
        <h2 id="chat-title" className="text-lg font-semibold text-[var(--color-primary)]">
          Alistair's Assistant
        </h2>
        <button 
          ref={closeButtonRef}
          onClick={onClose}
          className="text-[var(--color-primary)] opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] rounded-[var(--radius-sm)] p-1"
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
