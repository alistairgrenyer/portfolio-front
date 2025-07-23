'use client';

import { useState, useCallback } from 'react';
import { Message, ChatRequest, ChatResponse, ConversationHistoryItem } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { getSectionIdFromQuery } from '@/utils/navigation';
import { getApiUrl } from '@/config/api';

interface UseChatOptions {
  initialMessages?: Message[];
  onNavigate?: (sectionId: string) => void;
}

export default function useChat({ initialMessages = [], onNavigate }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState<string>(() => uuidv4()); // Generate session ID once per hook instance
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Filter inappropriate content
  const filterMessage = (message: string): { isAllowed: boolean; message: string } => {
    // Simple frontend guardrail for inappropriate content
    const inappropriateTerms = [
      'inappropriate', 'offensive', 'slur', 'vulgar', 'explicit',
      // Add more terms as needed
    ];
    
    let lowerMessage = message.toLowerCase();
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
      
      // Convert messages to API conversation history format
      const conversationHistory: ConversationHistoryItem[] = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp).toISOString(),
      }));

      // Prepare request
      const request: ChatRequest = {
        message: userInput,
        conversation_history: conversationHistory,
        session_id: sessionId,
      };
      
      // Send to API
      const response = await fetch(getApiUrl('chat'), {
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
      
      // Update conversation ID if provided
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      
      // Handle blocked responses
      if (data.blocked) {
        const blockedResponse: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: data.reason || 'This message was blocked by content filters.',
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, blockedResponse]);
        return;
      }
      
      // Create bot response message with sources if available
      let responseContent = data.answer;
      if (data.sources && data.sources.length > 0) {
        responseContent += '\n\n**Sources:**\n' + 
          data.sources.map((source, index) => 
            `${index + 1}. [${source.title}](${source.url}) - ${source.snippet}`
          ).join('\n');
      }
      
      const botResponse: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
      };
      
      // Add bot response to the chat
      setMessages((prev) => [...prev, botResponse]);
      
      // Handle navigation based on content (since navTarget is removed from API)
      if (onNavigate) {
        const sectionId = getSectionIdFromQuery(data.answer);
        if (sectionId) {
          onNavigate(sectionId);
        }
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
    sessionId,
    conversationId,
  };
}
