'use client';

import { useState, FormEvent, KeyboardEvent, useRef, useEffect, forwardRef } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>((
  { onSendMessage, disabled = false },
  ref
) => {
  const [message, setMessage] = useState('');
  const internalRef = useRef<HTMLTextAreaElement>(null);
  
  // Use internal ref if external ref is not provided
  // This ensures we always have a valid ref to work with
  
  // Adjust textarea height based on content
  useEffect(() => {
    // Use the DOM reference directly rather than through ref.current
    const textarea = internalRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      
      // Reset textarea height
      const textarea = internalRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
      }
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter without Shift key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="border-t border-[var(--color-border)] p-4">
      <div className="flex items-end space-x-2">
        <div className="relative flex-1">
          <textarea
            ref={(node) => {
              // Handle both the internal ref and the forwarded ref
              internalRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] text-[var(--color-primary)] max-h-[120px] min-h-[42px]"
            rows={1}
            disabled={disabled}
            aria-label="Chat message"
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className={`absolute bottom-2 right-2 p-1 rounded-full ${
              !message.trim() || disabled
                ? 'text-[var(--color-primary)] opacity-30 cursor-not-allowed'
                : 'text-[var(--color-accent)] hover:bg-[var(--color-surface)] hover:bg-opacity-50'
            } transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]`}
            aria-label="Send message"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h2a1 1 0 00.894-.553l7-14a1 1 0 00-1.788 0l-7 14a1 1 0 01-.894.553h-2v4.571a1 1 0 01-1.206.978l-5-1.429a1 1 0 01-.575-1.63l7-14z"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="mt-2 text-xs text-[var(--color-primary)] opacity-60 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
});

export default ChatInput;
