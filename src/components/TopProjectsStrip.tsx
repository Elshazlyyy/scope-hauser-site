// src/components/TopProjectsStrip.tsx
import Image from 'next/image';

const IMAGES = {
  hero: { src: '/images/difc.jpg', label: 'DIFC' },
  jlt: { src: '/images/jlt.jpg', label: 'Jumeirah Lake Tower' },
  studioCity: { src: '/images/studio-city.jpg', label: 'Studio City' },
  mediaCity: { src: '/images/media-city.jpg', label: 'Media City' },
};

export default function TopProjectsStrip() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1720px] px-6 pt-10 pb-10 sm:px-10 lg:px-14 lg:pb-14">
        {/* Top text */}
        <header className="mb-8 lg:mb-12">
          <h2 className="leading-tight tracking-normal text-neutral-900">
            {/* Line 1 */}
            <span className="block text-[18px] font-semibold text-[#2B3119] sm:text-[26px] md:text-[30px] lg:text-[42px] xl:text-[46px]">
              Founded in 1995, reimagined for today. With decades of expertise,
              we deliver
            </span>

            {/* Line 2 */}
            <span className="block text-[18px] font-normal text-neutral-900 sm:text-[26px] md:text-[30px] lg:text-[42px] xl:text-[46px]">
              measured decisions and lasting value.
            </span>

            {/* Line 3 */}
            <span className="block text-[18px] font-normal text-neutral-900 sm:text-[26px] md:text-[30px] lg:text-[42px] xl:text-[46px]">
              Real estate made simple — property made easy, solutions made
              clear.
            </span>
          </h2>
        </header>

        {/* ===== Mobile-only gallery: 4 equal rectangles, short height, slight inset, no rounding ===== */}
        <div className="block sm:hidden">
          <div className="-mx-3 space-y-3">
            {[IMAGES.hero, IMAGES.jlt, IMAGES.studioCity, IMAGES.mediaCity].map(
              (img) => (
                <figure
                  key={img.label}
                  className="relative h-[160px] w-full overflow-hidden"
                >
                  <Image
                    src={img.src}
                    alt={img.label}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority={img.label === 'DIFC'}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  <figcaption className="absolute bottom-3 left-4 text-[16px] font-semibold tracking-tight text-white">
                    {img.label}
                  </figcaption>
                </figure>
              ),
            )}
          </div>
        </div>

        {/* ===== Tablet/Desktop layout (your original grids) ===== */}
        <div className="hidden sm:block">
          {/* Row 1: DIFC */}
          <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-12">
            <div className="xl:col-span-3">
              <h3 className="text-[28px] font-semibold text-[#2B3119] sm:text-[32px]">
                Top Projects To
                <br />
                Invest
              </h3>
              <p className="mt-4 max-w-[360px] text-[15px] text-neutral-700">
                simply dummy text of the
                <br />
                printing and typesetting ind
              </p>
            </div>

            <div className="xl:col-span-9">
              <figure className="relative h-[260px] w-full overflow-hidden rounded-none shadow-[0_8px_28px_rgba(0,0,0,0.10)]">
                <Image
                  src={IMAGES.hero.src}
                  alt={IMAGES.hero.label}
                  fill
                  className="object-cover"
                  sizes="(min-width:1280px) 70vw, 100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <figcaption className="absolute bottom-5 left-6 text-[22px] font-semibold tracking-tight text-white">
                  {IMAGES.hero.label}
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Row 2: JLT wider, Studio/Media equal widths */}
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-8">
            {/* JLT */}
            <figure className="relative h-[300px] w-full overflow-hidden rounded-none shadow-[0_8px_28px_rgba(0,0,0,0.10)] md:col-span-4">
              <Image
                src={IMAGES.jlt.src}
                alt={IMAGES.jlt.label}
                fill
                className="object-cover"
                sizes="(min-width:1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <figcaption className="absolute bottom-5 left-6 text-[20px] font-semibold tracking-tight text-white">
                {IMAGES.jlt.label}
              </figcaption>
            </figure>

            {/* Studio City */}
            <figure className="relative h-[300px] w-full overflow-hidden rounded-none shadow-[0_8px_28px_rgba(0,0,0,0.10)] md:col-span-2">
              <Image
                src={IMAGES.studioCity.src}
                alt={IMAGES.studioCity.label}
                fill
                className="object-cover"
                sizes="(min-width:1024px) 25vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <figcaption className="absolute bottom-5 left-6 text-[20px] font-semibold tracking-tight text-white">
                {IMAGES.studioCity.label}
              </figcaption>
            </figure>

            {/* Media City */}
            <figure className="relative h-[300px] w-full overflow-hidden rounded-none shadow-[0_8px_28px_rgba(0,0,0,0.10)] md:col-span-2">
              <Image
                src={IMAGES.mediaCity.src}
                alt={IMAGES.mediaCity.label}
                fill
                className="object-cover"
                sizes="(min-width:1024px) 25vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <figcaption className="absolute bottom-5 left-6 text-[20px] font-semibold tracking-tight text-white">
                {IMAGES.mediaCity.label}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
