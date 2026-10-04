import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { formatDateRange, sortExperience, toAnalyticsId } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Experience",
  description: "Healthcare engineering, enterprise software, research, and teaching experience from Avishek Choudhury.",
  alternates: { canonical: "/experience/" },
};

export default function ExperiencePage() {
  const items = sortExperience();

  return (
    <>
      <PageIntro
        eyebrow="Experience"
        index="02 / 06"
        title="Experience"
        description="Healthcare engineering, enterprise software, applied AI research, and computer-science education. Listed newest first."
      />
      <section className="site-container mt-16 sm:mt-24">
        <ol className="space-y-20">
          {items.map((item, index) => (
            <li
              key={`${item.company}-${item.role}`}
              className="timeline-item grid gap-8 lg:grid-cols-[0.38fr_1fr] lg:gap-16"
              data-track-section="experience"
              data-track-id={toAnalyticsId(`${item.company}-${item.role}`)}
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-[var(--accent)]">0{index + 1}</span>
                  <span className="h-px flex-1 bg-[var(--line)]" />
                </div>
                <p className="mt-5 font-mono text-xs leading-5 text-[var(--muted)]">{formatDateRange(item.startDate, item.endDate, item.current)}</p>
                {item.location ? <p className="mt-2 text-xs text-[var(--muted)]">{item.location}</p> : null}
              </div>
              <article>
                <p className="text-sm font-semibold tracking-[0.06em] text-[var(--ink)] uppercase">{item.company}</p>
                <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] sm:text-5xl">{item.role}</h2>
                {item.note ? <p className="mt-4 max-w-2xl text-sm italic leading-6 text-[var(--muted)]">{item.note}</p> : null}
                <ul className="mt-8 space-y-4">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="highlight-item">{highlight}</li>
                  ))}
                </ul>
                <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technologies used">
                  {item.technologies.map((technology) => <li key={technology} className="tag">{technology}</li>)}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
