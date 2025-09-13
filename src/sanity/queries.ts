import { groq } from 'next-sanity';

export const PROJECTS_QUERY = groq/* groq */ `
*[_type == "project"] | order(title asc) {
  "slug": coalesce(slug.current, lower(replace(title, " ", "-"))),
  title,
  location,
  image{ url, alt }
}
`;

export const PROJECT_SLUGS = groq/* groq */ `
*[_type == "project" && (defined(slug.current) || defined(title))]{
  "slug": coalesce(slug.current, lower(replace(title, " ", "-")))
}
`;

export const PROJECT_BY_SLUG = groq/* groq */ `
*[_type == "project" && (
  slug.current == $slug ||
  lower(replace(title, " ", "-")) == $slug
)][0]{
  "slug": coalesce(slug.current, lower(replace(title, " ", "-"))),
  title,
  location,
  image{ url, alt }
}
`;
