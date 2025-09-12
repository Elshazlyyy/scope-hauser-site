// src/app/(marketing)/projects/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import {getProject, getProjects} from '@/sanity/queries';

type PageProps = { params: Promise<{ slug: string }> };

// ----- Static params for SSG -----
export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(p => ({slug: p.slug}));
}

// ----- Dynamic <head> -----
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);

  const DEFAULT_DESC =
    'Discover real estate investment opportunities and find your perfect place in the UAE.';

  return {
    title: p ? `${p.title} – Scope Hauser` : 'Project Details – Scope Hauser',
    description: p ? `${p.title} in ${p.location}. ${DEFAULT_DESC}` : DEFAULT_DESC,
  };
}

// ----- Page -----
export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return notFound();

  return (
    <main className="bg-white">
      {/* Add tiny spacing below navbar */}
      <div className="mx-auto w-full max-w-[1720px] px-4 pt-8 pb-6 sm:px-6 lg:px-14 lg:pt-12 lg:pb-10">
        {/* Title + blurb */}
        <header className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <h1 className="text-[22px] font-semibold text-neutral-900 sm:text-[26px] lg:col-span-6 lg:text-[30px]">
            {p.title}
          </h1>
          <p className="mt-2 max-w-none text-[13px] leading-snug text-neutral-700 sm:text-[14px] lg:col-span-6 lg:ml-auto lg:mt-0 lg:max-w-[520px] lg:text-right">
            Discover real estate investment opportunities and find
            <br />
            your Discover real estate investment opportunities
          </p>
        </header>

        {/* Hero image — shorter height */}
        <figure className="relative mt-4 h-[220px] w-full overflow-hidden sm:h-[280px] lg:mt-6 lg:aspect-[21/9] lg:h-auto">
          <Image
            src={p.hero}
            alt={p.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1200px"
          />
        </figure>

        {/* Content sections */}
        <section className="mt-8 space-y-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <h2 className="text-[18px] font-semibold text-neutral-900">Lorem Ipsum</h2>
              <div className="space-y-2 text-[13px] leading-relaxed text-neutral-700">
                <p>
                  Discover real estate investment opportunities and find your
                  Discover real estate investment opportunities and find your
                  Discover real estate investment opportunities and find your
                  Discover real estate investment opportunities and find your
                  Discover real estate investment opportunities and find your
                  Discover real estate investment opportunities and find your
                  Discover real estate investment opportunities and find your
                </p>
                <p>
                  Discover real estate investment opportunities and find your
                  Discover real estate investment opportunities and find your
                  Discover real estate investment opportunities and find your
                  Discover real estate investment opportunities and find your
                  Discover real estate investment opportunities and find your
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
