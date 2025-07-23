'use client';

import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, loading } = useProfile();
  
  // Handle scroll event to change header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo/Name */}
        <div>
          <a 
            href="#home" 
            className="text-xl font-bold text-gray-900 dark:text-white"
            onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}
          >
            {loading ? 'Portfolio' : profile?.basics.name || 'Portfolio'}
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {['home', 'about', 'projects', 'skills', 'experience', 'education', 'contact'].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white capitalize transition-colors"
              onClick={(e) => { e.preventDefault(); scrollToSection(item); }}
            >
              {item}
            </a>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {['home', 'about', 'projects', 'skills', 'experience', 'education', 'contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white capitalize transition-colors"
                  onClick={(e) => { e.preventDefault(); scrollToSection(item); }}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
