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
    <section id="experience" data-aos="fade-up" className="py-20">
      <div className="container-wide">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-12 text-center text-primary dark:text-primary-dark">Experience</h2>
        
        {/* Two-panel layout with map on left and experience timeline on right */}
        {!loading && profile?.experience && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Left panel: Map with pins */}
            <div className="lg:col-span-1">
              <h3 className="text-xl font-heading font-semibold mb-4 text-primary dark:text-primary-dark">My UK Work Locations</h3>
              <div className="bg-background dark:bg-background-dark rounded-xl p-4 shadow-md h-64 md:h-[480px] border border-surface dark:border-surface-dark">
                <LocationMap 
                  locations={experienceLocations}
                  onPinClick={handlePinClick}
                />
              </div>
              <p className="text-sm text-primary dark:text-primary-dark opacity-70 mt-2 text-center italic">Click on a location pin to highlight the related experience</p>
            </div>
            
            {/* Right panel: Experience timeline */}
            <div className="lg:col-span-2">
              <div className="max-w-3xl mx-auto">
                {loading ? (
                  <div className="animate-pulse space-y-8">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex bg-background dark:bg-background-dark p-6 rounded-xl shadow-sm">
                        <div className="mr-4 w-24">
                          <div className="h-5 bg-surface dark:bg-surface-dark rounded-md w-20 mb-2"></div>
                          <div className="h-5 bg-surface dark:bg-surface-dark rounded-md w-16"></div>
                        </div>
                        <div className="flex-1">
                          <div className="h-6 bg-surface dark:bg-surface-dark rounded-md w-3/4 mb-2"></div>
                          <div className="h-5 bg-surface dark:bg-surface-dark rounded-md w-1/2 mb-4"></div>
                          <div className="h-4 bg-surface dark:bg-surface-dark rounded-md w-full mb-2"></div>
                          <div className="h-4 bg-surface dark:bg-surface-dark rounded-md w-5/6 mb-2"></div>
                          <div className="h-4 bg-surface dark:bg-surface-dark rounded-md w-4/6"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : profile?.experience ? (
                  <div className="space-y-8">
                    {getSortedExperience().map((exp, index) => (
                      <div 
                        key={exp.company} 
                        className={`relative bg-background dark:bg-background-dark p-6 rounded-xl shadow-md border transition-all duration-300 ${index === 0 && highlightedIndex !== null ? 'border-accent dark:border-accent-dark ring-2 ring-accent dark:ring-accent-dark ring-opacity-50' : 'border-surface dark:border-surface-dark'}`}
                      >
                        {/* Header: Position, company, and date */}
                        <div className="mb-5">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h3 className="text-xl font-heading font-semibold text-primary dark:text-primary-dark">{exp.position}</h3>
                              <p className="text-lg text-accent dark:text-accent-dark font-medium">{exp.company}</p>
                            </div>
                            <div className="text-sm font-medium bg-surface dark:bg-surface-dark text-primary dark:text-primary-dark px-3 py-1 rounded-full mt-2 md:mt-0 inline-block">
                              <time dateTime={exp.startDate}>{formatDate(exp.startDate)}</time>
                              <span className="mx-2">—</span>
                              <time dateTime={exp.endDate}>{formatDate(exp.endDate)}</time>
                            </div>
                          </div>
                          {exp.location && (
                            <div className="text-sm text-primary dark:text-primary-dark opacity-70 mt-2 flex items-center">
                              <svg className="w-4 h-4 mr-1 text-accent dark:text-accent-dark opacity-80" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                              </svg>
                              <span>{exp.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Highlights */}
                        <div className="mt-4">
                          <ul className="list-disc pl-5 space-y-2 text-primary dark:text-primary-dark opacity-90">
                            {exp.highlights.map((highlight, i) => (
                              <li key={i} className="leading-relaxed font-body">{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-primary dark:text-primary-dark opacity-70 bg-background dark:bg-background-dark p-6 rounded-xl shadow-sm">No experience data available.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
