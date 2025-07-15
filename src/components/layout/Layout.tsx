'use client';

import { ReactNode, useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize theme based on user preference
  useEffect(() => {
    // Check local storage first
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    
    // If no saved preference, check system preference
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    } else {
      setTheme(savedTheme);
    }
  }, []);
  
  // Apply theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    
    // Save preference to local storage
    localStorage.setItem('theme', theme);
    
    // Force Tailwind to recognize the theme change
    document.body.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);
  
  // Toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Header />
      
      <main className="flex-grow pt-16 container-tight">
        {children}
      </main>
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <span className="sr-only">{theme === 'light' ? 'Enable dark mode' : 'Enable light mode'}</span>
        {theme === 'light' ? (
          <svg className="w-5 h-5 text-gray-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"></path>
          </svg>
        )}
      </button>
      
      <Footer />
    </div>
  );
}
