export interface Project {
  id: string;
  name: string;
  description: string;
  stack: string[];
  role: string;
  outcome: string;
  demoUrl: string;
  repoUrl: string;
  imageUrl: string;
  featured: boolean;
}

export interface ProjectsData {
  projects: Project[];
}
