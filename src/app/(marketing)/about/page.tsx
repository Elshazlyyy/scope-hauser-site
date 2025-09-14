// src/app/(marketing)/about/page.tsx
import Image from 'next/image';
import ProjectsCarousel from '@/components/ProjectsCarousel';

const ABOUT_IMAGE = '/images/About.png'; // <-- one image for all three slices

const STATS = [
  { value: '400+', label: 'Property Ready' },
  { value: '30+', label: 'Years of Experience' },
  { value: '10,000+', label: 'Happy Customers' },
];

const INTRO_TEXT = (
  <>
    Welcome to Scope Hauser Founded in 1995 and reimagined for today, <br />
    Scope Hauser brings nearly three decades of expertise to every client <br />
    relationship. Our focus is simple: measured decisions that deliver lasting{' '}
    <br />
    value. Whether you’re buying, selling, or investing, we make real estate{' '}
    <br />
    straightforward — property made easy, solutions made clear.
  </>
);

const VISION_TEXT = (
  <>
    Our vision is to be the most trusted and forward-thinking real estate <br />
    partner in the region. <br />
    We aim to redefine property experiences through innovation, <br />
    professionalism, and decades of expertise — making ownership <br />
    accessible and stress-free. <br />
    <br />
    By evolving with the market while staying true to our values, we aspire to{' '}
    <br />
    create a future where real estate is seamless, clear, and fulfilling for
    all.
  </>
);

const MISSION_TEXT = (
  <>
    At Scope Hauser, our mission is to simplify real estate and deliver <br />
    lasting value. <br />
    Since 1995, we’ve guided clients with clarity, transparency, and trust{' '}
    <br />
    — making every step, from buying to investing, straightforward and <br />
    rewarding. <br />
    <br />
    We are committed to building relationships based on integrity and <br />
    expertise, turning complex property decisions into confident choices.
  </>
);

export default function AboutPage() {
  return (
    <>
      {/* Intro + stats (slice 1: top of the image) */}
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

            {/* Right image slice #1 */}
            <div className="lg:col-span-7 lg:justify-self-end">
              <figure className="relative h-[200px] w-full overflow-hidden sm:h-[240px] lg:h-[300px] lg:w-[747px]">
                <Image
                  src={ABOUT_IMAGE}
                  alt="About hero"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 15%' }} // top slice
                  sizes="(max-width: 1024px) 100vw, 747px"
                  priority
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision (slice 2: middle of the image) */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1720px] px-4 py-4 sm:px-6 lg:px-14 lg:py-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-[20px] font-semibold text-neutral-900 sm:text-2xl md:text-3xl">
                Our Vision
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-neutral-600 sm:text-[15px]">
                {VISION_TEXT}
              </p>
            </div>

            {/* Image slice #2 */}
            <div className="lg:col-span-7 lg:justify-self-end">
              <figure className="relative h-[200px] w-full overflow-hidden sm:h-[240px] lg:h-[300px] lg:w-[747px]">
                <Image
                  src={ABOUT_IMAGE}
                  alt="About hero"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 50%' }} // middle slice
                  sizes="(max-width: 1024px) 100vw, 747px"
                />
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission (slice 3: bottom of the image) */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1720px] px-4 py-4 sm:px-6 lg:px-14 lg:py-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <h2 className="text-[20px] font-semibold text-neutral-900 sm:text-2xl md:text-3xl">
                Our Mission
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-neutral-600 sm:text-[15px]">
                {MISSION_TEXT}
              </p>
            </div>

            {/* Image slice #3 */}
            <div className="lg:col-span-7 lg:justify-self-end">
              <figure className="relative h-[200px] w-full overflow-hidden sm:h-[240px] lg:h-[300px] lg:w-[747px]">
                <Image
                  src={ABOUT_IMAGE}
                  alt="About hero"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 85%' }} // bottom slice
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
