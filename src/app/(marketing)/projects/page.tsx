// src/app/(marketing)/projects/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pin, ChevronRight, Search } from '@/components/icons';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import type { Project } from '@/types/project';

// GROQ query aligned with new schema
const PROJECTS_QUERY = groq/* groq */ `
*[_type == "project"] | order(projectName asc) {
  "slug": slug.current,
  projectName,
  location,

  // Simple image fallback
  "imageUrl": coalesce(
    image1.asset->url,
    image2.asset->url,
    image3.asset->url,
    image4.asset->url,
    image5.asset->url
  )
}
`;

// Slug fallback if doc has no slug
const toSlug = (t: string) =>
  encodeURIComponent(
    t
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // spaces -> dashes
      .replace(/[^a-z0-9\-]/g, '') // strip non-url-safe (except dash)
  );

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<'All' | 'Project'>('All');
  const [location, setLocation] = useState<string>('All');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await client.fetch<
          Array<{
            slug?: string | null;
            projectName: string;
            location?: string | null;
            imageUrl?: string | null;
          }>
        >(PROJECTS_QUERY);

        if (!mounted) return;

        const mapped: Project[] = (raw || []).map((r) => {
          const safeSlug =
            r.slug && r.slug.length ? r.slug : toSlug(r.projectName);
          return {
            slug: safeSlug,
            projectName: r.projectName,
            location: r.location ?? '',
            imageUrl: r.imageUrl ?? '',
          };
        });

        setProjects(mapped);
      } catch (err) {
        console.error('Failed to fetch projects from Sanity', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Only one category ("Project"), but kept for future use
  const categories = useMemo<Array<'Project'>>(
    () => (projects.length ? ['Project'] : []),
    [projects]
  );

  // ✅ Fix type error: ensure only strings, no undefined
  const locations = useMemo<string[]>(
    () =>
      Array.from(
        new Set(
          projects.map((p) => p.location ?? '').filter((loc) => loc.length > 0)
        )
      ),
    [projects]
  );

  const filtered = useMemo<Project[]>(() => {
    return projects.filter((p) => {
      const byCat = category === 'All' ? true : true; // only one category
      const byLoc = location === 'All' ? true : p.location === location;
      const byQ =
        q.trim() === ''
          ? true
          : [p.projectName, p.location, 'Project']
              .join(' ')
              .toLowerCase()
              .includes(q.toLowerCase());
      return byCat && byLoc && byQ;
    });
  }, [projects, category, location, q]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1720px] px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
        <h1 className="text-[28px] font-semibold text-neutral-900 sm:text-[36px]">
          Our Projects
        </h1>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          {/* Search */}
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by Project Name"
              className="h-11 w-full rounded-lg border border-black/10 bg-white pr-3 pl-10 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-black/10"
            />
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          </div>

          {/* Dropdowns */}
          <div className="flex items-center gap-4">
            <div className="relative w-1/2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'All' | 'Project')}
                className="h-11 w-full appearance-none rounded-lg border border-black/10 bg-white pr-9 pl-3 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-black/10"
                aria-label="Project category"
              >
                <option value="All">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 rotate-90 text-neutral-500" />
            </div>

            <div className="relative w-1/2">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-black/10 bg-white pr-9 pl-3 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-black/10"
                aria-label="Location"
              >
                <option value="All">Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 rotate-90 text-neutral-500" />
            </div>
          </div>
        </div>

        {/* Project cards */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, idx) => (
            <Card key={p.slug} p={p} priority={idx < 3} />
          ))}
        </div>
      </div>
    </main>
  );
}

function Card({ p, priority }: { p: Project; priority?: boolean }) {
  const src = p.imageUrl || null;

  return (
    <article className="group relative overflow-hidden border border-black/10 bg-white shadow-[0_6px_30px_rgba(0,0,0,0.08)]">
      <Link
        href={`/projects/${encodeURIComponent(p.slug)}`}
        aria-label={`View details for ${p.projectName}`}
        className="absolute inset-0 z-10"
        prefetch
      />
      <figure className="relative aspect-[4/3] w-full">
        {src ? (
          <Image
            src={src}
            alt={p.projectName}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
            priority={!!priority}
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
      </figure>
      <div className="p-4 sm:p-5">
        <h3 className="text-[16px] font-semibold text-[#2B3119] sm:text-[18px]">
          {p.projectName}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-neutral-600 sm:mt-2 sm:gap-2 sm:text-[14px]">
          <Pin className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
          <span className="relative top-[0.5px] sm:top-[1px]">
            {p.location}
          </span>
        </div>
      </div>
    </article>
  );
}
