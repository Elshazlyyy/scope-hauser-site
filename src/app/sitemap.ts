// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import {getProjects} from '@/sanity/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.scope-hauser.com'; // or from SITE.baseUrl

  const staticRoutes: MetadataRoute.Sitemap = [
    {url: `${base}/`, priority: 1.0},
    {url: `${base}/about`, priority: 0.6},
    {url: `${base}/projects`, priority: 0.7},
  ];

  const projects = await getProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map(p => ({
    url: `${base}/projects/${p.slug}`,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
