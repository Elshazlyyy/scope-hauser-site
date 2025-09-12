// Keep this as a .d.ts so it’s types-only (no runtime output)

export interface ProjectImage {
  /** Path under /public, e.g. "/images/foo.jpg" */
  src: string;
  alt?: string;
}

export interface Project {
  slug: string;
  name: string;
  location?: string;
  propertyType?: string;
  bedrooms?: number;
  developer?: string;
  startingPriceAED?: number;
  sizeRange?: string;
  description?: string;
  listingUrl?: string;
  image1?: ProjectImage;
  image2?: ProjectImage;
  image3?: ProjectImage;
  image4?: ProjectImage;
  image5?: ProjectImage;
}
