import ProjectsCarouselClient from './ProjectsCarouselClient';
import {getProjects} from '@/sanity/queries';

export default async function ProjectsCarousel() {
  const projects = await getProjects();
  return <ProjectsCarouselClient projects={projects} />;
}

