export interface SocialLinks {
  linkedin: string;
  github: string;
  twitter: string;
}

export interface Basics {
  name: string;
  title: string;
  tagline: string;
  email: string;
  location: string;
  summary: string;
  personalNote: string;
  socialLinks: SocialLinks;
}

export interface ExperienceItem {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  highlights: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface ProfileData {
  basics: Basics;
  skills: {
    frontend: string[];
    backend: string[];
    databases: string[];
    devops: string[];
    tools: string[];
  };
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: Certification[];
}
