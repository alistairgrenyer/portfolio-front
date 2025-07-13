import { useEffect, useState } from 'react';
import type { Project, ProjectsData } from '../types/project';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        // In a real app, this would be a fetch call to an API
        // For this demo, we're importing the JSON file directly
        const response = await fetch('/data/projects.json');
        if (!response.ok) {
          throw new Error('Failed to fetch projects data');
        }
        
        const data: ProjectsData = await response.json();
        setProjects(data.projects);
        setFeaturedProjects(data.projects.filter(project => project.featured));
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return {
    projects,
    featuredProjects,
    loading,
    error,
  };
}
