'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string, isTerminal?: boolean) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  initialMessages?: Message[];
}

export function ChatProvider({ children, initialMessages = [] }: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  // Send a message and get a response
  const sendMessage = useCallback((userInput: string, isTerminal = false) => {
    // Don't send empty messages
    if (!userInput.trim()) return;
    
    // Create a new user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };
    
    // Add user message to the chat
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    // Handle terminal-specific commands
    if (isTerminal && userInput.toLowerCase() === 'clear') {
      setMessages([]);
      setIsLoading(false);
      return;
    }
    
    // Simulate response after a short delay
    setTimeout(() => {
      let response = "I'm a simulated response. Currently, I'm not connected to an LLM backend.";
      
      // Simple response logic - only process commands in terminal mode
      if (isTerminal) {
        if (userInput.toLowerCase().includes('help')) {
          response = "Available commands:\n- about: Learn about Alistair\n- skills: See Alistair's technical skills\n- projects: View portfolio projects\n- contact: Get contact information\n- clear: Clear the terminal";
        } else if (userInput.toLowerCase().includes('about')) {
          response = "Alistair is a Software Engineer with a passion for building great software.";
        } else if (userInput.toLowerCase().includes('skills')) {
          response = "Skills include: React, TypeScript, Next.js, and more.";
        } else if (userInput.toLowerCase().includes('projects')) {
          response = "Check out the Projects section below to see my work!";
        } else if (userInput.toLowerCase().includes('contact')) {
          response = "You can reach me through the Contact section at the bottom of this page.";
        }
      } else {
        // Regular chatbot responses (more conversational)
        if (userInput.toLowerCase().includes('help')) {
          response = "How can I help you today? I can tell you about Alistair's skills, projects, or experience.";
        } else if (userInput.toLowerCase().includes('about')) {
          response = "Alistair is a Software Engineer specializing in modern web technologies and AI integration.";
        } else if (userInput.toLowerCase().includes('skills')) {
          response = "Alistair's skills include React, TypeScript, Next.js, Node.js, and various other frontend and backend technologies.";
        } else if (userInput.toLowerCase().includes('projects')) {
          response = "Alistair has worked on various projects including web applications, AI integrations, and more. You can see them in the Projects section.";
        } else if (userInput.toLowerCase().includes('contact')) {
          response = "You can contact Alistair through the form in the Contact section, or via the social links provided.";
        }
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  const value = {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  };
  
  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useSharedChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useSharedChat must be used within a ChatProvider');
  }
  return context;
}
