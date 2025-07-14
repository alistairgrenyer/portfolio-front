export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface Basics {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  personalNote: string;
  socialLinks: SocialLink[];
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
  location: string;
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

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ProfileData {
  basics: Basics;
  skills: SkillCategory[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: Certification[];
}
