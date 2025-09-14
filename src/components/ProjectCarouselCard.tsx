import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/types/project';
import { Pin } from './icons';

export default function ProjectCarouselCard({ p }: { p: Project }) {
  const src = p.imageUrl || '';

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-none border border-black/5 bg-white shadow-[0_6px_30px_rgba(0,0,0,0.08)] focus-within:ring-2 focus-within:ring-[#2B3119]/40">
      {/* Full-card link overlay */}
      <Link
        href={`/projects/${p.slug}`}
        prefetch
        aria-label={`View details for ${p.title}`}
        className="absolute inset-0 z-10 rounded-[2px] outline-none"
      />

      {/* Image */}
      <div className="relative h-[180px] w-full flex-shrink-0 sm:h-[300px]">
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
      <div className="flex-1 p-4 sm:p-5">
        <h3 className="text-[16px] font-semibold text-[#2B3119] sm:text-[18px]">
          {p.title}
        </h3>

        <div className="mt-1.5 flex items-center gap-1.5 text-[13px] text-neutral-600 sm:mt-2 sm:gap-2 sm:text-[14px]">
          <Pin className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
          <span className="relative top-[0.5px] sm:top-[1px]">
            {p.location}
          </span>
        </div>
      </div>
    </article>
  );
}
