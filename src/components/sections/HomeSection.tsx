'use client';

import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import Terminal from '@/components/terminal/Terminal';
import { Message } from '@/types/chat';

export default function HomeSection() {
  const { profile, loading } = useProfile();
  
  // Terminal state
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-background dark:bg-background-dark py-12">
      <div className="container-wide py-16 text-center">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-14 bg-surface dark:bg-surface-dark rounded-lg w-3/4 max-w-2xl mx-auto"></div>
            <div className="h-8 bg-surface dark:bg-surface-dark rounded-lg w-2/4 max-w-xl mx-auto"></div>
            <div className="h-4 bg-surface dark:bg-surface-dark rounded w-5/6 max-w-3xl mx-auto"></div>
            <div className="h-4 bg-surface dark:bg-surface-dark rounded w-4/6 max-w-2xl mx-auto"></div>
            <div className="pt-8">
              <div className="h-10 bg-surface dark:bg-surface-dark rounded-md w-32 mx-auto inline-block mr-3"></div>
              <div className="h-10 bg-surface dark:bg-surface-dark rounded-md w-32 mx-auto inline-block ml-3"></div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-semibold mb-6 text-primary dark:text-primary-dark text-balance">
              {profile?.basics.name}
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-8 text-accent dark:text-accent-dark text-balance">
              {profile?.basics.title}
            </h2>
            
            {/* Terminal UI replaces the tagline */}
            <div className="w-full mx-auto mb-12 text-left" style={{ maxWidth: '100%' }}>
              <Terminal
                initialMessage={`Welcome to ${profile?.basics.name}'s Portfolio Terminal\nType 'help' to see available commands or ask me anything about ${profile?.basics.name}...`}
                prompt="visitor@portfolio:~$"
                onSendMessage={(message) => {
                  // Add user message
                  const userMessage = {
                    id: Date.now().toString(),
                    role: 'user' as const,
                    content: message,
                    timestamp: Date.now()
                  };
                  
                  setMessages(prev => [...prev, userMessage]);
                  setIsLoading(true);
                  
                  // Simulate response after a short delay
                  setTimeout(() => {
                    let response = "I'm a simulated response. Currently, I'm not connected to an LLM backend.";
                    
                    // Simple response logic
                    if (message.toLowerCase().includes('help')) {
                      response = "Available commands:\n- about: Learn about Alistair\n- skills: See Alistair's technical skills\n- projects: View portfolio projects\n- contact: Get contact information\n- clear: Clear the terminal";
                    } else if (message.toLowerCase().includes('about')) {
                      response = `${profile?.basics.name} is ${profile?.basics.title} with a passion for building great software.`;
                    } else if (message.toLowerCase().includes('skills')) {
                      response = "Skills include: React, TypeScript, Next.js, and more.";
                    } else if (message.toLowerCase().includes('projects')) {
                      response = "Check out the Projects section below to see my work!";
                    } else if (message.toLowerCase().includes('contact')) {
                      response = "You can reach me through the Contact section at the bottom of this page.";
                    } else if (message.toLowerCase().includes('clear')) {
                      setMessages([]);
                      setIsLoading(false);
                      return;
                    }
                    
                    // Add assistant response
                    const assistantMessage = {
                      id: (Date.now() + 1).toString(),
                      role: 'assistant' as const,
                      content: response,
                      timestamp: Date.now()
                    };
                    
                    setMessages(prev => [...prev, assistantMessage]);
                    setIsLoading(false);
                  }, 1000);
                }}
                messages={messages}
                isLoading={isLoading}
              />
            </div>
            
            {/* Quick Nav Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a 
                href="#projects" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); 
                }}
                className="px-6 py-3 bg-transparent border-2 border-accent dark:border-accent-dark text-accent dark:text-accent-dark text-lg font-medium rounded-lg hover:bg-surface dark:hover:bg-surface-dark shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark focus:ring-offset-2 dark:focus:ring-offset-background-dark"
              >
                View Projects
              </a>
              <a 
                href="#contact" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); 
                }}
                className="px-6 py-3 bg-transparent border-2 border-accent dark:border-accent-dark text-accent dark:text-accent-dark text-lg font-medium rounded-lg hover:bg-surface dark:hover:bg-surface-dark shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark focus:ring-offset-2 dark:focus:ring-offset-background-dark"
              >
                Contact Me
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
