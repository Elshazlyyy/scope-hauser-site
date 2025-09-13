import {groq} from 'next-sanity'

// Get projects: only title, location, image URL
export const projectsQuery = groq`
  *[_type == "project"] | order(order asc, publishedAt desc) {
    title,
    location,
    "imageUrl": image.asset->url
  }
`
