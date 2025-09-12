// src/app/(marketing)/projects/page.tsx
import ProjectsPageClient from './ProjectsPageClient';
import {getProjects} from '@/sanity/queries';

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsPageClient projects={projects} />;
}

