'use client';

import { useState, useEffect, useRef } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';

interface TerminalProps {
  initialMessage?: string;
  prompt?: string;
  onSendMessage: (message: string) => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string; id: string }>;
  isLoading?: boolean;
}

export default function Terminal({
  initialMessage = "Welcome to Alistair's Portfolio Terminal. Type 'help' to see available commands.",
  prompt = "visitor@portfolio:~$",
  onSendMessage,
  messages,
  isLoading = false,
}: TerminalProps) {
  const [input, setInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Typewriter effect for the initial message
  const { text: typedInitialMessage, isDone } = useTypewriter(initialMessage, {
    delay: 30,
    startDelay: 500,
  });

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [messages, typedInitialMessage]);

  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  // Focus the input when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className="w-full max-w-3xl mx-auto bg-black bg-opacity-85 text-green-400 rounded-md shadow-xl border border-green-500/30 overflow-hidden font-mono text-left"
      onClick={handleTerminalClick}
    >
      {/* Terminal header */}
      <div className="flex items-center px-4 py-2 bg-gray-900 border-b border-green-500/30">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-sm opacity-80">terminal@alistair-portfolio</div>
      </div>
      
      {/* Terminal content */}
      <div 
        ref={terminalRef}
        className="p-4 h-64 overflow-y-auto w-full"
        aria-live="polite"
      >
        {/* Initial welcome message with typewriter effect */}
        <p className="mb-2 whitespace-pre-line">{typedInitialMessage}</p>
        
        {/* Message history */}
        {messages.map((message, index) => (
          <div key={index} className="mb-2">
            {message.role === 'user' ? (
              <div>
                <span className="text-blue-400">{prompt} </span>
                <span>{message.content}</span>
              </div>
            ) : (
              <div className="whitespace-pre-line text-green-300">{message.content}</div>
            )}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center h-5">
            <span className="inline-block w-2 h-4 bg-green-400 animate-pulse mr-1"></span>
          </div>
        )}
        
        {/* Input form - only show if initial message has finished typing */}
        {isDone && (
          <form onSubmit={handleSubmit} className="flex items-center mt-2 w-full">
            <span className="text-blue-400 mr-2 whitespace-nowrap">{prompt}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-green-100 caret-green-400 w-full min-w-0"
              placeholder="Type a command..."
              disabled={isLoading}
              aria-label="Terminal input"
            />
          </form>
        )}
      </div>
    </div>
  );
}
