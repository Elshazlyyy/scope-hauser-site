import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types/project'
import { Pin } from './icons'

export default function ProjectCarouselCard({ p }: { p: Project }) {
  const src = p.imageUrl || ''

  return (
    <article className="group relative h-full flex flex-col overflow-hidden rounded-none border border-black/5 bg-white shadow-[0_6px_30px_rgba(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-[#2B3119]/40">
      {/* Full-card link overlay */}
      <Link
        href={`/projects/${p.slug}`}
        prefetch
        aria-label={`View details for ${p.title}`}
        className="absolute inset-0 z-10 rounded-[2px] outline-none"
      />

      {/* Image */}
      <div className="relative w-full h-[180px] sm:h-[300px] flex-shrink-0">
        {src ? (
          <Image
            src={src}
            alt={p.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            sizes="(min-width:1280px) 33vw, (min-width:768px) 50vw, 100vw"
            priority
            unoptimized
          />
        ) : (
          <div className="h-full w-full bg-neutral-100" />
        )}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex-1">
        <h3 className="text-[16px] sm:text-[18px] font-semibold text-[#2B3119]">{p.title}</h3>

        <div className="mt-1.5 sm:mt-2 flex items-center gap-1.5 sm:gap-2 text-[13px] sm:text-[14px] text-neutral-600">
          <Pin className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="relative top-[0.5px] sm:top-[1px]">{p.location}</span>
        </div>
      </div>
    </article>
  )
}
