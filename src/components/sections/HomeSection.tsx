'use client';

import { useProfile } from '@/hooks/useProfile';

export default function HomeSection() {
  const { profile, loading } = useProfile();
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-12">
      <div className="container-wide py-16 text-center">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 max-w-2xl mx-auto"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/4 max-w-xl mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 max-w-3xl mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 max-w-2xl mx-auto"></div>
            <div className="pt-8">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-32 mx-auto inline-block mr-3"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-32 mx-auto inline-block ml-3"></div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white text-balance">
              {profile?.basics.name}
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium mb-8 text-blue-600 dark:text-blue-400 text-balance">
              {profile?.basics.title}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 text-gray-700 dark:text-gray-300 text-balance leading-relaxed">
              {profile?.basics.tagline}
            </p>
            
            {/* Quick Nav Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a 
                href="#projects" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); 
                }}
                className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                View Projects
              </a>
              <a 
                href="#contact" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); 
                }}
                className="px-6 py-3 bg-transparent border-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 text-lg font-medium rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
