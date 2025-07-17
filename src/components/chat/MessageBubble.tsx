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
        className={`max-w-[80%] rounded-[var(--radius-lg)] px-4 py-2 ${
          message.role === 'user'
            ? 'bg-[var(--color-accent)] text-[var(--color-bg)] rounded-tr-none'
            : 'bg-[var(--color-surface-muted)] text-[var(--color-primary)] rounded-tl-none'
        }`}
      >
        <div className="flex flex-col">
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          <div
            className={`text-xs mt-1 ${
              message.role === 'user' ? 'text-[var(--color-bg)] opacity-80' : 'text-[var(--color-primary)] opacity-60'
            } text-right`}
          >
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
}
