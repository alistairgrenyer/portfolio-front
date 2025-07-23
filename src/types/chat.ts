export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

// API conversation history item (matches API schema)
export interface ConversationHistoryItem {
  role: string;
  content: string;
  timestamp: string;
}

// API source item
export interface Source {
  title: string;
  snippet: string;
  page: number;
  url: string;
}

// API request schema
export interface ChatRequest {
  message: string;
  conversation_history: ConversationHistoryItem[];
  session_id: string;
}

// API response schema
export interface ChatResponse {
  answer: string;
  sources: Source[];
  blocked: boolean;
  reason: string;
  conversation_id: string;
}
