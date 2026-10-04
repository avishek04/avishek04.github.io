import type { Metadata } from "next";
import { ExploreCard } from "@/components/explore-card";
import { PageIntro } from "@/components/page-intro";
import { explore } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Explore",
  description: "A look at the interests and practices that shape Avishek Choudhury outside software engineering.",
  alternates: { canonical: "/explore/" },
};

export default function ExplorePage() {
  return (
    <>
      <PageIntro
        eyebrow="Explore"
        index="05 / 06"
        title="Outside of work"
        description="Hiking, cooking, photography, and training are different ways of practicing attention, patience, and curiosity."
      />
      <section className="site-container mt-16 sm:mt-24">
        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2">
          {explore.map((item, index) => <ExploreCard key={item.title} item={item} index={index} />)}
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
