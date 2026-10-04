import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { ProjectCard } from "@/components/project-card";
import { sortProjects } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected backend, distributed-systems, full-stack, visualization, and applied-AI projects by Avishek Choudhury.",
  alternates: { canonical: "/projects/" },
};

export default function ProjectsPage() {
  const items = sortProjects();

  return (
    <>
      <PageIntro
        eyebrow="Projects"
        index="04 / 06"
        title="Selected projects"
        description="Selected work ordered by impact and relevance. Each project begins with a problem and ends with something testable."
      />
      <section className="site-container mt-16 sm:mt-24">
        <div className="space-y-14 sm:space-y-16">
          {items.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}
        </div>
      </section>
    </>
  );
}
