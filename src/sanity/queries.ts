import {groq} from 'next-sanity'
import type {Project} from '@/types/project'
import {client} from './lib/client'

export const projectsQuery = groq`
  *[_type == "project"]{
    "slug": slug.current,
    "title": name,
    "location": coalesce(location, ""),
    "category": coalesce(propertyType, ""),
    "thumbnail": image1.asset->url,
    "hero": image1.asset->url,
    "summary": coalesce(description, ""),
    "description": coalesce(description, "")
  }
`

export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    "slug": slug.current,
    "title": name,
    "location": coalesce(location, ""),
    "category": coalesce(propertyType, ""),
    "thumbnail": image1.asset->url,
    "hero": image1.asset->url,
    "summary": coalesce(description, ""),
    "description": coalesce(description, "")
  }
`

export async function getProjects(): Promise<Project[]> {
  return client.fetch(projectsQuery)
}

export async function getProject(slug: string): Promise<Project | null> {
  return client.fetch(projectQuery, {slug})
}

