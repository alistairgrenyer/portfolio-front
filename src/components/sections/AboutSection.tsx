'use client';

import { useProfile } from '@/hooks/useProfile';

export default function AboutSection() {
  const { profile, loading } = useProfile();
  
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">About Me</h2> */}
        
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            </div>
          ) : (
            <>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  {profile?.basics.summary}
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 italic">
                  {profile?.basics.personalNote}
                </p>
              </div>
              
              {profile?.basics.location && (
                <div className="mt-8 flex items-center justify-center">
                  <div className="text-gray-600 dark:text-gray-400 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <span>{profile.basics.location}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
