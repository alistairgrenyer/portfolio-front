'use client';

import { useProfile } from '@/hooks/useProfile';
import { SkillCategory } from '@/types/profile';

export default function SkillsSection() {
  const { profile, loading } = useProfile();
  
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
      {loading ? (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[...Array(8)].map((_, j) => (
                  <div key={j} className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : profile?.skills ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profile.skills.map((category: SkillCategory, index: number) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.items.map((skill: string, idx: number) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">No skills data available.</p>
      )}
    </div>
  );
}
