// src/types/project.d.ts

export type SanityImageRef = {
  _type: 'image'
  asset: { _type: 'reference'; _ref: string }
}

export type Project = {
  slug: string
  projectName: string
  imageUrl?: string

  // NEW
  topTile?: 1 | 2 | 3 | 4

  location?: string
  propertyType?: string
  bedrooms?: string
  developer?: string
  startingPriceAED?: number
  sizeRangeFt2?: string
  description?: string
  listingURL?: string

  image1?: SanityImageRef; image1Alt?: string
  image2?: SanityImageRef; image2Alt?: string
  image3?: SanityImageRef; image3Alt?: string
  image4?: SanityImageRef; image4Alt?: string
  image5?: SanityImageRef; image5Alt?: string
}
