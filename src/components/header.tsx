"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from "@/components/icons";
import { profile } from "@/content/portfolio";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Experience", href: "/experience/" },
  { label: "Education", href: "/education/" },
  { label: "Skills", href: "/skills/" },
  { label: "Projects", href: "/projects/" },
  { label: "Explore", href: "/explore/" },
  { label: "Contact", href: "/contact/" },
];

function isCurrentPath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleTheme() {
    const root = document.documentElement;
    const nextTheme = root.classList.contains("dark") ? "light" : "dark";
    root.classList.toggle("dark", nextTheme === "dark");
    root.style.colorScheme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--background-elevated)]/92 backdrop-blur-xl">
      <div className="site-container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
          aria-label={`${profile.shortName} — ${profile.name}, home`}
          data-analytics="nav-logo"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid size-8 place-items-center rounded-full bg-[var(--ink)] text-[10px] font-semibold tracking-[0.08em] text-[var(--paper)] transition-transform group-hover:-rotate-6">
            {profile.shortName}
          </span>
          <span className="hidden text-sm font-medium tracking-[-0.01em] sm:inline">{profile.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary navigation" data-testid="desktop-navigation">
          {navigation.map((item) => {
            const current = isCurrentPath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className="nav-link"
                data-analytics={`nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button type="button" className="icon-button" onClick={toggleTheme} aria-label="Toggle color theme" data-testid="theme-toggle">
            <SunIcon className="theme-icon theme-icon--sun size-[18px]" />
            <MoonIcon className="theme-icon theme-icon--moon size-[18px]" />
          </button>
          <button
            type="button"
            className="icon-button lg:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            data-testid="menu-toggle"
          >
            {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="mobile-navigation" className="mobile-nav lg:hidden" aria-label="Mobile navigation" data-testid="mobile-navigation">
          <div className="site-container grid py-4">
            {navigation.map((item, index) => {
              const current = isCurrentPath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className="flex items-center justify-between border-b border-[var(--line)] py-3.5 text-base font-medium last:border-0"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-[10px] text-[var(--muted)]">0{index + 1}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
