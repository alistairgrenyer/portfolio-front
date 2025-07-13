/**
 * Navigation utilities for smooth scrolling to sections
 */

/**
 * Scrolls to the specified section with smooth behavior
 * @param sectionId - The ID of the section to scroll to
 * @param options - Optional scroll behavior configuration
 * @returns boolean indicating success
 */
export const scrollToSection = (
  sectionId: string,
  options: { behavior?: ScrollBehavior; offset?: number } = {}
): boolean => {
  const { behavior = 'smooth', offset = 0 } = options;
  const element = document.getElementById(sectionId);
  
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
    return true;
  }
  return false;
};

/**
 * Maps natural language queries to section IDs
 * This is used by the chatbot to navigate based on user messages
 * @param query - Natural language query from user
 * @returns sectionId if match found, null otherwise
 */
export const getSectionIdFromQuery = (query: string): string | null => {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Define mappings from queries to section IDs
  const mappings: Record<string, string[]> = {
    'home': ['home', 'top', 'start', 'beginning', 'main'],
    'about': ['about', 'about me', 'who are you', 'introduction', 'bio', 'background'],
    'projects': ['projects', 'work', 'portfolio', 'showcase', 'what did you build', 'applications', 'apps'],
    'skills': ['skills', 'technologies', 'tech stack', 'programming languages', 'frameworks', 'tools', 'expertise', 'what can you do'],
    'experience': ['experience', 'work history', 'job history', 'employment', 'career', 'companies', 'positions'],
    'education': ['education', 'degrees', 'academic', 'university', 'college', 'school', 'certifications', 'certificates', 'qualifications'],
    'contact': ['contact', 'get in touch', 'reach out', 'email', 'message', 'connect', 'social media']
  };
  
  // Check for exact section name match first
  if (Object.keys(mappings).includes(normalizedQuery)) {
    return normalizedQuery;
  }
  
  // Check for partial matches
  for (const [sectionId, keywords] of Object.entries(mappings)) {
    if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
      return sectionId;
    }
  }
  
  // Check for specific project-related queries
  if (
    normalizedQuery.includes('react') || 
    normalizedQuery.includes('typescript') || 
    normalizedQuery.includes('next') ||
    normalizedQuery.includes('frontend') || 
    normalizedQuery.includes('web')
  ) {
    return 'projects';
  }
  
  // No match found
  return null;
};

/**
 * Navigates to a section based on a natural language query
 * @param query - Natural language query from user
 * @param options - Optional scroll behavior configuration
 * @returns boolean indicating success
 */
export const navigateToSectionByQuery = (
  query: string,
  options: { behavior?: ScrollBehavior; offset?: number } = {}
): boolean => {
  const sectionId = getSectionIdFromQuery(query);
  
  if (sectionId) {
    return scrollToSection(sectionId, options);
  }
  return false;
};
