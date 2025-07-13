export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  userMessage: string;
  thread: Message[];
}

export interface ChatResponse {
  assistantMessage: string;
  navTarget?: string; // section id
}
