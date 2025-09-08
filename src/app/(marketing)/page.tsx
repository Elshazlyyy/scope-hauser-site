import Hero from '@/components/Hero';
import TopProjectsStrip from '@/components/TopProjectsStrip';
import ProjectsCarousel from '@/components/ProjectsCarousel';

export default function Page() {
  return (
    <>
      <Hero /> {/* ← very top */}
      <TopProjectsStrip />
      <ProjectsCarousel />
    </>
  );
}
