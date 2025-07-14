import { useEffect, useState } from 'react';
import type { ProfileData } from '../types/profile';
// Import profile data directly
import profileData from '../../data/profile.json';

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      // Using directly imported JSON data
      setProfile(profileData as ProfileData);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
  };
}
