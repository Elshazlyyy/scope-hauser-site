'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import { useModal } from '@/context/ModalContext';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openRegister } = useModal();

  useLockBodyScroll(mobileOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const transparent = isHome && !scrolled;

  const navBase =
    'fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300';
  const navColors = transparent
    ? 'bg-transparent text-white'
    : 'bg-white/95 text-[#2B3119] border-b border-black/5 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About us' },
    { href: '/projects', label: 'Our Projects' },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      <nav className={`${navBase} ${navColors}`}>
        <div className="mx-auto flex h-full max-w-[1720px] items-center px-6 sm:px-10 lg:px-14">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Scope Hauser — Home"
            className="flex items-center"
            onClick={() => setMobileOpen(false)}
          >
            <Logo className="h-6 w-auto sm:h-7" /> {/* 👈 smaller on mobile */}
          </Link>

          {/* Desktop links */}
          <ul className="ml-16 hidden items-center gap-16 text-[13px] md:flex">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`transition-colors ${
                    isActive(item.href) ? 'font-semibold' : ''
                  } ${transparent ? 'hover:text-white/80' : 'hover:text-neutral-700'}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Register (desktop) */}
          <div className="ml-auto hidden md:block">
            <button
              onClick={openRegister}
              className="inline-flex h-8 items-center justify-center rounded-md bg-[#2B3119] px-3 text-[12px] font-medium text-white shadow-sm ring-[#2B3119]/30 transition outline-none hover:opacity-90 focus-visible:ring-2"
            >
              Register
            </button>
          </div>

          {/* Hamburger (mobile) */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(true)}
            className="ml-auto inline-flex items-center justify-center md:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-6 rounded bg-current" />
              <span className="block h-0.5 w-6 rounded bg-current" />
              <span className="block h-0.5 w-[18px] rounded bg-current" />
            </span>
          </button>
        </div>
      </nav>

      {!transparent && <div className="h-16" aria-hidden="true" />}

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] md:hidden"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#2B3119]" />

          {/* Top bar with close (left) + logo (center) */}
          <div className="relative z-[61] grid h-16 grid-cols-3 items-center px-5">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="justify-self-start text-3xl leading-none text-white/90"
            >
              ×
            </button>

            <Link
              href="/"
              aria-label="Scope Hauser — Home"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-self-center"
            >
              <Logo className="h-6 w-auto text-white sm:h-7" />{' '}
              {/* 👈 smaller on mobile */}
            </Link>

            <div className="justify-self-end" />
          </div>

          {/* Menu items, positioned 25% down */}
          <div className="relative z-[61] flex flex-col items-center justify-start pt-[25vh] text-white">
            <ul className="flex flex-col items-center justify-center gap-8 text-[18px]">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="hover:opacity-80"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Register bar */}
          <div className="absolute right-0 bottom-6 left-0 z-[61] px-5">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openRegister();
              }}
              className="block h-11 w-full rounded-[10px] bg-white/20 font-semibold tracking-wide text-white transition hover:bg-white/25"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </>
  );
}
