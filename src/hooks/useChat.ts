'use client';

import { useState, useCallback } from 'react';
import { Message, ChatRequest, ChatResponse } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

interface UseChatOptions {
  initialMessages?: Message[];
  onNavigate?: (sectionId: string) => void;
}

export default function useChat({ initialMessages = [], onNavigate }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter inappropriate content
  const filterMessage = (message: string): { isAllowed: boolean; message: string } => {
    // Simple frontend guardrail for inappropriate content
    const inappropriateTerms = [
      'inappropriate', 'offensive', 'slur', 'vulgar', 'explicit',
      // Add more terms as needed
    ];
    
    const lowerMessage = message.toLowerCase();
    const containsInappropriate = inappropriateTerms.some(term => 
      lowerMessage.includes(term)
    );
    
    if (containsInappropriate) {
      return { 
        isAllowed: false, 
        message: "I can't respond to that type of message. Let's keep the conversation professional." 
      };
    }
    
    return { isAllowed: true, message };
  };
  
  const sendMessage = useCallback(async (userInput: string) => {
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
    setError(null);
    
    try {
      // Check for inappropriate content
      const { isAllowed, message } = filterMessage(userInput);
      
      if (!isAllowed) {
        const botResponse: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: message,
          timestamp: Date.now(),
        };
        
        setMessages((prev) => [...prev, botResponse]);
        setIsLoading(false);
        return;
      }
      
      // Prepare request
      const request: ChatRequest = {
        userMessage: userInput,
        thread: messages.concat(userMessage),
      };
      
      // Send to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }
      
      const data: ChatResponse = await response.json();
      
      // Create bot response message
      const botResponse: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.assistantMessage,
        timestamp: Date.now(),
      };
      
      // Add bot response to the chat
      setMessages((prev) => [...prev, botResponse]);
      
      // Handle navigation if specified
      if (data.navTarget && onNavigate) {
        onNavigate(data.navTarget);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, onNavigate]);
  
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);
  
  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
