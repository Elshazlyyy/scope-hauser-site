// src/sanity/queries.ts
import { groq } from 'next-sanity'

const PROJECT_FIELDS = groq`
  "slug": slug.current,
  projectName,
  topTile,
  location,
  propertyType,
  bedrooms,
  developer,
  startingPriceAED,
  sizeRangeFt2,
  description,
  listingURL,

  // Fallback image URL
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

// NEW: For the 4-tile “Top Projects” strip.
// For each tile (1..4) pick the most recently updated project if duplicates exist.
export const topProjectsByTileQuery = groq`
{
  "tile1": *[_type=="project" && topTile == 1] | order(_updatedAt desc)[0]{ ${PROJECT_FIELDS} },
  "tile2": *[_type=="project" && topTile == 2] | order(_updatedAt desc)[0]{ ${PROJECT_FIELDS} },
  "tile3": *[_type=="project" && topTile == 3] | order(_updatedAt desc)[0]{ ${PROJECT_FIELDS} },
  "tile4": *[_type=="project" && topTile == 4] | order(_updatedAt desc)[0]{ ${PROJECT_FIELDS} }
}
`
