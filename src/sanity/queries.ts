// src/sanity/queries.ts
import { groq } from 'next-sanity'

// Reusable selection of fields (matches schema)
const PROJECT_FIELDS = groq`
  "slug": slug.current,
  projectName,
  location,
  propertyType,
  bedrooms,
  developer,
  startingPriceAED,
  sizeRangeFt2,
  description,
  listingURL,

  // Simple fallback for current UI (pick first available image URL)
  "imageUrl": coalesce(
    image1.asset->url,
    image2.asset->url,
    image3.asset->url,
    image4.asset->url,
    image5.asset->url
  ),

  image1, image1Alt,
  image2, image2Alt,
  image3, image3Alt,
  image4, image4Alt,
  image5, image5Alt
`

export const projectsQuery = groq`
  *[_type == "project"] | order(projectName asc) {
    ${PROJECT_FIELDS}
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    ${PROJECT_FIELDS}
  }
`
