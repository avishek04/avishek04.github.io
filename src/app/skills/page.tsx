import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { SkillMap } from "@/components/skill-map";
import { skillMap } from "@/content/portfolio";
import { skillUsageScore } from "@/lib/skills";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "An evidence-based map of the systems, backend, full-stack, and applied-AI skills used by Avishek Choudhury.",
  alternates: { canonical: "/skills/" },
};

export default function SkillsPage() {
  return (
    <>
      <PageIntro eyebrow="Skills" index="04 / 07" title="Skills" />
      <section className="site-container mt-12 sm:mt-16" aria-labelledby="skill-map-title">
        <div className="grid gap-8 border-y border-[var(--line)] py-7 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <div>
            <h2 id="skill-map-title" className="font-serif text-2xl tracking-[-0.025em] sm:text-3xl">
              Experience behind the tools
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              A living network of the tools and ideas that recur across my work. Hover, focus, or tap a skill to reveal its supporting roles, projects, and coursework; nearby skills move aside as that evidence enters the network.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] text-[var(--muted)]" aria-label="Evidence weights">
            <span><strong className="text-[var(--ink)]">4</strong> Experience</span>
            <span><strong className="text-[var(--ink)]">2</strong> Project</span>
            <span><strong className="text-[var(--ink)]">1</strong> Course</span>
          </div>
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-6 text-[var(--muted)]">
          Bubble size reflects the weighted evidence above, while color helps separate neighboring nodes. It is a record of documented use—not a subjective proficiency rating.
        </p>

        <div className="mt-4">
          <SkillMap skills={skillMap} />
        </div>
      </section>

      <section className="site-container mt-20 sm:mt-24" aria-labelledby="evidence-index-title">
        <div className="section-heading">
          <h2 id="evidence-index-title" className="section-title">Evidence index</h2>
          <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
            The same connections in a compact list for quick scanning.
          </p>
        </div>
        <div className="mt-6 grid gap-x-10 md:grid-cols-2">
          {skillMap.map((skill) => (
            <details key={skill.id} className="group border-b border-[var(--line)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] [&::-webkit-details-marker]:hidden">
                <span>
                  <span className="block text-sm font-semibold">{skill.label}</span>
                  <span className="mt-1 block text-[11px] text-[var(--muted)]">{skill.category}</span>
                </span>
                <span className="flex items-center gap-3 font-mono text-[10px] text-[var(--muted)]">
                  {skillUsageScore(skill)} weight
                  <span aria-hidden="true" className="text-lg leading-none text-[var(--accent)] group-open:rotate-45">+</span>
                </span>
              </summary>
              <ul className="space-y-3 pb-6">
                {skill.evidence.map((evidence) => (
                  <li key={`${evidence.kind}-${evidence.title}`} className="flex items-baseline gap-3 text-sm">
                    <span className="w-16 shrink-0 font-mono text-[9px] tracking-[0.08em] text-[var(--muted)] uppercase">
                      {evidence.kind}
                    </span>
                    <Link className="text-link !text-sm" href={evidence.href}>
                      {evidence.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
