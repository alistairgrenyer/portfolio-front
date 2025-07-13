import { useEffect, useState } from 'react';
import type { ProfileData } from '../types/profile';

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        // In a real app, this would be a fetch call to an API
        // For this demo, we're importing the JSON file directly
        const response = await fetch('/data/profile.json');
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data: ProfileData = await response.json();
        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
  };
}
