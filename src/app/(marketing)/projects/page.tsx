// src/app/(marketing)/projects/page.tsx
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS } from '@/data/projects';
import type { Project } from '@/types/project';
import { Pin, ChevronRight, Search } from '@/components/icons';

type Category = Project['category'];

export default function ProjectsPage() {
  const categories = useMemo<Category[]>(
    () => Array.from(new Set(PROJECTS.map((p) => p.category))) as Category[],
    [],
  );
  const locations = useMemo<string[]>(
    () => Array.from(new Set(PROJECTS.map((p) => p.location))),
    [],
  );

  const [q, setQ] = useState('');
  const [category, setCategory] = useState<'All' | Category>('All');
  const [location, setLocation] = useState<string>('All');

  const filtered = useMemo<Project[]>(() => {
    return PROJECTS.filter((p) => {
      const byCat = category === 'All' ? true : p.category === category;
      const byLoc = location === 'All' ? true : p.location === location;
      const byQ =
        q.trim() === ''
          ? true
          : [p.title, p.location, p.category]
              .join(' ')
              .toLowerCase()
              .includes(q.toLowerCase());
      return byCat && byLoc && byQ;
    });
  }, [category, location, q]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-[1720px] px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
        {/* Header */}
        <h1 className="text-[28px] font-semibold text-neutral-900 sm:text-[36px]">
          Our Projects
        </h1>

        {/* Search + Filters */}
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

          {/* Right selects */}
          <div className="flex items-center gap-4">
            {/* Category */}
            <div className="relative w-1/2">
              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as 'All' | Category)
                }
                className="h-11 w-full appearance-none rounded-lg border border-black/10 bg-white pr-9 pl-3 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-black/10"
                aria-label="Project category"
              >
                <option value="All">Project</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronRight className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 rotate-90 text-neutral-500" />
            </div>

            {/* Location */}
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

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </main>
  );
}

/* ----------------------------- Card component ----------------------------- */

function Card({ p }: { p: Project }) {
  return (
    <article className="group relative overflow-hidden border border-black/10 bg-white shadow-[0_6px_30px_rgba(0,0,0,0.08)]">
      {/* Full-card link */}
      <Link
        href={`/projects/${p.slug}`}
        aria-label={`View details for ${p.title}`}
        className="absolute inset-0 z-10"
      />

      {/* Image (no rounded corners) */}
      <figure className="relative aspect-[4/3] w-full">
        <Image
          src={p.thumbnail || p.hero}
          alt={p.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
          priority
        />
      </figure>

      {/* Body: Title + Location */}
      <div className="p-6">
        <h3 className="text-[28px] leading-snug font-semibold text-[#2B3119] sm:text-[32px]">
          {p.title}
        </h3>

        <div className="mt-3 inline-flex items-center gap-1 text-[16px] text-neutral-700 sm:text-[18px]">
          <Pin className="h-[26px] w-[26px] flex-shrink-0" />
          <span className="relative top-[2px]">{p.location}</span>
        </div>
      </div>
    </article>
  );
}
