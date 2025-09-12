// Keep this as a .d.ts so it’s types-only (no runtime output)

export interface ProjectImage {
  url: string
  alt: string
}

export interface Project {
  slug: string
  title: string
  location: string
  propertyType: string
  bedrooms?: number
  developer?: string
  startingPriceAED?: number
  sizeRange?: string
  listingUrl?: string
  /** First image used for previews */
  thumbnail: string
  /** Hero image used on detail pages */
  hero: string
  summary: string
  description: string
  image1?: ProjectImage
  image2?: ProjectImage
  image3?: ProjectImage
  image4?: ProjectImage
  image5?: ProjectImage
}
