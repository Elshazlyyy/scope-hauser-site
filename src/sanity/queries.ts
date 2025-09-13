import { groq } from 'next-sanity';

export const PROJECTS_QUERY = groq/* groq */ `
*[_type == "project"] | order(title asc) {
  "slug": coalesce(slug.current, slugify(title)),
  title,
  location,
  "imageUrl": coalesce(
    image.url,
    image.asset->url,
    images[0].url,
    images[0].asset->url
  )
}
`;

export const PROJECT_SLUGS = groq/* groq */ `
*[_type == "project" && (defined(slug.current) || defined(title))]{
  "slug": coalesce(slug.current, slugify(title))
}
`;

export const PROJECT_BY_SLUG = groq/* groq */ `
*[_type == "project" && (
  slug.current == $slug ||
  slugify(title) == $slug
)][0]{
  "slug": coalesce(slug.current, slugify(title)),
  title,
  location,
  image{url, alt}
}
`;
