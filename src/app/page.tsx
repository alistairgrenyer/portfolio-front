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
      
      <ProjectsSection />
      
      <SkillsSection />
      
      <ExperienceSection />
      
      <EducationSection />
      
      <ContactSection />
    </main>
  );
}
