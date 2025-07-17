'use client';

import { useProfile } from '@/hooks/useProfile';
import NeovisGraph from '@/components/graph/NeovisGraph';

export default function SkillsSection() {
  const { loading } = useProfile();
  
  return (
    <section id="skills" data-aos="fade-up" className="py-20 bg-background dark:bg-background-dark">
      <div className="container-tight">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-10 text-center text-primary dark:text-primary-dark">Skills & Expertise</h2>
        
        {loading ? (
          <div className="animate-pulse bg-surface dark:bg-surface-dark p-6 rounded-xl shadow-md border border-surface dark:border-surface-dark h-[500px]">
            <div className="h-full w-full flex items-center justify-center">
              <div className="h-10 w-10 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="bg-surface dark:bg-surface-dark p-6 md:p-8 rounded-xl shadow-md border border-surface dark:border-surface-dark hover:shadow-lg transition-shadow duration-300">
            <NeovisGraph />
          </div>
        )}
      </div>
    </section>
  );
}