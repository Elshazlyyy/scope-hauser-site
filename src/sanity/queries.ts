import {groq} from 'next-sanity'
import type {Project} from '@/types/project'
import {client} from './lib/client'

const baseFields = groq`
  "slug": slug.current,
  "title": name,
  location,
  propertyType,
  bedrooms,
  developer,
  startingPriceAED,
  sizeRange,
  listingUrl,
  "thumbnail": image1.asset->url,
  "hero": image1.asset->url,
  "summary": coalesce(description, ""),
  description,
  "image1": {"url": image1.asset->url, "alt": coalesce(image1.alt, "")},
  "image2": {"url": image2.asset->url, "alt": coalesce(image2.alt, "")},
  "image3": {"url": image3.asset->url, "alt": coalesce(image3.alt, "")},
  "image4": {"url": image4.asset->url, "alt": coalesce(image4.alt, "")},
  "image5": {"url": image5.asset->url, "alt": coalesce(image5.alt, "")}
`

export const projectsQuery = groq`*[_type == "project"]{${baseFields}}`

export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{${baseFields}}
`

export async function getProjects(): Promise<Project[]> {
  return client.fetch(projectsQuery)
}

export async function getProject(slug: string): Promise<Project | null> {
  return client.fetch(projectQuery, {slug})
}

