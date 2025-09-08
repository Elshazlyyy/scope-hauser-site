// src/components/Hero.tsx
'use client';

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);

  // Only auto-fit to one line on large screens; mobile stays multi-line.
  useLayoutEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const wrap = wrapRef.current;
    const h1 = h1Ref.current;
    if (!wrap || !h1) return;

    const fit = () => {
      if (!mql.matches) {
        h1.style.whiteSpace = 'normal';
        h1.style.fontSize = '';
        return;
      }

      const MIN = 36;
      const MAX = 120;
      h1.style.whiteSpace = 'nowrap';

      let lo = MIN,
        hi = MAX,
        best = MIN;
      while (lo <= hi) {
        const mid = (lo + hi) / 2;
        h1.style.fontSize = `${mid}px`;
        const fits = h1.scrollWidth <= (wrap?.clientWidth ?? 0);
        if (fits) {
          best = mid;
          lo = mid + 0.5;
        } else {
          hi = mid - 0.5;
        }
      }
      h1.style.fontSize = `${best}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    const onResize = () => fit();
    window.addEventListener('resize', onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <section aria-label="Intro" className="relative overflow-hidden">
      {/* Background image */}
      <div className="relative h-[78vh] min-h-[540px] w-full">
        <Image
          src="/images/hero.jpg"
          alt="Scope Hauser hero"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        {/* Overlays */}
        {/* Mobile: full dark overlay */}
        <div className="pointer-events-none absolute inset-0 bg-black/40 lg:hidden" />

        {/* Desktop: vertical gradient + diagonal wedge (lighter and moved right) */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-black/25 lg:block"
          style={{
            clipPath: 'polygon(0% 0%, 50% 0%, 100% 100%, 0% 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0.02) 95%, rgba(0,0,0,0) 100%)',
            maskImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.1) 85%, rgba(0,0,0,0.02) 95%, rgba(0,0,0,0) 100%)',
          }}
        />
      </div>

      {/* Copy block */}
      <div className="absolute inset-0">
        <div className="mx-auto h-full w-full max-w-[1720px] px-5 sm:px-8 lg:px-14">
          <div className="flex h-full flex-col justify-center">
            <div ref={wrapRef} className="w-full max-w-none pt-4 sm:pt-6 lg:pt-0">
              <h1
                ref={h1Ref}
                className="text-[28px] leading-tight font-extrabold tracking-tight text-white sm:text-[34px] md:text-[40px] lg:leading-[1.05]"
              >
                <span className="whitespace-nowrap">Building futures, one</span>
                <br className="block lg:hidden" /> property at a time.
              </h1>
            </div>

            {/* Paragraphs */}
            <p className="mt-5 text-[16px] text-white/90 sm:text-[18px] md:text-[22px] lg:hidden">
              perfect place in the UAE
            </p>
            <p className="mt-5 hidden max-w-[780px] text-[16px] text-white/90 sm:text-[18px] md:text-[22px] lg:block">
              Discover real estate investment opportunities and find your
              <br />
              perfect place in the UAE
            </p>

            <div className="mt-4 sm:mt-5">
              <Link
                href="/projects"
                className="inline-flex h-[36px] items-center justify-center rounded-[8px] border border-white/40 bg-white/25 px-4 text-[13px] font-medium text-white backdrop-blur hover:border-white/60 hover:bg-white/35"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
