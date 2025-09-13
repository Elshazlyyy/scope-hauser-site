// src/app/(marketing)/projects/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Pin, ChevronRight, Search } from '@/components/icons';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

type Project = {
  slug: string;
  title: string;
  location: string;
  category: string;
  thumbnail: string;
  hero?: string;
};

// ✅ If schema has only a single `image` field, resolve that directly
const PROJECTS_QUERY = groq/* groq */ `
*[_type == "project"] | order(title asc) {
  "slug": slug.current,
  title,
  location,
  "imageUrl": image.asset->url
}
`;

// Simple JS fallback for slug if missing
const toSlug = (t: string) =>
  encodeURIComponent(
    t
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')      // spaces -> dashes
      .replace(/[^a-z0-9\-]/g, '') // strip non-url-safe (except dash)
  );

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<'All' | Project['category']>('All');
  const [location, setLocation] = useState<string>('All');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = await client.fetch<Array<{
          slug?: string | null;
          title: string;
          location?: string | null;
          imageUrl?: string | null;
        }>>(PROJECTS_QUERY);

        if (!mounted) return;

        if (!raw?.length) {
          console.warn('[projects] Sanity returned 0 rows. Check: published docs, dataset, CORS, privacy.');
        } else {
          console.log('[projects] fetched', raw.length, 'rows. Example:', raw[0]);
        }

        const mapped: Project[] = (raw || [])
          .filter(r => !!r?.title)
          .map(r => {
            const safeSlug = r.slug && r.slug.length ? r.slug : toSlug(r.title);
            return {
              slug: safeSlug,
              title: r.title,
              location: r.location ?? '',
              category: 'Project',
              thumbnail: r.imageUrl ?? '',
              hero: r.imageUrl ?? '',
            };
          });

        setProjects(mapped);
      } catch (err) {
        console.error('Failed to fetch projects from Sanity', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const categories = useMemo<Project['category'][]>(
    () => Array.from(new Set(projects.map(p => p.category))) as Project['category'][],
    [projects]
  );

  const locations = useMemo<string[]>(
    () => Array.from(new Set(projects.map(p => p.location).filter(Boolean))),
    [projects]
  );

  const filtered = useMemo<Project[]>(() => {
    return projects.filter((p) => {
      const byCat = category === 'All' ? true : p.category === category;
      const byLoc = location === 'All' ? true : p.location === location;
      const byQ =
        q.trim() === ''
          ? true
          : [p.title, p.location, p.category].join(' ').toLowerCase().includes(q.toLowerCase());
      return byCat && byLoc && byQ;
    });
  }, [projects, category, location, q]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1720px] px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
        <h1 className="text-[28px] font-semibold text-neutral-900 sm:text-[36px]">Our Projects</h1>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by Project Name"
              className="h-11 w-full rounded-lg border border-black/10 bg-white pr-3 pl-10 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-black/10"
            />
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-1/2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'All' | Project['category'])}
                className="h-11 w-full appearance-none rounded-lg border border-black/10 bg-white pr-9 pl-3 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-black/10"
                aria-label="Project category"
              >
                {/* ✅ Fix label for the 'All' option */}
                <option value="All">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
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
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 rotate-90 text-neutral-500" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p, idx) => (<Card key={p.slug} p={p} priority={idx < 3} />))}
        </div>
      </div>
    </main>
  );
}

function Card({ p, priority }: { p: Project; priority?: boolean }) {
  const src = p.thumbnail || p.hero || null;

  return (
    <article className="group relative overflow-hidden border border-black/10 bg-white shadow-[0_6px_30px_rgba(0,0,0,0.08)]">
      <Link href={`/projects/${encodeURIComponent(p.slug)}`} aria-label={`View details for ${p.title}`} className="absolute inset-0 z-10" />
      <figure className="relative aspect-[4/3] w-full">
        {src ? (
          <Image
            src={src}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
            // ✅ Only prioritize the first few images for performance
            priority={!!priority}
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
      </figure>
      <div className="p-6">
        <h3 className="text-[28px] leading-snug font-semibold text-[#2B3119] sm:text-[32px]">{p.title}</h3>
        <div className="mt-3 inline-flex items-center gap-1 text-[16px] text-neutral-700 sm:text-[18px]">
          <Pin className="h-[26px] w-[26px] flex-shrink-0" />
          <span className="relative top-[2px]">{p.location}</span>
        </div>
      </div>
    </article>
  );
}
