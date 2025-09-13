// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

const PROJECTS_QUERY = groq/* groq */ `
  *[_type == "project"]{
    "slug": slug.current
  }
`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://www.scope-hauser.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1.0 },
    { url: `${base}/about`, priority: 0.6 },
    { url: `${base}/projects`, priority: 0.7 },
  ]

  const projects = await client.fetch<Array<{ slug: string }>>(PROJECTS_QUERY)

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter(p => !!p.slug)
    .map(p => ({
      url: `${base}/projects/${p.slug}`,
      priority: 0.7,
    }))

  return [...staticRoutes, ...projectRoutes]
}
