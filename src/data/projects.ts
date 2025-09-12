import type { Project } from '@/types/project';

// Use `satisfies` so TS checks the array against `Project[]`
// without losing literal types. Also makes accidental field
// name typos a compile error.
export const PROJECTS = [
  {
    slug: 'the-royal-atlantis',
    name: 'The Royal Atlantis',
    location: 'United Arab Emirates, Dubai',
    propertyType: 'Residential',
    description:
      'Iconic beachfront residences with world-class amenities.',
    image1: { src: '/images/royal-atlantis-thumb.jpg', alt: 'The Royal Atlantis thumbnail' },
    image2: { src: '/images/royal-atlantis-hero.jpg', alt: 'The Royal Atlantis hero' },
  },
  {
    slug: 'skyline-tower',
    name: 'Skyline Tower',
    location: 'United Arab Emirates, Abu Dhabi',
    propertyType: 'Residential',
    description: 'Panoramic city views and refined urban living.',
    image1: { src: '/images/skyline-thumb.jpg', alt: 'Skyline Tower thumbnail' },
    image2: { src: '/images/skyline-hero.jpg', alt: 'Skyline Tower hero' },
  },
  {
    slug: 'marina-business-bay',
    name: 'Marina Business Bay',
    location: 'United Arab Emirates, Dubai',
    propertyType: 'Commercial',
    description:
      'Grade-A waterfront offices in the heart of Business Bay.',
    image1: { src: '/images/marina-bb-thumb.jpg', alt: 'Marina Business Bay thumbnail' },
    image2: { src: '/images/marina-bb-hero.jpg', alt: 'Marina Business Bay hero' },
  },
] as const satisfies readonly Project[];
