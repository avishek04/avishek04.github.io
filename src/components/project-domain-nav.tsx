"use client";

import { useState, type FocusEvent, type KeyboardEvent } from "react";

export type ProjectDomainGroup = {
  domain: string;
  projects: Array<{
    id: string;
    title: string;
  }>;
};

type ProjectDomainNavProps = {
  groups: ProjectDomainGroup[];
};

export function ProjectDomainNav({ groups }: ProjectDomainNavProps) {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  function closeAfterFocusLeaves(event: FocusEvent<HTMLLIElement>, domain: string) {
    if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) {
      return;
    }

    if (activeDomain === domain) setActiveDomain(null);
  }

  function closeWithEscape(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key !== "Escape") return;

    setActiveDomain(null);
    event.currentTarget.querySelector("button")?.focus();
  }

  return (
    <nav className="project-domain-nav" aria-label="Browse projects by technology domain">
      <div className="project-domain-nav__intro">
        <p className="eyebrow">Browse by domain</p>
        <p>Hover, focus, or tap a domain to reveal its projects.</p>
      </div>

      <ul className="project-domain-nav__domains">
        {groups.map((group) => {
          const isOpen = activeDomain === group.domain;
          const projectListId = `domain-${group.domain.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

          return (
            <li
              key={group.domain}
              className="project-domain-nav__group"
              data-open={isOpen}
              onMouseEnter={() => setActiveDomain(group.domain)}
              onMouseLeave={() => setActiveDomain(null)}
              onFocus={() => setActiveDomain(group.domain)}
              onBlur={(event) => closeAfterFocusLeaves(event, group.domain)}
              onKeyDown={closeWithEscape}
            >
              <button
                type="button"
                className="project-domain-nav__trigger"
                aria-expanded={isOpen}
                aria-controls={projectListId}
                onClick={() => setActiveDomain(group.domain)}
              >
                <span>{group.domain}</span>
                <span className="project-domain-nav__count" aria-label={`${group.projects.length} projects`}>
                  {String(group.projects.length).padStart(2, "0")}
                </span>
              </button>

              <ul
                id={projectListId}
                className="project-domain-nav__projects"
                aria-label={`${group.domain} projects`}
              >
                {group.projects.map((project, index) => (
                  <li key={project.id} style={{ transitionDelay: `${index * 45}ms` }}>
                    <a href={`#${project.id}`}>{project.title}</a>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
