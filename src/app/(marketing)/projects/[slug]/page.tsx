// src/app/(marketing)/projects/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { projectsQuery, projectBySlugQuery } from '@/sanity/queries';
import type { Project, SanityImageRef } from '@/types/project';
import imageUrlBuilder from '@sanity/image-url';

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const builder =
  SANITY_PROJECT_ID && SANITY_DATASET
    ? imageUrlBuilder({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET })
    : null;

function urlFor(src?: SanityImageRef) {
  if (!src || !builder) return undefined;
  try {
    return builder.image(src).width(1920).height(1080).fit('crop').auto('format').quality(85).url();
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-[18px] font-semibold text-neutral-900">{title}</h2>
      <div className="text-[13px] leading-relaxed text-neutral-700">{children}</div>
    </section>
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

type Slide = { url: string; alt?: string };

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await client.fetch<Project | null>(projectBySlugQuery, { slug });
  if (!p) return notFound();

  // Build slides deterministically
  const slides: Slide[] = [];
  const pairs: Array<{ ref?: SanityImageRef; alt?: string }> = [
    { ref: p.image1, alt: p.image1Alt },
    { ref: p.image2, alt: p.image2Alt },
    { ref: p.image3, alt: p.image3Alt },
    { ref: p.image4, alt: p.image4Alt },
    { ref: p.image5, alt: p.image5Alt },
  ];
  for (const { ref, alt } of pairs) {
    const url = urlFor(ref);
    if (url) slides.push(alt ? { url, alt } : { url });
  }
  if (slides.length === 0 && p.imageUrl) slides.push({ url: p.imageUrl });

  return (
    <main className="bg-white">
      <div className="mx-auto w-full max-w-[1720px] px-4 pt-8 pb-10 sm:px-6 lg:px-14 lg:pt-12">
        {/* Title (projectName shown once) */}
        <header className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="text-[24px] font-semibold text-neutral-900 sm:text-[28px] lg:text-[32px]">
              {p.projectName}
            </h1>
          </div>
        </header>

        {/* Hero Carousel (alt caption only if provided) */}
        <section className="relative mt-5 lg:mt-7">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
              {slides.map((s, idx) => (
                <div
                  key={idx}
                  className="relative h-[232px] w-full flex-shrink-0 snap-center sm:h-[320px] lg:aspect-[21/9] lg:h-auto"
                >
                  <Image
                    src={s.url}
                    alt={s.alt ?? ''} // empty when CMS alt is missing
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1400px"
                    unoptimized
                  />
                  {s.alt && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-[12px] text-white sm:text-[13px]">
                      {s.alt}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Overview + one CTA (listingURL) */}
          <div className="lg:col-span-2 space-y-10">
            {p.description && (
              <Section title="Overview">
                <p className="whitespace-pre-line">{p.description}</p>
              </Section>
            )}
            <CtaButton href={p.listingURL}>View Listing</CtaButton>
          </div>

          {/* Key Facts – each field appears only here */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
            <Section title="Key Facts">
              <dl className="grid grid-cols-1 gap-3">
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <dt className="text-[12px] text-neutral-500">Location</dt>
                  <dd className="mt-1 text-[14px] font-medium text-neutral-900">{p.location || '-'}</dd>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <dt className="text-[12px] text-neutral-500">Property Type</dt>
                  <dd className="mt-1 text-[14px] font-medium text-neutral-900">{p.propertyType || '-'}</dd>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <dt className="text-[12px] text-neutral-500">Bedrooms</dt>
                  <dd className="mt-1 text-[14px] font-medium text-neutral-900">{p.bedrooms || '-'}</dd>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <dt className="text-[12px] text-neutral-500">Developer</dt>
                  <dd className="mt-1 text-[14px] font-medium text-neutral-900">{p.developer || '-'}</dd>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <dt className="text-[12px] text-neutral-500">Starting Price (AED)</dt>
                  <dd className="mt-1 text-[14px] font-medium text-neutral-900">
                    {currencyAED(p.startingPriceAED) || '-'}
                  </dd>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                  <dt className="text-[12px] text-neutral-500">Size Range (ft²)</dt>
                  <dd className="mt-1 text-[14px] font-medium text-neutral-900">{p.sizeRangeFt2 || '-'}</dd>
                </div>
              </dl>
            </Section>
          </aside>
        </div>
      </div>
    </main>
  );
}
