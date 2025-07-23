/**
 * API Configuration
 * Centralizes API base URL and endpoint definitions
 */

// Get API base URL from environment variable, fallback to localhost for development
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// API endpoints configuration
export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  endpoints: {
    profile: '/api/profile',
    projects: '/api/projects',
    skillsGraph: '/api/skills-graph',
    chat: '/api/chat',
  },
} as const;

/**
 * Helper function to build full API URLs
 */
export function getApiUrl(endpoint: keyof typeof API_CONFIG.endpoints): string {
  return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints[endpoint]}`;
}

/**
 * Generic API fetch wrapper with error handling
 */
export async function apiRequest<T>(
  endpoint: keyof typeof API_CONFIG.endpoints,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
