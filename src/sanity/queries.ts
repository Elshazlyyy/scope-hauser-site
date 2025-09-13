// src/sanity/queries.ts
import { groq } from 'next-sanity'

export const projectsQuery = groq`
  *[_type == "project"] | order(title asc) {
    "slug": slug.current,
    title,
    location,
    category,
    "imageUrl": image.asset->url
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    "slug": slug.current,
    title,
    location,
    category,
    "imageUrl": image.asset->url
  }
`
