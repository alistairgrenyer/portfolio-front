'use client';

import { useProfile } from '@/hooks/useProfile';

export default function HomeSection() {
  const { profile, loading } = useProfile();
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 text-center">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-6"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/4 mx-auto mb-10"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mx-auto mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mx-auto"></div>
          </div>
        ) : (
          <>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
              {profile?.basics.name}
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium mb-8 text-blue-600 dark:text-blue-400">
              {profile?.basics.title}
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 text-gray-600 dark:text-gray-300">
              {profile?.basics.tagline}
            </p>
            
            {/* Quick Nav Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="#projects" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); 
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                View Projects
              </a>
              <a 
                href="#contact" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); 
                }}
                className="px-6 py-3 bg-transparent border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
