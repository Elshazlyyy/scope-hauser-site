'use client'

import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import ProjectCarouselCard from './ProjectCarouselCard'
import { ChevronLeft, ChevronRight } from './icons'
import styles from './ProjectsCarousel.module.css'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import type { Project } from '@/types/project'

const PROJECTS_QUERY = groq/* groq */ `
  *[_type == "project"] | order(title asc) {
    "slug": slug.current,
    title,
    location,
    "imageUrl": image.asset->url
  }
`

export default function ProjectsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: false,
    containScroll: 'trimSnaps',
    dragFree: true,
    slidesToScroll: 1,
  })

  const [prevDisabled, setPrevDisabled] = useState(true)
  const [nextDisabled, setNextDisabled] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setPrevDisabled(!emblaApi.canScrollPrev())
    setNextDisabled(!emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const rows = await client.fetch<Project[]>(PROJECTS_QUERY)
        if (!active) return
        setProjects(rows.filter(p => !!p.slug && !!p.title))
      } catch (e) {
        console.error('[ProjectsCarousel] fetch failed', e)
      }
    })()
    return () => { active = false }
  }, [])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="bg-[#F5F1EC]">
      <div className="mx-auto w-full max-w-[1720px] px-6 py-16 sm:px-10 lg:px-14 lg:py-20">
        <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-12">
          {/* ===== Mobile Heading + CTA before carousel ===== */}
          <div className="block sm:hidden mb-6">
            <h2 className="text-[28px] font-semibold text-neutral-900">Top Projects to invest</h2>
            <p className="mt-2 text-neutral-700 text-[15px]">simply dummy text of the printing and typesetting</p>
            <Link
              href="/projects"
              prefetch
              className="mt-4 inline-flex h-11 w-[150px] items-center justify-center rounded-md bg-[#2B3119] text-sm font-medium text-white shadow-sm transition hover:opacity-90"
              aria-label="View all projects"
            >
              View all
            </Link>
          </div>

          {/* Left: carousel track */}
          <div className="xl:col-span-9">
            {/* Mobile vertical scroll */}
            <div className="block sm:hidden">
              <div className={`h-screen overflow-y-auto snap-y snap-mandatory space-y-4 ${styles['hide-scrollbar']}`}>
                {projects.map((p) => (
                  <div key={p.slug} className="h-1/3 snap-start">
                    <ProjectCarouselCard p={p} />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop/Tablet horizontal carousel */}
            <div className="hidden sm:block overflow-hidden" ref={emblaRef}>
              <div className="flex select-none touch-pan-y gap-8">
                {projects.map((p) => (
                  <div key={p.slug} className="min-w-[280px] shrink-0 sm:min-w-[320px] lg:min-w-[360px]">
                    <ProjectCarouselCard p={p} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Desktop/Tablet Aside ===== */}
          <aside className="hidden sm:block xl:col-span-3">
            <h2 className="text-[32px] font-semibold text-neutral-900 sm:text-[36px]">Our Projects</h2>
            <p className="mt-3 text-neutral-700">
              simply dummy text of the <br />
              printing and typesetting
            </p>

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={scrollPrev}
                aria-label="Previous"
                disabled={prevDisabled}
                className={[
                  'grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_8px_22px_rgba(0,0,0,0.12)] transition',
                  prevDisabled ? 'cursor-not-allowed opacity-40' : 'hover:scale-[1.02]',
                ].join(' ')}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next"
                disabled={nextDisabled}
                className={[
                  'grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_8px_22px_rgba(0,0,0,0.12)] transition',
                  nextDisabled ? 'cursor-not-allowed opacity-40' : 'hover:scale-[1.02]',
                ].join(' ')}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <Link
              href="/projects"
              prefetch
              className="mt-6 inline-flex h-11 w-[150px] items-center justify-center rounded-md bg-[#2B3119] text-sm font-medium text-white shadow-sm transition hover:opacity-90"
              aria-label="View all projects"
            >
              View all
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
