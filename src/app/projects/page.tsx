import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ProjectCard } from "@/components/project-card";
import { ProjectDomainNav } from "@/components/project-domain-nav";
import { groupProjectsByDomain, sortProjects, toAnalyticsId } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected backend, distributed-systems, full-stack, visualization, and applied-AI projects by Avishek Choudhury.",
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  const items = sortProjects();
  const domainGroups = groupProjectsByDomain(items).map((group) => ({
    domain: group.domain,
    projects: group.projects.map((project) => ({
      id: toAnalyticsId(project.title),
      title: project.title,
    })),
  }));

  return (
    <>
      <PageIntro
        eyebrow="Projects"
        index="05 / 07"
        title="Projects"
      />
      <div className="site-container mt-10 sm:mt-12">
        <ProjectDomainNav groups={domainGroups} />
      </div>
      <section className="site-container mt-16 sm:mt-24">
        <div className="space-y-14 sm:space-y-16">
          {items.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}
        </div>
      </section>
    </>
  );
}
