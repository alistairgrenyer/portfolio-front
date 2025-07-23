import { NextResponse } from 'next/server';
import { ChatRequest, ChatResponse } from '@/types/chat';
import { apiRequest } from '@/config/api';

export async function POST(request: Request) {
  try {
    const body: ChatRequest = await request.json();
    
    // Forward the request to the LLM backend
    const response = await apiRequest<ChatResponse>('chat', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error forwarding chat request to LLM backend:', error);
    
    // Return a fallback response in case of LLM backend failure
    const fallbackResponse: ChatResponse = {
      answer: "I'm sorry, I'm currently experiencing technical difficulties. Please try again in a moment.",
      sources: [],
      blocked: false,
      reason: '',
      conversation_id: ''
    };
    
    return NextResponse.json(fallbackResponse, { status: 200 });
  }
}
