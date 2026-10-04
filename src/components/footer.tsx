import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { profile } from "@/content/portfolio";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] sm:mt-20">
      <div className="site-container py-10 sm:py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <div>
            <p className="eyebrow">Have a problem worth solving?</p>
            <Link href="/contact/" className="mt-4 inline-flex max-w-xl items-end gap-3 font-serif text-3xl leading-tight tracking-[-0.035em] hover:text-[var(--accent)] sm:text-5xl">
              Let&apos;s build something useful.
              <ArrowUpRightIcon className="mb-1 size-7 shrink-0 sm:size-9" />
            </Link>
          </div>
          <div className="md:text-right">
            <a className="text-sm underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--accent)]" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
              {profile.socials.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" className="text-xs text-[var(--muted)] hover:text-[var(--ink)]">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-[var(--line)] pt-5 text-[11px] tracking-[0.06em] text-[var(--muted)] uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p>Designed with restraint. Built for the web.</p>
        </div>
      </div>
    </footer>
  );
}
