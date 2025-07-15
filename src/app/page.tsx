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
      <section id="about" className="py-16 bg-[var(--color-surface)]">
        <div className="container-wide">
          <AboutSection />
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="py-16">
        <div className="container-wide">
          <ProjectsSection />
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="py-16 bg-[var(--color-surface-muted)]">
        <div className="container-wide">
          <SkillsSection />
        </div>
      </section>
      
      {/* Experience Section */}
      <section id="experience" className="py-16">
        <div className="container-wide">
          <ExperienceSection />
        </div>
      </section>
      
      {/* Education Section */}
      <section id="education" className="py-16 bg-[var(--color-surface)]">
        <div className="container-wide">
          <EducationSection />
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="container-wide">
          <ContactSection />
        </div>
      </section>
    </main>
  );
}
