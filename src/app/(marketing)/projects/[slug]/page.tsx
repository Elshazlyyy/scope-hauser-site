// src/app/(marketing)/projects/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { projectsQuery, projectBySlugQuery } from '@/sanity/queries';
import type { Project, SanityImageRef } from '@/types/project';
import imageUrlBuilder from '@sanity/image-url';

/**
 * Aligned with src/types/project.d.ts and src/sanity/queries.ts
 * Renders ALL fields from Project.
 * Top hero is a scroll-snap carousel built from image1..image5, with fallback to imageUrl.
 */

// --- Sanity image URL helper (no 'any', safe even if env missing) ---
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const builder =
  SANITY_PROJECT_ID && SANITY_DATASET
    ? imageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET })
    : null;

function urlFor(src?: SanityImageRef) {
  if (!src || !builder) return undefined;
  try {
    return builder
      .image(src)
      .width(1920)
      .height(1080)
      .fit('crop')
      .auto('format')
      .quality(85)
      .url();
  } catch {
    return undefined;
  }
}

export async function generateStaticParams() {
  const projects = await client.fetch<Project[]>(projectsQuery);
  return projects.filter((p) => p.slug).map((p) => ({ slug: p.slug }));
}

export const revalidate = 600;

// Keep Promise signature if your routing passes params as a Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await client.fetch<Project | null>(projectBySlugQuery, { slug });

  const DEFAULT_DESC =
    'Discover real estate investment opportunities and find your perfect place in the UAE.';

  return {
    title: p
      ? `${p.projectName} – Scope Hauser`
      : 'Project Details – Scope Hauser',
    description: p
      ? `${p.projectName}${p.location ? ` in ${p.location}` : ''}. ${DEFAULT_DESC}`
      : DEFAULT_DESC,
  };
}

// Helpers
function currencyAED(n?: number) {
  if (typeof n !== 'number') return undefined;
  try {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `AED ${n.toLocaleString()}`;
  }
}

function FactPill({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[12px] text-neutral-700 shadow-sm">
      <span className="font-medium text-neutral-900">{label}:</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-[18px] font-semibold text-neutral-900">{title}</h2>
      <div className="text-[13px] leading-relaxed text-neutral-700">
        {children}
      </div>
    </section>
  );
}

function CtaButton({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  if (!href) return null;
  const isExternal = href.startsWith('http');
  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-2 text-[13px] font-medium text-neutral-900 shadow-sm hover:bg-neutral-50"
    >
      {children}
    </Link>
  );
}

// Page
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await client.fetch<Project | null>(projectBySlugQuery, { slug });
  if (!p) return notFound();

  // Slides with proper alt pairing, filtered for available URLs
  const rawSlides: Array<{ ref?: SanityImageRef; alt: string }> = [
    { ref: p.image1, alt: p.image1Alt || 'Image 1' },
    { ref: p.image2, alt: p.image2Alt || 'Image 2' },
    { ref: p.image3, alt: p.image3Alt || 'Image 3' },
    { ref: p.image4, alt: p.image4Alt || 'Image 4' },
    { ref: p.image5, alt: p.image5Alt || 'Image 5' },
  ];
  const slides: Array<{ url: string; alt: string }> = rawSlides
    .map((s) => ({ url: urlFor(s.ref), alt: s.alt }))
    .filter((s): s is { url: string; alt: string } => Boolean(s.url));
  if (slides.length === 0 && p.imageUrl)
    slides.push({ url: p.imageUrl, alt: p.projectName });

  return (
    <main className="bg-white">
      <div className="mx-auto w-full max-w-[1720px] px-4 pt-8 pb-10 sm:px-6 lg:px-14 lg:pt-12">
        {/* Header */}
        <header className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="text-[24px] font-semibold text-neutral-900 sm:text-[28px] lg:text-[32px]">
              {p.projectName}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <FactPill label="Slug" value={p.slug} />
              <FactPill label="Location" value={p.location} />
              <FactPill label="Property" value={p.propertyType} />
              <FactPill label="Bedrooms" value={p.bedrooms} />
              <FactPill label="Developer" value={p.developer} />
              <FactPill
                label="Starting"
                value={currencyAED(p.startingPriceAED)}
              />
              <FactPill label="Size (ft²)" value={p.sizeRangeFt2} />
            </div>
          </div>

          <div className="mt-4 flex gap-2 lg:col-span-5 lg:mt-0 lg:ml-auto lg:justify-end">
            <CtaButton href={p.listingURL}>View Listing</CtaButton>
          </div>
        </header>

        {/* Hero → Carousel (with per-slide caption from alt) */}
        <section className="relative mt-5 lg:mt-7">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
              {slides.map((s, idx) => (
                <figure
                  key={idx}
                  className="relative h-[232px] w-full flex-shrink-0 snap-center sm:h-[320px] lg:aspect-[21/9] lg:h-auto"
                >
                  <Image
                    src={s.url}
                    alt={s.alt}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1400px"
                    unoptimized
                  />
                  {/* Caption overlay (from alt) */}
                  {s.alt && (
                    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 py-2 text-[12px] text-white sm:text-[13px]">
                      {s.alt}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>

          {/* Dots (visual only) */}
          {slides.length > 1 && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-2 py-1">
              <div className="pointer-events-auto flex items-center gap-1">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-white/70"
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Content Sections */}
        <div className="mt-8 space-y-10">
          {/* Overview / Description */}
          {p.description && (
            <Section title="Overview">
              <p className="whitespace-pre-line">{p.description}</p>
            </Section>
          )}

          {/* Key Facts Grid */}
          <Section title="Key Facts">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <dt className="text-[12px] text-neutral-500">Project Name</dt>
                <dd className="mt-1 text-[14px] font-medium text-neutral-900">
                  {p.projectName || '-'}
                </dd>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <dt className="text-[12px] text-neutral-500">Location</dt>
                <dd className="mt-1 text-[14px] font-medium text-neutral-900">
                  {p.location || '-'}
                </dd>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <dt className="text-[12px] text-neutral-500">Property Type</dt>
                <dd className="mt-1 text-[14px] font-medium text-neutral-900">
                  {p.propertyType || '-'}
                </dd>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <dt className="text-[12px] text-neutral-500">Bedrooms</dt>
                <dd className="mt-1 text-[14px] font-medium text-neutral-900">
                  {p.bedrooms || '-'}
                </dd>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <dt className="text-[12px] text-neutral-500">Developer</dt>
                <dd className="mt-1 text-[14px] font-medium text-neutral-900">
                  {p.developer || '-'}
                </dd>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <dt className="text-[12px] text-neutral-500">
                  Starting Price (AED)
                </dt>
                <dd className="mt-1 text-[14px] font-medium text-neutral-900">
                  {currencyAED(p.startingPriceAED) || '-'}
                </dd>
              </div>
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <dt className="text-[12px] text-neutral-500">
                  Size Range (ft²)
                </dt>
                <dd className="mt-1 text-[14px] font-medium text-neutral-900">
                  {p.sizeRangeFt2 || '-'}
                </dd>
              </div>
            </dl>
          </Section>
        </div>
      </div>
    </main>
  );
}
