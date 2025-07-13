'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

export default function MessageList({ messages, loading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4"
      aria-live="polite"
      aria-atomic="false"
      aria-relevant="additions"
    >
      {messages.length === 0 && (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Welcome! Ask me anything about Alistair's work, projects, or skills.
          </p>
        </div>
      )}
      
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {loading && (
        <div className="flex justify-start mb-3">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
            <div className="flex space-x-2 items-center">
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '250ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '500ms' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
