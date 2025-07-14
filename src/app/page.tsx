import HomeSection from '@/components/sections/HomeSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Home/Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center">
        <HomeSection />
      </section>
      
      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
          <AboutSection />
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">My Projects</h2>
          <ProjectsSection />
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
          <SkillsSection />
        </div>
      </section>
      
      {/* Experience Section */}
      <section id="experience" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
          <ExperienceSection />
        </div>
      </section>
      
      {/* Education Section */}
      <section id="education" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          {/* <h2 className="text-3xl font-bold mb-8 text-center">Education & Certifications</h2> */}
          <EducationSection />
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container mx-auto px-4">
          {/* <h2 className="text-3xl font-bold mb-8 text-center">Contact Me</h2> */}
          <ContactSection />
        </div>
      </section>
    </main>
  );
}
