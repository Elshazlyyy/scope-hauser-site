// Keep this as a .d.ts so it’s types-only (no runtime output)

export type ProjectCategory = 'Residential' | 'Commercial';

export interface Project {
  slug: string;
  title: string;
  location: string;
  category: ProjectCategory;
  /** Path under /public, e.g. "/images/foo.jpg" */
  thumbnail: string;
  /** Path under /public, e.g. "/images/foo-hero.jpg" */
  hero: string;
  summary: string;
  description: string;
}
