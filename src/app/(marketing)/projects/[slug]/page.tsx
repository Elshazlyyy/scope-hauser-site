import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { projectsQuery, projectBySlugQuery } from '@/sanity/queries'

type RouteParams = { params: { slug: string } }

type Project = {
  slug: string
  title: string
  location?: string
  imageUrl?: string
}

// ----- Static params for SSG -----
export async function generateStaticParams() {
  const projects = await client.fetch<Project[]>(projectsQuery)
  return projects
    .filter(p => !!p.slug)
    .map(p => ({ slug: p.slug }))
}

// (Optional) ISR — revalidate every 10 minutes
export const revalidate = 600

// ----- Dynamic <head> -----
export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const p = await client.fetch<Project | null>(projectBySlugQuery, { slug: params.slug })

  const DEFAULT_DESC =
    'Discover real estate investment opportunities and find your perfect place in the UAE.'

  return {
    title: p ? `${p.title} – Scope Hauser` : 'Project Details – Scope Hauser',
    description: p ? `${p.title}${p.location ? ` in ${p.location}` : ''}. ${DEFAULT_DESC}` : DEFAULT_DESC,
  }
}

// ----- Page -----
export default async function ProjectDetailPage({ params }: RouteParams) {
  const p = await client.fetch<Project | null>(projectBySlugQuery, { slug: params.slug })
  if (!p) return notFound()

  return (
    <main className="bg-white">
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
          {p.imageUrl ? (
            <Image
              src={p.imageUrl}
              alt={p.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1200px"
              unoptimized
            />
          ) : (
            <div className="h-full w-full bg-neutral-100" />
          )}
        </figure>

        {/* Content sections (placeholder until you add fields in schema) */}
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
                </p>
                <p>
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
  )
}
