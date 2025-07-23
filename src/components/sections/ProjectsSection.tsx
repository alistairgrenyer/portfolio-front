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
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Projects</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-center mb-12">
          Explore my recent work and personal projects
        </p>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            className={`px-4 py-2 rounded-md text-sm ${
              filter === null 
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            } transition-colors`}
            onClick={() => setFilter(null)}
          >
            All
          </button>
          
          {allTechnologies.map(tech => (
            <button
              key={tech}
              className={`px-4 py-2 rounded-md text-sm ${
                filter === tech
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
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
              <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="mt-6 flex">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mr-2"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">
            Failed to load projects: {error.message}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            No projects found matching the selected filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{project.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Role: </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{project.role}</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Outcome: </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{project.outcome}</span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.stack.map(tech => (
                        <span 
                          key={`${project.id}-${tech}`}
                          className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
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
                        className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
                      >
                        View Demo
                      </a>
                    )}
                    
                    {project.repoUrl && (
                      <a 
                        href={project.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
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
