'use client';

import { useState } from 'react';
import { useSkillsGraph } from '@/hooks/useSkillsGraph';
import SkillsGraph from '@/components/skills/SkillsGraph';
import SkillsSearch from '@/components/skills/SkillsSearch';

// Using a hardcoded URL for now - could be parameterized or fetched from config
const GRAPH_DATA_URL = '/graph.json';

export default function SkillsSection() {
  const {
    graphData,
    loading,
    error,
    collapsedCategories,
    toggleCategory,
    filterNodes
  } = useSkillsGraph(GRAPH_DATA_URL);
  
  return (
    <section id="skills" data-aos="fade-up" className="py-20 bg-background dark:bg-background-dark">
      <div className="container-tight">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-10 text-center text-primary dark:text-primary-dark">
          Skills & Expertise
        </h2>
        
        {loading ? (
          // Loading skeleton
          <div className="animate-pulse bg-surface dark:bg-surface-dark rounded-xl shadow-md border border-surface dark:border-surface-dark p-6 md:p-8">
            <div className="h-8 bg-surface-dark dark:bg-surface rounded-lg w-1/3 mb-6 opacity-20"></div>
            <div className="h-96 bg-surface-dark dark:bg-surface rounded-lg opacity-10"></div>
          </div>
        ) : error ? (
          // Error state
          <div className="bg-surface dark:bg-surface-dark p-6 md:p-8 rounded-xl shadow-md border border-surface dark:border-surface-dark">
            <p className="text-center text-red-500 dark:text-red-400 py-8">
              Error loading skills graph: {error}
            </p>
          </div>
        ) : graphData?.nodes.length ? (
          // Graph visualization
          <div className="bg-surface dark:bg-surface-dark p-6 md:p-8 rounded-xl shadow-md border border-surface dark:border-surface-dark">
            <SkillsSearch onSearch={filterNodes} />
            
            <div className="mb-4 text-sm text-primary dark:text-primary-dark opacity-70">
              <p>
                Click on category nodes to expand/collapse skills. 
                Hover over nodes to see details.
              </p>
            </div>
            
            <SkillsGraph 
              graphData={graphData}
              collapsedCategories={collapsedCategories}
              toggleCategory={toggleCategory}
              className="mt-6"
            />
          </div>
        ) : (
          // No data state
          <p className="text-center text-primary dark:text-primary-dark opacity-70 bg-surface dark:bg-surface-dark p-8 rounded-xl shadow-md">
            No skills data available.
          </p>
        )}
      </div>
    </section>
  );
}