'use client';

import { useProfile } from '@/hooks/useProfile';
import useChat from '@/hooks/useChat';
import Terminal from '@/components/terminal/Terminal';

export default function HomeSection() {
  const { profile, loading } = useProfile();
  
  // Use the proper chat hook instead of local state
  const { messages, isLoading, sendMessage } = useChat();
  
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
                onSendMessage={sendMessage}
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
