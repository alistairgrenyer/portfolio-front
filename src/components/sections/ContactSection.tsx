'use client';

import { useState, FormEvent } from 'react';
import { useProfile } from '@/hooks/useProfile';

export default function ContactSection() {
  const { profile, loading } = useProfile();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setErrorMessage('All fields are required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    try {
      setFormStatus('submitting');
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful form submission
      setFormState({ name: '', email: '', message: '' });
      setFormStatus('success');
      setErrorMessage(null);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };
  
  return (
    <section id="contact" className="py-20 bg-surface dark:bg-surface-dark">
      <div className="container-tight">
        <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-12 text-center text-primary dark:text-primary-dark">Get In Touch</h2>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-heading font-semibold mb-6 text-primary dark:text-primary-dark">Contact Information</h3>
            
            {loading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-8 bg-surface dark:bg-surface-dark rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-surface dark:bg-surface-dark rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-surface dark:bg-surface-dark rounded w-2/3"></div>
              </div>
            ) : profile?.basics ? (
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start">
                  <div className="bg-accent bg-opacity-10 dark:bg-accent-dark dark:bg-opacity-10 rounded-full p-3 mr-4">
                    <svg className="w-5 h-5 text-accent dark:text-accent-dark" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-primary dark:text-primary-dark mb-1">Email</h4>
                    <a 
                      href={`mailto:${profile.basics.email}`} 
                      className="text-accent dark:text-accent-dark hover:underline"
                    >
                      {profile.basics.email}
                    </a>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start">
                  <div className="bg-accent bg-opacity-10 dark:bg-accent-dark dark:bg-opacity-10 rounded-full p-3 mr-4">
                    <svg className="w-5 h-5 text-accent dark:text-accent-dark" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-primary dark:text-primary-dark mb-1">Location</h4>
                    <p className="text-primary dark:text-primary-dark opacity-80">{profile.basics.location}</p>
                  </div>
                </div>
                
                {/* Phone */}
                {profile.basics.phone && (
                  <div className="flex items-start">
                    <div className="bg-accent bg-opacity-10 dark:bg-accent-dark dark:bg-opacity-10 rounded-full p-3 mr-4">
                      <svg className="w-5 h-5 text-accent dark:text-accent-dark" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-primary dark:text-primary-dark mb-1">Phone</h4>
                      <a 
                        href={`tel:${profile.basics.phone}`} 
                        className="text-accent dark:text-accent-dark hover:underline"
                      >
                        {profile.basics.phone}
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Social Links */}
                <div>
                  <h4 className="text-lg font-medium text-primary dark:text-primary-dark mb-3">Connect with Me</h4>
                  <div className="flex space-x-4">
                    {profile.basics.socialLinks && profile.basics.socialLinks.length > 0 && 
                      profile.basics.socialLinks.map((social, index) => (
                        <a 
                          key={index}
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 dark:text-accent-dark dark:hover:text-accent-dark/80"
                          aria-label={`${social.name} Profile`}
                        >
                          {social.name === 'LinkedIn' && (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          )}
                          {social.name === 'GitHub' && (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                          )}
                          {social.name === 'Twitter' && (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                          )}
                        </a>
                      ))
                    }
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Contact information is not available.</p>
            )}
          </div>
          
          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-heading font-semibold mb-6 text-primary dark:text-primary-dark">Send a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-primary dark:text-primary-dark mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-surface dark:border-surface-dark rounded-md shadow-sm focus:ring-accent focus:border-accent dark:focus:ring-accent-dark dark:focus:border-accent-dark bg-background dark:bg-background-dark text-primary dark:text-primary-dark"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary dark:text-primary-dark mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-surface dark:border-surface-dark rounded-md shadow-sm focus:ring-accent focus:border-accent dark:focus:ring-accent-dark dark:focus:border-accent-dark bg-background dark:bg-background-dark text-primary dark:text-primary-dark"
                  placeholder="Your email"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary dark:text-primary-dark mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-surface dark:border-surface-dark rounded-md shadow-sm focus:ring-accent focus:border-accent dark:focus:ring-accent-dark dark:focus:border-accent-dark bg-background dark:bg-background-dark text-primary dark:text-primary-dark"
                  placeholder="Your message"
                ></textarea>
              </div>
              
              {errorMessage && (
                <div className="text-highlight dark:text-highlight-dark text-sm">{errorMessage}</div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-medium ${formStatus === 'submitting' ? 'bg-accent/70 cursor-not-allowed' : 'bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent'} dark:bg-accent-dark dark:hover:bg-accent-dark/90`}
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </div>
              
              {formStatus === 'success' && (
                <div className="text-accent dark:text-accent-dark text-center">Message sent successfully!</div>
              )}
              
              {formStatus === 'error' && (
                <div className="text-highlight dark:text-highlight-dark text-center">Failed to send message. Please try again.</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
