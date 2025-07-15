'use client';

import { Message } from '@/types/chat';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  // Format timestamp
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } mb-3`}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          message.role === 'user'
            ? 'bg-accent dark:bg-accent-dark text-background dark:text-background-dark rounded-tr-none'
            : 'bg-surface dark:bg-surface-dark text-primary dark:text-primary-dark rounded-tl-none'
        }`}
      >
        <div className="flex flex-col">
          <div className="whitespace-pre-wrap break-words font-body">{message.content}</div>
          <div
            className={`text-xs mt-1 ${
              message.role === 'user' ? 'text-background dark:text-background-dark opacity-80' : 'text-primary dark:text-primary-dark opacity-60'
            } text-right font-body`}
          >
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
}
