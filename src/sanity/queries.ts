import { groq } from 'next-sanity'

// List: only title, location, image URL, slug
export const projectsQuery = groq/* groq */ `
  *[_type == "project"] | order(title asc) {
    "slug": slug.current,
    title,
    location,
    "imageUrl": image.asset->url
  }
`

// Single project by slug
export const projectBySlugQuery = groq/* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    "slug": slug.current,
    title,
    location,
    "imageUrl": image.asset->url
  }
`
