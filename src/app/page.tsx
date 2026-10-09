import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { ArrowRightIcon, ArrowUpRightIcon, DownloadIcon } from "@/components/icons";
import { profile } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Software Engineer",
  description: profile.seo.description,
  alternates: { canonical: "/" },
};

// Keep the section content available until it is ready to publish again.
const SHOW_HOW_I_WORK = false;

export default function HomePage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: profile.siteUrl,
    image: `${profile.siteUrl}${profile.portrait}`,
    jobTitle: "Software Engineer",
    email: `mailto:${profile.email}`,
    sameAs: profile.socials.map((social) => social.href),
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "University of Utah" },
      { "@type": "CollegeOrUniversity", name: "B.M.S. College of Engineering" },
    ],
    knowsAbout: ["Backend engineering", "Distributed systems", "Full-stack development", "Applied artificial intelligence"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }}
      />

      <section className="site-container pt-12 sm:pt-16 lg:pt-20">
        <div className="grid gap-10 border-b border-[var(--line)] pb-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16 lg:pb-14">
          <div>
            <p className="eyebrow">Software Engineer</p>
            <h1 className="hero-title mt-4">Avishek Choudhury</h1>
            <div className="mt-6 max-w-3xl space-y-5 text-[0.95rem] leading-7 text-[var(--muted)]">
              {profile.homeNarrative.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>
                  {paragraph.map((segment, segmentIndex) =>
                    segment.href ? (
                      <a
                        key={`${paragraphIndex}-${segmentIndex}`}
                        href={segment.href}
                        target="_blank"
                        rel="noreferrer"
                        className="border-b border-[var(--line-strong)] font-medium text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        {segment.text}
                      </a>
                    ) : (
                      <span key={`${paragraphIndex}-${segmentIndex}`}>{segment.text}</span>
                    ),
                  )}
                </p>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/projects/" className="button button--primary" data-analytics="hero-projects">
                View projects <ArrowRightIcon className="size-4" />
              </Link>
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  className="button button--secondary"
                  download="Avishek-Choudhury-Resume.pdf"
                  data-analytics="hero-resume"
                >
                  <DownloadIcon className="size-4" /> Download résumé
                </a>
              ) : null}
              <Link href="/contact/" className="button button--secondary" data-analytics="hero-contact">
                Contact
              </Link>
            </div>
          </div>

          <aside className="w-full max-w-[18rem] self-start border border-[var(--line)] p-4" aria-label="Profile">
            <Image
              src={profile.portrait}
              alt={`Portrait of ${profile.name}`}
              width={256}
              height={256}
              priority
              sizes="(min-width: 1024px) 256px, 160px"
              className="aspect-square w-full object-cover object-[center_28%] grayscale-[8%]"
            />
            <div className="border-t border-[var(--line)] pt-4">
              <p className="font-medium">{profile.name}</p>
              <p className="mt-1 text-sm leading-5 text-[var(--muted)]">{profile.location}</p>
            </div>
          </aside>
        </div>

      </section>

      <section className="site-container section-block">
        <div className="grid gap-7 border-y border-[var(--line)] py-8 sm:py-10 lg:grid-cols-[0.65fr_1.35fr] lg:gap-14">
          <div>
            <p className="eyebrow">About</p>
            <h2 className="section-title mt-3">A little about me</h2>
          </div>
          <div>
            {profile.biography.map((paragraph, index) => (
              <p key={paragraph} className={`${index ? "mt-5" : ""} max-w-2xl text-base leading-7 text-[var(--muted)]`}>
                {paragraph}
              </p>
            ))}
            <div className="mt-6">
              <Link href="/explore/" className="text-link">
                Outside of work <ArrowUpRightIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {SHOW_HOW_I_WORK ? (
        <section className="site-container section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Approach</p>
              <h2 className="section-title mt-3">How I work</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
              Good engineering starts with shared context and ends with software that people can confidently use, operate, and improve.
            </p>
          </div>
          <ol className="mt-7 grid border-t border-l border-[var(--line)] md:grid-cols-3">
            {profile.workPrinciples.map((principle, index) => (
              <li key={principle.title} className="border-r border-b border-[var(--line)] p-5 sm:p-6">
                <span className="font-mono text-[10px] text-[var(--accent)]">0{index + 1}</span>
                <h3 className="mt-5 font-serif text-2xl tracking-[-0.025em]">{principle.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{principle.description}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      <Footer />
    </>
  );
}
