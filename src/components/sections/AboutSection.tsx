'use client';

import { useProfile } from '@/hooks/useProfile';

export default function AboutSection() {
  const { profile, loading } = useProfile();
  
  return (
    <section id="about" className="py-20 bg-background dark:bg-background-dark">
      <div className="container-tight">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-10 text-center text-primary dark:text-primary-dark">About Me</h2>
        
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-surface dark:bg-surface-dark rounded-md w-full mb-3"></div>
              <div className="h-4 bg-surface dark:bg-surface-dark rounded-md w-full mb-3"></div>
              <div className="h-4 bg-surface dark:bg-surface-dark rounded-md w-5/6 mb-3"></div>
              <div className="h-4 bg-surface dark:bg-surface-dark rounded-md w-4/6"></div>
              <div className="h-8 mt-6 flex justify-center">
                <div className="h-6 bg-surface dark:bg-surface-dark rounded-md w-32"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="max-w-none">
                <p className="text-lg md:text-xl text-primary dark:text-primary-dark opacity-90 mb-6 leading-relaxed text-balance font-sans">
                  {profile?.basics.summary}
                </p>
                <p className="text-lg md:text-xl text-primary dark:text-primary-dark opacity-80 italic leading-relaxed text-balance font-sans">
                  {profile?.basics.personalNote}
                </p>
              </div>
              
              {profile?.basics.location && (
                <div className="mt-10 flex items-center justify-center">
                  <div className="text-primary dark:text-primary-dark opacity-80 flex items-center bg-surface dark:bg-surface-dark px-4 py-2 rounded-full shadow-sm">
                    <svg className="w-5 h-5 mr-2 text-accent dark:text-accent-dark" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="font-medium">{profile.basics.location}</span>
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
