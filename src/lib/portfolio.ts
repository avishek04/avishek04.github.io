import {
  education,
  experience,
  projects,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
} from "@/content/portfolio";

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function dateValue(value?: string): number {
  if (!value) return 0;
  const [year, month = 1] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, 1);
}

export function formatMonth(value: string): string {
  const [year, month = 1] = value.split("-").map(Number);
  return monthFormatter.format(new Date(Date.UTC(year, month - 1, 1)));
}

export function formatDateRange(startDate: string, endDate?: string, current = false): string {
  if (current) return `${formatMonth(startDate)} — Present`;
  if (!endDate) return `Started ${formatMonth(startDate)}`;
  return `${formatMonth(startDate)} — ${formatMonth(endDate)}`;
}

export function sortExperience(items: ExperienceItem[] = experience): ExperienceItem[] {
  return [...items].sort((a, b) => {
    const aDate = a.current ? Number.POSITIVE_INFINITY : dateValue(a.endDate) || dateValue(a.startDate);
    const bDate = b.current ? Number.POSITIVE_INFINITY : dateValue(b.endDate) || dateValue(b.startDate);
    return bDate - aDate;
  });
}

export function sortEducation(items: EducationItem[] = education): EducationItem[] {
  return [...items].sort((a, b) => {
    const aDate = dateValue(a.endDate) || dateValue(a.startDate);
    const bDate = dateValue(b.endDate) || dateValue(b.startDate);
    return bDate - aDate;
  });
}

export function sortProjects(items: ProjectItem[] = projects): ProjectItem[] {
  return [...items].sort((a, b) => b.priority - a.priority || (b.year ?? 0) - (a.year ?? 0));
}

export function featuredProjects(limit = 3): ProjectItem[] {
  return sortProjects().filter((project) => project.featured).slice(0, limit);
}

export function toAnalyticsId(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
