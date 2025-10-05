// src/components/TopProjectsStrip.tsx
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import { topProjectsByTileQuery } from '@/sanity/queries';
import { urlFor } from '@/sanity/lib/image';
import type { Project } from '@/types/project';
import type { Image as SanityImage } from 'sanity';

// Helper to get a usable image source + alt
function getPrimaryImage(p?: Project) {
  if (!p) return { src: '', alt: '' as string };

  const img = p.image1 ?? p.image2 ?? p.image3 ?? p.image4 ?? p.image5 ?? null;

  if (img) {
    const src = urlFor(img as SanityImage)
      .width(1920)
      .height(1080)
      .fit('crop')
      .auto('format')
      .url();

    const alt =
      (p.image1 && p.image1Alt) ||
      (p.image2 && p.image2Alt) ||
      (p.image3 && p.image3Alt) ||
      (p.image4 && p.image4Alt) ||
      (p.image5 && p.image5Alt) ||
      p.projectName ||
      'Project';
    return { src, alt };
  }

  return { src: p.imageUrl || '', alt: p.projectName || 'Project' };
}

export default async function TopProjectsStrip() {
  // Disable CDN here to avoid stale results when topTile changes
  const liveClient = client.withConfig({ useCdn: false });

  const data = await liveClient.fetch<{
    tile1?: Project;
    tile2?: Project;
    tile3?: Project;
    tile4?: Project;
  }>(topProjectsByTileQuery);

  const t1 = data.tile1;
  const t2 = data.tile2;
  const t3 = data.tile3;
  const t4 = data.tile4;

  const heroImg = getPrimaryImage(t1);
  const s2Img = getPrimaryImage(t2);
  const s3Img = getPrimaryImage(t3);
  const s4Img = getPrimaryImage(t4);

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-[1720px] px-6 pt-10 pb-10 sm:px-10 lg:px-14 lg:pb-14">
        {/* Top text */}
        <header className="mb-8 lg:mb-12">
          <h2 className="leading-tight tracking-normal text-neutral-900">
            <span className="block text-[18px] font-semibold text-[#2B3119] sm:text-[26px] md:text-[30px] lg:text-[42px] xl:text-[46px]">
              Founded in 1995, reimagined for today. With decades of expertise,
              we deliver
            </span>
            <span className="block text-[18px] font-normal text-neutral-900 sm:text-[26px] md:text-[30px] lg:text-[42px] xl:text-[46px]">
              measured decisions and lasting value.
            </span>
            <span className="block text-[18px] font-normal text-neutral-900 sm:text-[26px] md:text-[30px] lg:text-[42px] xl:text-[46px]">
              Real estate made simple — property made easy, solutions made
              clear.
            </span>
          </h2>
        </header>

        {/* ===== Mobile header (match image start by using the same -mx-3 bleed) ===== */}
        <div className="-mx-3 mb-4 sm:hidden">
          <h3 className="text-[20px] leading-snug font-semibold text-[#2B3119]">
            Top Projects To Invest
          </h3>
          <p className="mt-2 text-[14px] text-neutral-700">
            Premium Luxury Collection
          </p>
        </div>

        {/* ===== Mobile: 4 stacked rectangles ===== */}
        <div className="block sm:hidden">
          <div className="-mx-3 space-y-3">
            {[t1, t2, t3, t4].map((p, idx) => {
              const key = p?.slug ?? `tile-${idx + 1}`;
              const { src, alt } = getPrimaryImage(p);
              return (
                <figure
                  key={key}
                  className="relative h-[160px] w-full overflow-hidden"
                >
                  {/* Full-tile overlay link (only if project exists) */}
                  {p && (
                    <Link
                      href={`/projects/${p.slug}`}
                      aria-label={`View details for ${p.projectName}`}
                      className="absolute inset-0 z-10"
                    />
                  )}

                  {p && src ? (
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority={idx === 0}
                    />
                  ) : (
                    <div className="flex h-full w-full items-end bg-neutral-200 px-4 pb-3 text-neutral-600">
                      <span className="text-sm">No project selected</span>
                    </div>
                  )}
                  {p && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                  )}
                  {p && (
                    <figcaption className="absolute bottom-3 left-4 text-[16px] font-semibold tracking-tight text-white">
                      {p.projectName}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        </div>

        {/* ===== Tablet/Desktop layout ===== */}
        <div className="hidden sm:block">
          {/* Row 1: Tile 1 — wide hero */}
          <div className="grid grid-cols-1 items-center gap-10 xl:grid-cols-12">
            <div className="xl:col-span-3">
              <h3 className="text-[28px] font-semibold text-[#2B3119] sm:text-[32px]">
                Top Projects To Invest
              </h3>
              <p className="mt-4 max-w-[360px] text-[15px] text-neutral-700">
                Premium Luxury Collection
              </p>
            </div>

            <div className="xl:col-span-9">
              <figure className="relative h-[260px] w-full overflow-hidden rounded-none shadow-[0_8px_28px_rgba(0,0,0,0.10)]">
                {/* Full-tile overlay link */}
                {t1 && (
                  <Link
                    href={`/projects/${t1.slug}`}
                    aria-label={`View details for ${t1.projectName}`}
                    className="absolute inset-0 z-10"
                  />
                )}

                {t1 && heroImg.src ? (
                  <Image
                    src={heroImg.src}
                    alt={heroImg.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width:1280px) 70vw, 100vw"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-end bg-neutral-200 px-6 pb-5 text-neutral-600">
                    <span className="text-base">
                      No project selected for Tile 1
                    </span>
                  </div>
                )}
                {t1 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                )}
                {t1 && (
                  <figcaption className="absolute bottom-5 left-6 text-[22px] font-semibold tracking-tight text-white">
                    {t1.projectName}
                  </figcaption>
                )}
              </figure>
            </div>
          </div>

          {/* Row 2: Tiles 2,3,4 */}
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-8">
            {/* Tile 2 (wide) */}
            <figure className="relative h-[300px] w-full overflow-hidden rounded-none shadow-[0_8px_28px_rgba(0,0,0,0.10)] md:col-span-4">
              {/* Full-tile overlay link */}
              {t2 && (
                <Link
                  href={`/projects/${t2.slug}`}
                  aria-label={`View details for ${t2.projectName}`}
                  className="absolute inset-0 z-10"
                />
              )}

              {t2 && s2Img.src ? (
                <Image
                  src={s2Img.src}
                  alt={s2Img.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width:1024px) 50vw, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-end bg-neutral-200 px-6 pb-5 text-neutral-600">
                  <span className="text-base">
                    No project selected for Tile 2
                  </span>
                </div>
              )}
              {t2 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              )}
              {t2 && (
                <figcaption className="absolute bottom-5 left-6 text-[20px] font-semibold tracking-tight text-white">
                  {t2.projectName}
                </figcaption>
              )}
            </figure>

            {/* Tile 3 */}
            <figure className="relative h-[300px] w-full overflow-hidden rounded-none shadow-[0_8px_28px_rgba(0,0,0,0.10)] md:col-span-2">
              {/* Full-tile overlay link */}
              {t3 && (
                <Link
                  href={`/projects/${t3.slug}`}
                  aria-label={`View details for ${t3.projectName}`}
                  className="absolute inset-0 z-10"
                />
              )}

              {t3 && s3Img.src ? (
                <Image
                  src={s3Img.src}
                  alt={s3Img.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width:1024px) 25vw, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-end bg-neutral-200 px-6 pb-5 text-neutral-600">
                  <span className="text-base">
                    No project selected for Tile 3
                  </span>
                </div>
              )}
              {t3 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              )}
              {t3 && (
                <figcaption className="absolute bottom-5 left-6 text-[20px] font-semibold tracking-tight text-white">
                  {t3.projectName}
                </figcaption>
              )}
            </figure>

            {/* Tile 4 */}
            <figure className="relative h-[300px] w-full overflow-hidden rounded-none shadow-[0_8px_28px_rgba(0,0,0,0.10)] md:col-span-2">
              {/* Full-tile overlay link */}
              {t4 && (
                <Link
                  href={`/projects/${t4.slug}`}
                  aria-label={`View details for ${t4.projectName}`}
                  className="absolute inset-0 z-10"
                />
              )}

              {t4 && s4Img.src ? (
                <Image
                  src={s4Img.src}
                  alt={s4Img.alt}
                  fill
                  className="object-cover"
                  sizes="(min-width:1024px) 25vw, 100vw"
                />
              ) : (
                <div className="flex h-full w-full items-end bg-neutral-200 px-6 pb-5 text-neutral-600">
                  <span className="text-base">
                    No project selected for Tile 4
                  </span>
                </div>
              )}
              {t4 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              )}
              {t4 && (
                <figcaption className="absolute bottom-5 left-6 text-[20px] font-semibold tracking-tight text-white">
                  {t4.projectName}
                </figcaption>
              )}
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
