// src/components/MediaCarousel.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export type Slide = { url: string; alt?: string };

export default function MediaCarousel({ slides }: { slides: Slide[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  // Snap index on scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      if (w > 0) setIndex(Math.round(el.scrollLeft / w));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goto = (next: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, next));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' });
  };

  if (slides.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-neutral-200 shadow-sm">
      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        aria-roledescription="carousel"
        aria-label="Project media"
      >
        {slides.map((s, idx) => (
          <figure
            key={idx}
            className="relative h-[260px] w-full flex-shrink-0 snap-center sm:h-[360px] lg:aspect-[21/9] lg:h-auto"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${slides.length}`}
          >
            <Image
              src={s.url}
              alt={s.alt ?? ''}
              fill
              priority={idx === 0}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1400px"
              unoptimized
            />
            {/* Top polish gradient */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/10 to-transparent" />
            {/* Bottom caption only if CMS alt exists */}
            {s.alt && (
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-5 py-3 text-[12px] text-white sm:text-[13px]">
                {s.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => goto(index - 1)}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[14px] shadow ring-1 ring-black/10 hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => goto(index + 1)}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 text-[14px] shadow ring-1 ring-black/10 hover:bg-white"
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/45 px-2 py-1">
          <div className="pointer-events-auto flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goto(i)}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === index ? 'bg-white' : 'bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
