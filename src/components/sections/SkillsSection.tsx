'use client';

import { useProfile } from '@/hooks/useProfile';
import { SkillCategory } from '@/types/profile';

export default function SkillsSection() {
  const { profile, loading } = useProfile();
  
  return (
    <section id="skills" data-aos="fade-up" className="py-20 bg-background dark:bg-background-dark">
      <div className="container-tight">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-10 text-center text-primary dark:text-primary-dark">Skills & Expertise</h2>
        
        {loading ? (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface dark:bg-surface-dark p-6 rounded-xl shadow-md border border-surface dark:border-surface-dark">
                <div className="h-7 bg-surface dark:bg-surface-dark rounded-lg w-1/3 mb-6"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(8)].map((_, j) => (
                    <div key={j} className="h-8 bg-surface dark:bg-surface-dark rounded-full w-20 my-1"></div>
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
                className="bg-surface dark:bg-surface-dark p-6 md:p-8 rounded-xl shadow-md border border-surface dark:border-surface-dark hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-heading font-semibold mb-6 text-primary dark:text-primary-dark border-b border-surface dark:border-surface-dark pb-2">
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill: string, idx: number) => (
                    <span 
                      key={idx}
                      className="px-4 py-2 bg-background dark:bg-background-dark text-primary dark:text-primary-dark rounded-full text-sm font-body font-medium shadow-sm hover:shadow hover:bg-accent hover:bg-opacity-10 dark:hover:bg-accent-dark dark:hover:bg-opacity-10 transition-all duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-primary dark:text-primary-dark opacity-70 bg-surface dark:bg-surface-dark p-8 rounded-xl shadow-md">
            No skills data available.
          </p>
        )}
      </div>
    </section>
  );
}
