// src/app/(marketing)/about/page.tsx
import Image from 'next/image';
import ProjectsCarousel from '@/components/ProjectsCarousel';

const STATS = [
  { value: '400+', label: 'Property Ready' },
  { value: '30+', label: 'Years of Experience' },
  { value: '10,000+', label: 'Happy Customers' },
];

const INTRO_TEXT = (
  <>
    Discover real estate investment <br />
    opportunities and find your
  </>
);

const VISION_TEXT = (
  <>
    Discover real estate investment opportunities and find your Discover real
    estate investment opportunities and find your <br />
    Discover real estate investment opportunities and find your Discover real
    estate investment opportunities and find your Discover real estate
    investment opportunities and find your Discover real &nbsp; Discover real
    estate investment opportunities and find your Discover real estate
    investment opportunities and find your <br />
  </>
);

const MISSION_TEXT = VISION_TEXT;

export default function AboutPage() {
  return (
    <>
      {/* Intro + stats */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1720px] px-4 py-4 sm:px-6 lg:px-14 lg:py-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left copy */}
            <div className="lg:col-span-5">
              <h1 className="text-[22px] font-semibold text-neutral-900 sm:text-3xl md:text-4xl">
                Bring your Family
                <span className="block">Happiness on your Dream</span>
              </h1>

              <p className="mt-3 max-w-[540px] text-[14px] text-neutral-600">
                {INTRO_TEXT}
              </p>

              <dl className="mt-6 grid grid-cols-3 gap-4 sm:gap-6">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="text-xl font-semibold text-neutral-900 sm:text-2xl">
                      {s.value}
                    </dd>
                    <div className="mt-1 text-[11px] text-neutral-500 sm:text-xs">
                      {s.label}
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Right image */}
            <div className="lg:col-span-7 lg:justify-self-end">
              <figure className="relative h-[200px] w-full overflow-hidden sm:h-[240px] lg:h-[300px] lg:w-[747px]">
                <Image
                  src="/images/media-city.jpg"
                  alt="Resort pool and skyline"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 747px"
                  priority
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1720px] px-4 py-4 sm:px-6 lg:px-14 lg:py-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-[20px] font-semibold text-neutral-900 sm:text-2xl md:text-3xl">
                Our Vision
              </h2>
              <p className="mt-3 leading-relaxed text-[14px] text-neutral-600 sm:text-[15px]">
                {VISION_TEXT}
              </p>
            </div>

            <div className="lg:col-span-7 lg:justify-self-end">
              <figure className="relative h-[200px] w-full overflow-hidden sm:h-[240px] lg:h-[300px] lg:w-[747px]">
                <Image
                  src="/images/jlt.jpg"
                  alt="City skyline"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 747px"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1720px] px-4 py-4 sm:px-6 lg:px-14 lg:py-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-[20px] font-semibold text-neutral-900 sm:text-2xl md:text-3xl">
                Our Mission
              </h2>
              <p className="mt-3 leading-relaxed text-[14px] text-neutral-600 sm:text-[15px]">
                {MISSION_TEXT}
              </p>
            </div>

            <div className="lg:col-span-7 lg:justify-self-end">
              <figure className="relative h-[200px] w-full overflow-hidden sm:h-[240px] lg:h-[300px] lg:w-[747px]">
                <Image
                  src="/images/studio-city.jpg"
                  alt="Waterfront architecture"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 747px"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <ProjectsCarousel />
    </>
  );
}
