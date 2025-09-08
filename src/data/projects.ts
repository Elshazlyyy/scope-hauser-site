import type { Project } from '@/types/project';

// Use `satisfies` so TS checks the array against `Project[]`
// without losing literal types. Also makes accidental field
// name typos a compile error.
export const PROJECTS = [
  {
    slug: 'the-royal-atlantis',
    title: 'The Royal Atlantis',
    location: 'United Arab Emirates, Dubai',
    category: 'Residential',
    thumbnail: '/images/royal-atlantis-thumb.jpg',
    hero: '/images/royal-atlantis-hero.jpg',
    summary: 'Iconic beachfront residences with world-class amenities.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum a scelerisque nisl. Vivamus finibus, magna non consequat lobortis, orci mi dictum velit, vitae cursus mi urna eget lorem.',
  },
  {
    slug: 'skyline-tower',
    title: 'Skyline Tower',
    location: 'United Arab Emirates, Abu Dhabi',
    category: 'Residential',
    thumbnail: '/images/skyline-thumb.jpg',
    hero: '/images/skyline-hero.jpg',
    summary: 'Panoramic city views and refined urban living.',
    description:
      'Donec laoreet, augue at rhoncus fermentum, libero arcu vehicula tortor, non varius lorem nisl eget elit. Curabitur in sapien id augue semper tincidunt.',
  },
  {
    slug: 'marina-business-bay',
    title: 'Marina Business Bay',
    location: 'United Arab Emirates, Dubai',
    category: 'Commercial',
    thumbnail: '/images/marina-bb-thumb.jpg',
    hero: '/images/marina-bb-hero.jpg',
    summary: 'Grade-A waterfront offices in the heart of Business Bay.',
    description:
      'Integer posuere, nisl eu luctus pellentesque, nunc magna posuere odio, id feugiat dui arcu vitae leo. Aliquam erat volutpat.',
  },
] as const satisfies readonly Project[];
