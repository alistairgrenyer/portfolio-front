'use client';

import { useProfile } from '@/hooks/useProfile';
import { SkillCategory } from '@/types/profile';

export default function SkillsSection() {
  const { profile, loading } = useProfile();
  
  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-900">
      <div className="container-tight">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-gray-900 dark:text-white">Skills & Expertise</h2>
        
        {loading ? (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-6"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(8)].map((_, j) => (
                    <div key={j} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20 my-1"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : profile?.skills ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {profile.skills.map((category: SkillCategory, index: number) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill: string, idx: number) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium shadow-sm hover:shadow hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md">
            No skills data available.
          </p>
        )}
      </div>
    </section>
  );
}
