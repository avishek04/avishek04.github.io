import type { Metadata } from "next";
import { ExploreCard } from "@/components/explore-card";
import { PageIntro } from "@/components/page-intro";
import { explore, exploreSections } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Explore",
  description: "Writing that shapes Avishek Choudhury outside software engineering.",
  alternates: { canonical: "/explore/" },
};

// Keep the trip content in the central content file until it is ready to publish.
const SHOW_TRIPS = false;

export default function ExplorePage() {
  const blogSection = exploreSections.find((section) => section.title === "Blogs");
  const sideSections = exploreSections.filter(
    (section) => section.title !== "Blogs" && (SHOW_TRIPS || section.title !== "Trips"),
  );
  const hasSideSections = sideSections.length > 0;

  return (
    <>
      <PageIntro
        eyebrow="Explore"
        index="06 / 07"
        title="Outside of work"
      />
      <section className="site-container mt-16 sm:mt-24">
        <div
          className={
            hasSideSections
              ? "grid gap-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-14"
              : "max-w-3xl"
          }
        >
          {blogSection ? (
            <section aria-labelledby="explore-blogs">
              <div className="border-b border-[var(--line)] pb-5">
                <h2 id="explore-blogs" className="section-title">Blogs</h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
                  {blogSection.description}
                </p>
              </div>
              <div className="mt-8 space-y-16">
                {explore
                  .filter((item) => item.section === "Blogs")
                  .map((item, index) => (
                    <ExploreCard key={item.title} item={item} index={index} />
                  ))}
              </div>
            </section>
          ) : null}

          {hasSideSections ? (
            <div className="space-y-20">
              {sideSections.map((section) => {
                const items = explore.filter((item) => item.section === section.title);

                return (
                  <section key={section.title} aria-labelledby={`explore-${section.title.toLowerCase()}`}>
                    <div className="border-b border-[var(--line)] pb-5">
                      <h2 id={`explore-${section.title.toLowerCase()}`} className="section-title">
                        {section.title}
                      </h2>
                      <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">
                        {section.description}
                      </p>
                    </div>
                    <div className="mt-8 space-y-14">
                      {items.map((item, index) => (
                        <ExploreCard key={item.title} item={item} index={index} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
