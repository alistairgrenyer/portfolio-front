'use client';

import { useState, useCallback } from 'react';
import ChatLauncher from './ChatLauncher';
import ChatWindow from './ChatWindow';
import { useSharedChat } from '@/context/ChatContext';
import { scrollToSection } from '@/utils/navigation';

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle navigation from chat responses
  const handleNavigate = useCallback((sectionId: string) => {
    scrollToSection(sectionId, { offset: 80 }); // Account for fixed header
  }, []);
  
  // Use shared chat context
  const { messages, isLoading, sendMessage } = useSharedChat();
  
  // Toggle chat window
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);
  
  return (
    <>
      <ChatLauncher isOpen={isOpen} onClick={toggleChat} />
      
      <ChatWindow
        isOpen={isOpen}
        onClose={toggleChat}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    </>
  );
}
