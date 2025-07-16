'use client';

import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import type { Project } from '@/types/project';

export default function ProjectsSection() {
  const { projects, loading, error } = useProjects();
  const [filter, setFilter] = useState<string | null>(null);
  
  // Extract unique technologies from all projects for filtering
  const allTechnologies = projects.reduce((techs: string[], project: Project) => {
    project.stack.forEach(tech => {
      if (!techs.includes(tech)) {
        techs.push(tech);
      }
    });
    return techs;
  }, []);
  
  // Filter projects based on selected technology
  const filteredProjects = filter 
    ? projects.filter(project => project.stack.includes(filter))
    : projects;
  
  return (
    <section id="projects" className="py-20">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6 text-center text-primary dark:text-primary-dark">Projects</h2>
        <p className="text-lg text-primary dark:text-primary-dark opacity-80 max-w-3xl mx-auto text-center mb-12 font-body">
          Explore my recent work and personal projects
        </p>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
          <button
            className={`px-4 py-2 rounded-md text-sm font-body ${
              filter === null 
                ? 'bg-accent dark:bg-accent-dark text-background dark:text-background-dark'
                : 'bg-background dark:bg-background-dark text-primary dark:text-primary-dark hover:bg-surface-dark hover:bg-opacity-20 dark:hover:bg-surface dark:hover:bg-opacity-20'
            } transition-colors`}
            onClick={() => setFilter(null)}
          >
            All
          </button>
          
          {allTechnologies.map(tech => (
            <button
              key={tech}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                filter === tech
                  ? 'bg-accent dark:bg-accent-dark text-background dark:text-background-dark'
                  : 'bg-background dark:bg-background-dark text-primary dark:text-primary-dark hover:bg-surface-dark hover:bg-opacity-20 dark:hover:bg-surface dark:hover:bg-opacity-20'
              } transition-colors`}
              onClick={() => setFilter(tech)}
            >
              {tech}
            </button>
          ))}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-background dark:bg-background-dark rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-surface dark:bg-surface-dark"></div>
                <div className="p-6">
                  <div className="h-6 bg-surface dark:bg-surface-dark rounded mb-4"></div>
                  <div className="h-4 bg-surface dark:bg-surface-dark rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-surface dark:bg-surface-dark rounded w-full mb-2"></div>
                  <div className="h-4 bg-surface dark:bg-surface-dark rounded w-5/6"></div>
                  <div className="mt-6 flex">
                    <div className="h-10 bg-surface dark:bg-surface-dark rounded w-1/2 mr-2"></div>
                    <div className="h-10 bg-surface dark:bg-surface-dark rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-highlight dark:text-highlight-dark">
            Failed to load projects: {error.message}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center text-primary dark:text-primary-dark opacity-70">
            No projects found matching the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-background dark:bg-background-dark rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 bg-surface dark:bg-surface-dark">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary dark:text-primary-dark opacity-40">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-2 right-2 bg-accent dark:bg-accent-dark text-background dark:text-background-dark text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold mb-2 text-primary dark:text-primary-dark">{project.name}</h3>
                  <p className="text-primary dark:text-primary-dark opacity-80 mb-4 font-body">{project.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-primary dark:text-primary-dark">Role: </span>
                    <span className="text-sm text-primary dark:text-primary-dark opacity-80 font-body">{project.role}</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-primary dark:text-primary-dark">Outcome: </span>
                    <span className="text-sm text-primary dark:text-primary-dark opacity-80 font-body">{project.outcome}</span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.stack.map(tech => (
                        <span 
                          key={`${project.id}-${tech}`}
                          className="px-2 py-1 text-xs font-body rounded-full bg-surface dark:bg-surface-dark text-primary dark:text-primary-dark hover:bg-accent hover:bg-opacity-10 dark:hover:bg-accent-dark dark:hover:bg-opacity-10 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-accent dark:bg-accent-dark text-background dark:text-background-dark text-sm font-medium rounded-md hover:bg-opacity-90 dark:hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-accent dark:focus:ring-accent-dark focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        View Demo
                      </a>
                    )}
                    
                    {project.repoUrl && (
                      <a 
                        href={project.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-transparent border border-surface dark:border-surface-dark text-primary dark:text-primary-dark text-sm font-medium rounded-md hover:bg-surface hover:bg-opacity-50 dark:hover:bg-surface-dark dark:hover:bg-opacity-50 focus:outline-none focus:ring-2 focus:ring-surface dark:focus:ring-surface-dark focus:ring-offset-2 dark:focus:ring-offset-background-dark transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
