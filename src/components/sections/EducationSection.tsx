'use client';

import { useProfile } from '@/hooks/useProfile';

export default function EducationSection() {
  const { profile, loading } = useProfile();
  
  return (
    <section id="education" className="py-20 bg-background dark:bg-background-dark">
      <div className="container mx-auto px-4">
        {/* <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-12 text-center text-primary dark:text-primary-dark">Education & Certifications</h2> */}
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-heading font-semibold mb-6 text-primary dark:text-primary-dark border-b border-surface dark:border-surface-dark pb-2">Education</h3>
            
            {loading ? (
              <div className="animate-pulse space-y-6">
                {[...Array(2)].map((_, i) => (
                  <div key={i}>
                    <div className="h-6 bg-surface dark:bg-surface-dark rounded w-3/4 mb-2"></div>
                    <div className="h-5 bg-surface dark:bg-surface-dark rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-surface dark:bg-surface-dark rounded w-1/4 mb-3"></div>
                    <div className="h-4 bg-surface dark:bg-surface-dark rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : profile?.education && profile.education.length > 0 ? (
              <div className="space-y-6">
                {profile.education.map((edu, index) => (
                  <div key={index} className="bg-surface dark:bg-surface-dark rounded-lg p-6 shadow-sm">
                    <h4 className="text-xl font-heading font-semibold mb-1 text-primary dark:text-primary-dark">{edu.institution}</h4>
                    <p className="text-accent dark:text-accent-dark mb-1">
                      {edu.degree} {edu.location && `- ${edu.location}`}
                    </p>
                    <p className="text-sm text-primary dark:text-primary-dark opacity-70 mb-2">
                      {edu.startDate} — {edu.endDate}
                    </p>
                    {edu.highlights && edu.highlights.length > 0 && (
                      <ul className="list-disc pl-5 text-primary dark:text-primary-dark opacity-80">
                        {edu.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-primary dark:text-primary-dark opacity-70">No education data available.</p>
            )}
          </div>
          
          {/* Certifications */}
          <div>
            <h3 className="text-2xl font-heading font-semibold mb-6 text-primary dark:text-primary-dark border-b border-surface dark:border-surface-dark pb-2">Certifications</h3>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-surface dark:bg-surface-dark rounded mb-4"></div>
                ))}
              </div>
            ) : profile?.certifications && profile.certifications.length > 0 ? (
              <div className="space-y-4">
                {profile.certifications.map((cert, index) => (
                  <div key={index} className="bg-surface dark:bg-surface-dark rounded-lg p-4 shadow-sm flex items-center">
                    <div className="bg-accent bg-opacity-10 dark:bg-accent-dark dark:bg-opacity-10 rounded-full p-3 mr-4">
                      <svg className="w-5 h-5 text-accent dark:text-accent-dark" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-primary dark:text-primary-dark mb-1">{cert.name}</h4>
                      <div className="flex flex-col md:flex-row md:justify-between text-sm">
                        <span className="text-primary dark:text-primary-dark opacity-80">{cert.issuer}</span>
                        <span className="text-primary dark:text-primary-dark opacity-70">{cert.date}</span>
                      </div>
                    </div>
                    {cert.url && (
                      <a 
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 text-accent dark:text-accent-dark hover:underline"
                        aria-label={`View certificate for ${cert.name}`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                        </svg>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-primary dark:text-primary-dark opacity-70">No certification data available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
