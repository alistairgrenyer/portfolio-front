import { useEffect, useState } from 'react';
import type { Project, ProjectsData } from '../types/project';
import { apiRequest } from '../config/api';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiRequest<ProjectsData>('projects');
        setProjects(data.projects);
        setFeaturedProjects(data.projects.filter(project => project.featured));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return {
    projects,
    featuredProjects,
    loading,
    error,
  };
}
