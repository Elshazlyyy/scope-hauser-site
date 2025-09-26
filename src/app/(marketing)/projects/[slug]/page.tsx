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
 * Fully aligned with src/types/project.d.ts and src/sanity/queries.ts
 * - Uses alt text from CMS (image1Alt..image5Alt) per slide
 * - Improved layout, spacing, and visual hierarchy
 * - Keeps server component (no client hooks required)
 */

// --- Sanity image URL helper (no 'any') ---
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
    title: p ? `${p.projectName} – Scope Hauser` : 'Project Details – Scope Hauser',
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

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white/90 px-3 py-1 text-[12px] text-neutral-700 shadow-sm">
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-[18px] font-semibold text-neutral-900">{title}</h2>
      <div className="text-[13px] leading-relaxed text-neutral-700">{children}</div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <dt className="text-[12px] text-neutral-500">{label}</dt>
      <dd className="mt-1 text-[14px] font-medium text-neutral-900">{value || '-'}</dd>
    </div>
  );
}

function CtaButton({ href, children }: { href?: string; children: React.ReactNode }) {
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

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await client.fetch<Project | null>(projectBySlugQuery, { slug });
  if (!p) return notFound();

  // Build slides (URL + alt pulled from CMS)
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
  if (slides.length === 0 && p.imageUrl) slides.push({ url: p.imageUrl, alt: p.projectName });

  return (
    <main className="bg-white">
      <div className="mx-auto w-full max-w-[1720px] px-4 pt-6 pb-14 sm:px-6 lg:px-14 lg:pt-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 text-[12px] text-neutral-500">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-neutral-700">Home</Link></li>
            <li>›</li>
            <li><Link href="/projects" className="hover:text-neutral-700">Projects</Link></li>
            <li>›</li>
            <li aria-current="page" className="text-neutral-700">{p.projectName}</li>
          </ol>
        </nav>

        {/* Title / Pills / CTA */}
        <header className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="text-[26px] font-semibold text-neutral-900 sm:text-[30px] lg:text-[34px]">{p.projectName}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <Pill><span className="font-medium text-neutral-900">Slug:</span> {p.slug}</Pill>
              {p.location && <Pill>📍 {p.location}</Pill>}
              {p.propertyType && <Pill>{p.propertyType}</Pill>}
              {p.bedrooms && <Pill>{p.bedrooms} bedrooms</Pill>}
              {p.developer && <Pill>By {p.developer}</Pill>}
              {typeof p.startingPriceAED === 'number' && <Pill>Starting {currencyAED(p.startingPriceAED)}</Pill>}
              {p.sizeRangeFt2 && <Pill>{p.sizeRangeFt2} ft²</Pill>}
            </div>
          </div>
          <div className="mt-4 flex gap-2 lg:col-span-5 lg:mt-0 lg:ml-auto lg:justify-end">
            <CtaButton href={p.listingURL}>View Listing</CtaButton>
          </div>
        </header>

        {/* Hero → Carousel with alt captions */}
        <section className="relative mt-6 lg:mt-8">
          <div className="relative overflow-hidden rounded-3xl border border-neutral-200 shadow-sm">
            <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
              {slides.map((s, idx) => (
                <figure
                  key={idx}
                  className="relative h-[252px] w-full flex-shrink-0 snap-center sm:h-[360px] lg:aspect-[21/9] lg:h-auto"
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
                  {s.alt && (
                    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-3 text-[12px] text-white sm:text-[13px]">
                      {s.alt}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>

            {/* subtle top gradient for polish */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/5 to-transparent" />
          </div>

          {/* Dots (visual only) */}
          {slides.length > 1 && (
            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-2 py-1">
              <div className="pointer-events-auto flex items-center gap-1.5">
                {slides.map((_, i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/70" />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Main content grid */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left: Overview */}
          <div className="lg:col-span-7">
            {p.description && (
              <Section title="Overview">
                <p className="whitespace-pre-line">{p.description}</p>
              </Section>
            )}
          </div>

          {/* Right: Key facts (sticky card) */}
          <aside className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <h3 className="text-[16px] font-semibold text-neutral-900">Key Facts</h3>
              <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Fact label="Project Name" value={p.projectName} />
                <Fact label="Location" value={p.location} />
                <Fact label="Property Type" value={p.propertyType} />
                <Fact label="Bedrooms" value={p.bedrooms} />
                <Fact label="Developer" value={p.developer} />
                <Fact label="Starting Price (AED)" value={currencyAED(p.startingPriceAED)} />
                <Fact label="Size Range (ft²)" value={p.sizeRangeFt2} />
                <Fact label="Listing URL" value={p.listingURL} />
              </dl>
              {p.listingURL && (
                <div className="mt-5">
                  <CtaButton href={p.listingURL}>View Listing</CtaButton>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
