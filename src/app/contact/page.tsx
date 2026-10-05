import type { Metadata } from "next";
import { ContactActions } from "@/components/contact-actions";
import { ArrowUpRightIcon, DownloadIcon } from "@/components/icons";
import { PageIntro } from "@/components/page-intro";
import { profile } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${profile.name} about software engineering opportunities and thoughtful technical work.`,
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  const emails = [profile.email, ...profile.additionalEmails];

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        index="07 / 07"
        title="Let’s connect"
        description="If you are hiring or building something ambitious, I would be glad to hear from you."
      />
      <section className="site-container mt-16 sm:mt-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div className="contact-panel min-w-0 bg-[var(--ink)] p-7 text-[var(--paper)] sm:p-10 lg:p-14">
            <p className="eyebrow !text-[color:var(--paper)]/55">Direct is best</p>
            <div className="mt-8 space-y-4">
              {emails.map((email, index) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className={`${index === 0 ? "text-2xl sm:text-4xl xl:text-5xl" : "text-xl sm:text-2xl"} block break-all font-serif leading-tight tracking-[-0.035em] hover:text-[#9ab7ff]`}
                >
                  {email}
                </a>
              ))}
            </div>
            <p className="mt-7 max-w-xl text-sm leading-7 text-[color:var(--paper)]/65">{profile.availability}</p>
            <div className="mt-10 [&_.button--primary]:bg-[var(--paper)] [&_.button--primary]:text-[var(--ink)] [&_.button--secondary]:border-white/25 [&_.button--secondary]:text-[var(--paper)]">
              <ContactActions email={profile.email} />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-14">
            <div>
              <p className="eyebrow">Find me online</p>
              <ul className="mt-6 border-t border-[var(--line)]" aria-label="Social profiles">
                {profile.socials.map((social) => (
                  <li key={social.label} className="border-b border-[var(--line)]">
                    <a href={social.href} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-6 py-5" data-analytics={`contact-${social.label.toLowerCase()}`}>
                      <div>
                        <p className="font-medium">{social.label}</p>
                        <p className="mt-1 text-xs text-[var(--muted)]">{social.handle}</p>
                      </div>
                      <ArrowUpRightIcon className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-5 border-t border-[var(--line)] pt-6 text-sm">
              <div>
                <p className="eyebrow">Based in</p>
                <p className="mt-3">{profile.location}</p>
              </div>
              {profile.resumeUrl ? (
                <div>
                  <p className="eyebrow">Background</p>
                  <a
                    href={profile.resumeUrl}
                    className="text-link mt-3"
                    download="Avishek-Choudhury-Resume.pdf"
                    data-analytics="contact-resume"
                  >
                    Résumé <DownloadIcon className="size-4" />
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside
          className="mt-14 border-t border-[var(--line)] py-4 text-[11px] leading-[1.45] text-[var(--muted)]"
          aria-labelledby="privacy-analytics-title"
        >
          <div className="grid gap-3 lg:grid-cols-[0.55fr_1.45fr] lg:gap-8">
            <div>
              <h2
                id="privacy-analytics-title"
                className="font-medium tracking-[0.08em] text-[var(--ink)] uppercase"
              >
                Privacy &amp; analytics
              </h2>
              <p className="mt-1 max-w-sm">{profile.privacy.summary}</p>
            </div>

            <ul className="grid gap-2 sm:grid-cols-3 sm:gap-4">
              <li>
                <span className="font-semibold text-[var(--ink)]">What is collected: </span>
                {profile.privacy.collected}
              </li>
              <li>
                <span className="font-semibold text-[var(--ink)]">What is not collected: </span>
                {profile.privacy.protections}
              </li>
              <li>
                <span className="font-semibold text-[var(--ink)]">Retention and controls: </span>
                {profile.privacy.retention}
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
