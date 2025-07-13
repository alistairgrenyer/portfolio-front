import { useEffect, useState } from 'react';
import type { Project, ProjectsData } from '../types/project';
// Import projects data directly
import projectsData from '../../data/projects.json';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      // Using directly imported JSON data
      const data = projectsData as ProjectsData;
      setProjects(data.projects);
      setFeaturedProjects(data.projects.filter(project => project.featured));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setLoading(false);
    }
  }, []);

  return {
    projects,
    featuredProjects,
    loading,
    error,
  };
}
