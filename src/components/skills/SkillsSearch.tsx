'use client';

import React, { useState, useCallback } from 'react';
// Inline debounce utility to avoid dependency issues
const debounce = <T extends (...args: any[]) => any>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
};

interface SkillsSearchProps {
  onSearch: (searchTerm: string) => void;
}

export default function SkillsSearch({ onSearch }: SkillsSearchProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Debounce search to avoid excessive filtering operations
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      onSearch(term);
    }, 300),
    [onSearch]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  return (
    <div className="mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg className="w-4 h-4 text-primary dark:text-primary-dark opacity-70" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          className="block w-full p-3 ps-10 text-sm bg-surface dark:bg-surface-dark border border-surface dark:border-surface-dark rounded-lg text-primary dark:text-primary-dark focus:ring-accent dark:focus:ring-accent-dark focus:border-accent dark:focus:border-accent-dark outline-none"
          placeholder="Search skills or categories..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}
