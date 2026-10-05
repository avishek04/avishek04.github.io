import type { Metadata } from "next";
import { ExploreCard } from "@/components/explore-card";
import { PageIntro } from "@/components/page-intro";
import { explore, exploreSections } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Explore",
  description: "Trips, writing, and interests that shape Avishek Choudhury outside software engineering.",
  alternates: { canonical: "/explore/" },
};

export default function ExplorePage() {
  return (
    <>
      <PageIntro
        eyebrow="Explore"
        index="06 / 07"
        title="Outside of work"
        description="Hiking, cooking, photography, and training are different ways of practicing attention, patience, and curiosity."
      />
      <section className="site-container mt-16 sm:mt-24">
        <div className="space-y-20 sm:space-y-24">
          {exploreSections.map((section) => {
            const items = explore.filter((item) => item.section === section.title);

            return (
              <section key={section.title} aria-labelledby={`explore-${section.title.toLowerCase()}`}>
                <div className="section-heading">
                  <h2 id={`explore-${section.title.toLowerCase()}`} className="section-title">
                    {section.title}
                  </h2>
                  <p className="max-w-md text-sm leading-6 text-[var(--muted)]">
                    {section.description}
                  </p>
                </div>
                <div className="mt-8 grid gap-x-8 gap-y-16 md:grid-cols-2">
                  {items.map((item, index) => (
                    <ExploreCard
                      key={item.title}
                      item={item}
                      index={index}
                      wide={section.title === "Blogs"}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        <aside className="mt-20 grid gap-6 border-y border-[var(--line)] py-8 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <p className="eyebrow">A living collection</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              The visual spaces above are intentionally ready for original photographs. Add image paths and descriptions in the central portfolio content file when new stories are ready to share.
            </p>
          </div>
          <p className="font-serif text-2xl italic text-[var(--accent)]">More soon.</p>
        </aside>
      </section>
    </>
  );
}
