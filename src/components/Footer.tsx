// src/components/Footer.tsx
import Link from "next/link";
import LogoWordmark from "./LogoWordmark";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { SITE } from "@/config/site";

/* Proper LinkedIn brand icon (solid with top bar on the "n") */
function LinkedinBrandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 448 512" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8 0 24.1 24.09-.5 53.79-.5c29.7 0 53.79 24.6 53.79 54.3 0 29.7-24.1 53.8-53.79 53.8zM447.9 448h-92.4V302.4c0-34.7-12.4-58.3-43.4-58.3-23.7 0-37.8 16-44 31.4-2.3 5.6-2.9 13.4-2.9 21.2V448h-92.4s1.2-268.4 0-296.1h92.4v41.9c12.3-19 34.2-46.2 83.3-46.2 60.9 0 106.9 39.8 106.9 125.2V448z"
      />
    </svg>
  );
}

export default function Footer() {
  const telHref = `tel:${SITE.phone.replace(/\s+/g, "")}`;
  const mailHref = `mailto:${SITE.email}`;

  return (
    <footer className="bg-[#2B3119] text-[#F1F0E6]">
      <div className="mx-auto w-full max-w-[1720px] px-5 sm:px-8 lg:px-14 pt-10 lg:pt-18">
        {/* ===== Top area ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* Left: logo + blurb (desktop also includes socials here) */}
          <div className="lg:col-span-6 order-1">
            <LogoWordmark className="h-[28px] sm:h-[32px]" />
            <p className="mt-5 max-w-[680px] text-[13px] sm:text-[14px] text-[#ECEADF] leading-[1.15]">
              <span className="block">simply dummy text of the printing and</span>
              <span className="block">typesetting ind simply dummy text of the</span>
              <span className="block">printing and typesetting ind</span>
            </p>

            {/* Desktop only: Follow for more */}
            <div className="mt-6 hidden lg:block">
              <h4 className="text-[18px] font-semibold">Follow for more</h4>
              <div className="mt-3.5 flex items-center gap-6 text-white">
                {SITE.socials?.facebook && (
                  <a
                    aria-label="Facebook"
                    href={SITE.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-90"
                  >
                    <Facebook className="h-6 w-6" stroke="none" fill="currentColor" />
                  </a>
                )}
                {SITE.socials?.instagram && (
                  <a
                    aria-label="Instagram"
                    href={SITE.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-90"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {SITE.socials?.linkedin && (
                  <a
                    aria-label="LinkedIn"
                    href={SITE.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-90"
                  >
                    <LinkedinBrandIcon className="h-6 w-6" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: nav + contact */}
          <div className="order-2 lg:col-span-6 lg:flex lg:justify-end lg:gap-14 mt-8 lg:mt-0">
            <div className="space-y-8 lg:space-y-0 lg:flex lg:gap-14">
              <div>
                <h4 className="text-[18px] font-semibold">
                  <Link href="/" className="hover:opacity-90">Home</Link>
                </h4>
              </div>
              <div className="mt-8 lg:mt-0">
                <h4 className="text-[18px] font-semibold">
                  <Link href="/about" className="hover:opacity-90">About us</Link>
                </h4>
              </div>
              <div className="mt-8 lg:mt-0">
                <h4 className="text-[18px] font-semibold">
                  <Link href="/projects" className="hover:opacity-90">Our Projects</Link>
                </h4>
              </div>
              <div className="mt-8 lg:mt-0">
                <h4 className="text-[18px] font-semibold">Contact us</h4>
                <ul className="mt-3.5 space-y-3.5 text-[14px]">
                  <li className="flex items-center gap-2.5">
                    <Phone className="h-5 w-5 shrink-0" />
                    <a href={telHref} className="hover:underline underline-offset-4">{SITE.phone}</a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-5 w-5 shrink-0" />
                    <a href={mailHref} className="hover:underline underline-offset-4">{SITE.email}</a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <MapPin className="h-5 w-5 shrink-0" />
                    <span>{SITE.address}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile only: Follow for more (below Contact us) */}
          <div className="order-3 mt-8 lg:hidden">
            <h4 className="text-[18px] font-semibold">Follow for more</h4>
            <div className="mt-3.5 flex items-center gap-6 text-white">
              {SITE.socials?.facebook && (
                <a
                  aria-label="Facebook"
                  href={SITE.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90"
                >
                  <Facebook className="h-6 w-6" stroke="none" fill="currentColor" />
                </a>
              )}
              {SITE.socials?.instagram && (
                <a
                  aria-label="Instagram"
                  href={SITE.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {SITE.socials?.linkedin && (
                <a
                  aria-label="LinkedIn"
                  href={SITE.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-90"
                >
                  <LinkedinBrandIcon className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-8 border-t border-white/20" />

        {/* Bottom row */}
        <div className="py-4 flex flex-col items-center justify-center gap-2.5 text-[12px] text-[#E6E3D7] md:flex-row md:items-center md:justify-between">
          <div className="order-1 md:order-2 flex items-center gap-6 text-center md:text-left">
            <Link href="/privacy" className="hover:opacity-90">Privacy Policy</Link>
            <Link href="/terms" className="hover:opacity-90">Terms and Conditions</Link>
          </div>
          <div className="order-2 md:order-1 text-center md:text-left">
            Copyright © {new Date().getFullYear()} Scope Hauser. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
