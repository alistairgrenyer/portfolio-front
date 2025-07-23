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
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none'
        }`}
      >
        <div className="flex flex-col">
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          <div
            className={`text-xs mt-1 ${
              message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            } text-right`}
          >
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
}
