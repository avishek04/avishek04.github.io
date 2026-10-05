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
      <section className="site-container mt-8 sm:mt-10" aria-labelledby="skill-map-title">
        <h2 id="skill-map-title" className="sr-only">
          Experience behind the tools
        </h2>
        <SkillMap skills={skillMap} />
        <p className="mt-6 ml-auto max-w-xl text-right text-xs leading-6 text-[var(--muted)]">
          Bubble size reflects the weighted evidence for a skill. Hover, focus, or tap a skill to reveal its supporting roles, projects, and coursework. Then click on the popped-up bubble to go to the content for further context.
        </p>
      </section>

      <section className="site-container mt-20 sm:mt-24" aria-labelledby="evidence-index-title">
        <div className="section-heading">
          <h2 id="evidence-index-title" className="section-title">Evidence index</h2>
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
