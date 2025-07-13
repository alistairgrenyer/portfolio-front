'use client';

import { useProfile } from '@/hooks/useProfile';

export default function ExperienceSection() {
  const { profile, loading } = useProfile();
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (dateString === 'Present') return 'Present';
    
    try {
      const [year, month] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };
  
  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Experience</h2>
        
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="animate-pulse space-y-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex">
                  <div className="mr-4 w-24">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : profile?.experience ? (
            <div className="space-y-12">
              {profile.experience.map((exp, index) => (
                <div key={index} className="relative pl-8 md:pl-0">
                  {/* Timeline dot and line */}
                  <div className="hidden md:block absolute top-0 left-1/2 w-px h-full bg-gray-300 dark:bg-gray-700 -translate-x-1/2 z-0"></div>
                  <div className={`hidden md:flex absolute top-0 left-1/2 w-5 h-5 rounded-full bg-blue-600 -translate-x-1/2 z-10 items-center justify-center ${index === 0 ? 'ring-4 ring-blue-100 dark:ring-blue-900' : ''}`}></div>
                  
                  {/* Mobile dot and line */}
                  <div className="md:hidden absolute top-0 left-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700 z-0"></div>
                  <div className={`md:hidden absolute top-0 left-0 w-5 h-5 rounded-full bg-blue-600 -translate-x-1/2 z-10 ${index === 0 ? 'ring-4 ring-blue-100 dark:ring-blue-900' : ''}`}></div>
                  
                  <div className={`md:flex ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Date */}
                    <div className="md:w-5/12 mb-4 md:mb-0 md:px-6 text-sm font-medium text-gray-500 dark:text-gray-400">
                      <div className={`md:text-right ${index % 2 !== 0 ? 'md:text-left' : ''}`}>
                        <span>{formatDate(exp.startDate)}</span>
                        <span className="mx-2">—</span>
                        <span>{formatDate(exp.endDate)}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className={`md:w-5/12 md:px-6 ${index % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">{exp.position}</h3>
                      <p className="text-md font-medium mb-3 text-blue-600 dark:text-blue-400">
                        {exp.company}{exp.location ? ` — ${exp.location}` : ''}
                      </p>
                      
                      <ul className={`list-disc text-gray-600 dark:text-gray-300 ${index % 2 !== 0 ? 'ml-5' : 'md:ml-0 ml-5 md:list-none'}`}>
                        {exp.highlights.map((highlight, i) => (
                          <li key={i} className={`mb-1 ${index % 2 === 0 ? 'md:text-right' : ''}`}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400">No experience data available.</p>
          )}
        </div>
      </div>
    </section>
  );
}
