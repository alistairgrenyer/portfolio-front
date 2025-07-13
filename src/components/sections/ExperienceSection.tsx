'use client';

import { useProfile } from '@/hooks/useProfile';
import { useState, useEffect } from 'react';
import { LocationMap, LocationData, UK_CITY_COORDINATES } from '@/components/maps/LocationMap';

export default function ExperienceSection() {
  const { profile, loading } = useProfile();
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [experienceLocations, setExperienceLocations] = useState<LocationData[]>([]);
  
  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (dateString === 'Present') return 'Present';
    
    try {
      const [year, month] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  // Function to handle pin click on map
  const handlePinClick = (companyName: string) => {
    // Find the index of the experience with the matching company name
    const index = profile?.experience.findIndex(exp => exp.company === companyName) ?? -1;
    if (index !== -1) {
      setHighlightedIndex(index);
    }
  };
  
  // Function to sort experiences based on highlighted state
  const getSortedExperience = () => {
    if (!profile?.experience || highlightedIndex === null) {
      return profile?.experience || [];
    }
    
    // Clone the array to avoid mutating the original
    const sortedExperience = [...profile.experience];
    
    // Remove the highlighted item
    const highlightedItem = sortedExperience.splice(highlightedIndex, 1)[0];
    
    // Add it to the beginning
    sortedExperience.unshift(highlightedItem);
    
    return sortedExperience;
  };
  
  // Extract city from location string
  const getCityFromLocation = (location: string): string => {
    // Try to extract city name from "United Kingdom, CityName" format
    const parts = location.split(',');
    if (parts.length > 1) {
      return parts[1].trim();
    }
    return parts[0].trim(); // Fallback to full string
  };

  // Process experience data for map when profile loads
  useEffect(() => {
    if (profile?.experience) {
      const locations = profile.experience.map(exp => {
        const cityName = getCityFromLocation(exp.location || 'Remote');
        
        return {
          company: exp.company,
          position: exp.position,
          dates: `${formatDate(exp.startDate)} — ${formatDate(exp.endDate)}`,
          location: exp.location || 'Remote',
          coordinates: UK_CITY_COORDINATES[cityName] || { x: 40, y: 50 } // Center if not found
        };
      });
      setExperienceLocations(locations);
    }
  }, [profile]);
  
  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Experience</h2> */}
        
        {/* Two-panel layout with map on left and experience timeline on right */}
        {!loading && profile?.experience && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left panel: Map with pins */}
            <div className="lg:col-span-1">
              {/* <h3 className="text-xl font-semibold mb-4">My UK Work Locations</h3> */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 shadow-sm h-64 md:h-80">
                <LocationMap 
                  locations={experienceLocations}
                  onPinClick={handlePinClick}
                />
              </div>
            </div>
            
            {/* Right panel: Experience timeline */}
            <div className="lg:col-span-2">
              <div className="max-w-3xl mx-auto">
                {loading ? (
                  <div className="animate-pulse space-y-8">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex">
                        <div className="mr-4 w-24">
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                        <div className="flex-1">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : profile?.experience ? (
                  <div className="space-y-12">
                    {getSortedExperience().map((exp, index) => (
                      <div 
                        key={exp.company} 
                        className={`relative pl-8 md:pl-0 transition-all duration-300 ${index === 0 && highlightedIndex !== null ? 'bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg shadow-md' : ''}`}
                      >
                        {/* Timeline dot and line */}
                        {/* <div className="hidden md:block absolute top-0 left-1/2 w-px h-full bg-gray-300 dark:bg-gray-700 -translate-x-1/2 z-0"></div>
                        <div className={`hidden md:flex absolute top-0 left-1/2 w-5 h-5 rounded-full bg-blue-600 -translate-x-1/2 z-10 items-center justify-center ${index === 0 ? 'ring-4 ring-blue-100 dark:ring-blue-900' : ''}`}></div> */}
                        
                        {/* Mobile dot and line */}
                        {/* <div className="md:hidden absolute top-0 left-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700 z-0"></div>
                        <div className={`md:hidden absolute top-0 left-0 w-5 h-5 rounded-full bg-blue-600 -translate-x-1/2 z-10 ${index === 0 ? 'ring-4 ring-blue-100 dark:ring-blue-900' : ''}`}></div> */}
                        
                        {/* Header: Position, company, and date */}
                        <div className="mb-4">
                          <div className="flex flex-wrap items-center justify-between">
                            <div>
                              <h3 className="text-xl font-semibold">{exp.position}</h3>
                              <p className="text-lg text-blue-600 dark:text-blue-400">{exp.company}</p>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
                              <time dateTime={exp.startDate}>{formatDate(exp.startDate)}</time>
                              <span className="mx-2">—</span>
                              <time dateTime={exp.endDate}>{formatDate(exp.endDate)}</time>
                            </div>
                          </div>
                          {exp.location && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Highlights */}
                        <div className="mt-3">
                          <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300">
                            {exp.highlights.map((highlight, i) => (
                              <li key={i} className="mb-1">{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400">No experience data available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
