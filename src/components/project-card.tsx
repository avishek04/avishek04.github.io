import Image from "next/image";
import { ArrowUpRightIcon } from "@/components/icons";
import type { ProjectItem } from "@/content/portfolio";
import { toAnalyticsId } from "@/lib/portfolio";

type ProjectCardProps = {
  project: ProjectItem;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article
      id={toAnalyticsId(project.title)}
      className={`project-card group grid scroll-mt-24 gap-8 border-t border-[var(--line)] pt-8 sm:pt-10 ${project.image ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-start lg:gap-14" : ""}`}
      data-track-section="project"
      data-track-id={toAnalyticsId(project.title)}
    >
      <div className="lg:py-2">
        <div className="flex items-center justify-between gap-4">
          <p className="eyebrow">{project.category}</p>
          {project.year ? <span className="font-mono text-[10px] text-[var(--muted)]">{project.year}</span> : null}
        </div>
        <h2 className="mt-3 font-serif text-3xl leading-tight tracking-[-0.03em] sm:text-4xl">
          {project.title}
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-7">{project.summary}</p>
        {project.impact ? (
          <p className="mt-5 border-l-2 border-[var(--accent)] pl-4 text-sm font-medium leading-6 text-[var(--ink)]">{project.impact}</p>
        ) : null}
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies used">
          {project.technologies.map((technology) => (
            <li key={technology} className="tag">{technology}</li>
          ))}
        </ul>
        {project.repositoryUrl || project.liveUrl ? (
          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-t border-[var(--line)] pt-4">
            {project.repositoryUrl ? (
              <a
                className="text-link"
                href={project.repositoryUrl}
                target="_blank"
                rel="noreferrer"
                data-analytics={`project-${index + 1}-source`}
                data-track-link="project-source"
                data-track-id={toAnalyticsId(project.title)}
              >
                View source <ArrowUpRightIcon className="size-4" />
              </a>
            ) : null}
            {project.liveUrl ? (
              <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer" data-analytics={`project-${index + 1}-live`}>
                View project <ArrowUpRightIcon className="size-4" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      {project.image ? (
        <div className="project-card__image relative overflow-hidden bg-[var(--surface)]">
          <Image
            src={project.image}
            alt={project.imageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
          />
          <span className="absolute top-4 left-4 rounded-full bg-[color:var(--background)]/90 px-3 py-1 font-mono text-[9px] tracking-[0.12em] text-[var(--muted)] uppercase backdrop-blur">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      ) : null}
    </article>
  );
}
