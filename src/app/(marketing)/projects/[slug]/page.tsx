// src/app/(marketing)/projects/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { projectsQuery, projectBySlugQuery } from '@/sanity/queries';
import type { Project } from '@/types/project';

/**
 * Aligned with src/types/project.d.ts and src/sanity/queries.ts
 * Renders ALL fields from Project:
 * slug, projectName, imageUrl, location, propertyType, bedrooms,
 * developer, startingPriceAED, sizeRangeFt2, description, listingURL,
 * image1..image5 + image1Alt..image5Alt
 */

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

        {/* Hero */}
        <figure className="relative mt-5 h-[232px] w-full overflow-hidden rounded-2xl sm:h-[320px] lg:mt-7 lg:aspect-[21/9] lg:h-auto">
          {p.imageUrl ? (
            <Image
              src={p.imageUrl}
              alt={p.projectName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1400px"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
              No image available
            </div>
          )}
        </figure>

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
                <dt className="text-[12px] text-neutral-500">Slug</dt>
                <dd className="mt-1 text-[14px] font-medium text-neutral-900">
                  {p.slug || '-'}
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
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <dt className="text-[12px] text-neutral-500">Listing URL</dt>
                <dd className="mt-1 text-[14px] font-medium break-all text-neutral-900">
                  {p.listingURL ? (
                    <Link
                      href={p.listingURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-500"
                    >
                      {p.listingURL}
                    </Link>
                  ) : (
                    '-'
                  )}
                </dd>
              </div>
            </dl>
          </Section>

          {/* Media */}
          <Section title="Media">
            <p className="mb-3 text-[12px] text-neutral-500">
              Below shows the primary hero (from <code>imageUrl</code>) plus raw
              entries for Image1…Image5 with their alt text. The direct URLs for
              Image1…Image5 are not included by the current GROQ query; if you
              want thumbnails here, we can either add{' '}
              <code>{'asset->url'}</code> to the query or use the Sanity image
              URL builder.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {/* Image1 */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="text-[12px] text-neutral-500">Image1</div>
                <div className="mt-1 text-[13px]">
                  {p.image1?.asset?._ref || '—'}
                </div>
                <div className="mt-2 text-[12px] text-neutral-500">Alt</div>
                <div className="mt-1 text-[13px]">{p.image1Alt || '—'}</div>
              </div>
              {/* Image2 */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="text-[12px] text-neutral-500">Image2</div>
                <div className="mt-1 text-[13px]">
                  {p.image2?.asset?._ref || '—'}
                </div>
                <div className="mt-2 text-[12px] text-neutral-500">Alt</div>
                <div className="mt-1 text-[13px]">{p.image2Alt || '—'}</div>
              </div>
              {/* Image3 */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="text-[12px] text-neutral-500">Image3</div>
                <div className="mt-1 text-[13px]">
                  {p.image3?.asset?._ref || '—'}
                </div>
                <div className="mt-2 text-[12px] text-neutral-500">Alt</div>
                <div className="mt-1 text-[13px]">{p.image3Alt || '—'}</div>
              </div>
              {/* Image4 */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="text-[12px] text-neutral-500">Image4</div>
                <div className="mt-1 text-[13px]">
                  {p.image4?.asset?._ref || '—'}
                </div>
                <div className="mt-2 text-[12px] text-neutral-500">Alt</div>
                <div className="mt-1 text-[13px]">{p.image4Alt || '—'}</div>
              </div>
              {/* Image5 */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="text-[12px] text-neutral-500">Image5</div>
                <div className="mt-1 text-[13px]">
                  {p.image5?.asset?._ref || '—'}
                </div>
                <div className="mt-2 text-[12px] text-neutral-500">Alt</div>
                <div className="mt-1 text-[13px]">{p.image5Alt || '—'}</div>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
