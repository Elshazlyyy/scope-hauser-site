// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { PROJECTS } from '@/data/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.scope-hauser.com'; // or from SITE.baseUrl

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1.0 },
    { url: `${base}/about`, priority: 0.6 },
    { url: `${base}/projects`, priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = PROJECTS.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
