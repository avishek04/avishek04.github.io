import type { Metadata } from "next";
import { OrganizationLink } from "@/components/organization-link";
import { PageIntro } from "@/components/page-intro";
import { formatDateRange, sortEducation, toAnalyticsId } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Education",
  description: "Education, research, teaching, and coursework from Avishek Choudhury.",
  alternates: { canonical: "/education/" },
};

export default function EducationPage() {
  const items = sortEducation();

  return (
    <>
      <PageIntro
        eyebrow="Education"
        index="03 / 07"
        title="Education"
      />
      <section className="site-container mt-16 sm:mt-24">
        <ol className="grid gap-6">
          {items.map((item, index) => (
            <li
              key={`${item.institution}-${item.degree}`}
              id={toAnalyticsId(`${item.institution}-${item.degree}`)}
              className="scroll-mt-24"
            >
              <article className="education-card grid gap-8 border border-[var(--line)] p-6 sm:p-9 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
                <div className="flex flex-col justify-between gap-10">
                  <div>
                    <span className="font-mono text-[10px] text-[var(--accent)]">0{index + 1}</span>
                    <div className="mt-7">
                      {item.organizationUrl && item.organizationLogo ? (
                        <OrganizationLink
                          name={item.institution}
                          href={item.organizationUrl}
                          logo={item.organizationLogo}
                          logoKind={item.organizationLogoKind}
                        />
                      ) : (
                        <p className="eyebrow">{item.institution}</p>
                      )}
                    </div>
                    <h2 className="mt-3 font-serif text-3xl leading-tight tracking-[-0.03em] sm:text-4xl">{item.degree}</h2>
                    {item.focus ? <p className="mt-3 text-sm text-[var(--muted)]">{item.focus}</p> : null}
                  </div>
                  <div className="font-mono text-[10px] leading-5 text-[var(--muted)]">
                    <p>{formatDateRange(item.startDate, item.endDate)}</p>
                    {item.location ? <p>{item.location}</p> : null}
                    {item.gpa ? <p>GPA {item.gpa}</p> : null}
                  </div>
                </div>
                <div className="border-t border-[var(--line)] pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                  {item.highlights?.length ? (
                    <div>
                      <p className="eyebrow">Highlights</p>
                      <ul className="mt-5 space-y-4">
                        {item.highlights.map((highlight) => <li key={highlight} className="highlight-item">{highlight}</li>)}
                      </ul>
                    </div>
                  ) : null}
                  {item.coursework?.length ? (
                    <div className={item.highlights?.length ? "mt-9" : ""}>
                      <p className="eyebrow">Selected coursework</p>
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {item.coursework.map((course) => <li key={course} className="tag">{course}</li>)}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
