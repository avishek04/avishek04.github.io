import assert from "node:assert/strict";
import test from "node:test";
import type { EducationItem, ExperienceItem, ProjectItem } from "../src/content/portfolio";
import { externalReferrerHostname } from "../src/lib/analytics";
import { formatDateRange, sortEducation, sortExperience, sortProjects, toAnalyticsId } from "../src/lib/portfolio";

test("projects sort by priority and then descending year", () => {
  const items: ProjectItem[] = [
    { title: "Older", category: "Test", summary: "", technologies: [], priority: 10, featured: false, year: 2022 },
    { title: "High priority", category: "Test", summary: "", technologies: [], priority: 20, featured: false, year: 2020 },
    { title: "Newer", category: "Test", summary: "", technologies: [], priority: 10, featured: false, year: 2025 },
  ];

  assert.deepEqual(sortProjects(items).map((item) => item.title), ["High priority", "Newer", "Older"]);
});

test("experience sorts by most recent confirmed date", () => {
  const items: ExperienceItem[] = [
    { company: "A", role: "A", startDate: "2020-01", endDate: "2021-01", highlights: [], technologies: [] },
    { company: "B", role: "B", startDate: "2024-02", highlights: [], technologies: [] },
    { company: "C", role: "C", startDate: "2022-01", endDate: "2023-01", highlights: [], technologies: [] },
    { company: "Current", role: "Current", startDate: "2019-01", current: true, highlights: [], technologies: [] },
  ];

  assert.deepEqual(sortExperience(items).map((item) => item.company), ["Current", "B", "C", "A"]);
});

test("education sorts by newest completion date", () => {
  const items: EducationItem[] = [
    { institution: "A", degree: "A", startDate: "2015-01", endDate: "2019-01" },
    { institution: "B", degree: "B", startDate: "2020-01", endDate: "2024-05" },
  ];

  assert.deepEqual(sortEducation(items).map((item) => item.institution), ["B", "A"]);
});

test("unverified end dates never imply a present role", () => {
  assert.equal(formatDateRange("2023-08"), "Started Aug 2023");
  assert.equal(formatDateRange("2022-01", "2023-08"), "Jan 2022 — Aug 2023");
});

test("verified current roles display Present", () => {
  assert.equal(formatDateRange("2025-12", undefined, true), "Dec 2025 — Present");
});

test("analytics identifiers are stable and URL-safe", () => {
  assert.equal(
    toAnalyticsId("University of Utah Health — Software Engineer"),
    "university-of-utah-health-software-engineer",
  );
});

test("referrer attribution excludes navigation within the portfolio", () => {
  assert.equal(
    externalReferrerHostname(
      "https://avishek04.github.io/",
      "avishek04.github.io",
    ),
    undefined,
  );
  assert.equal(
    externalReferrerHostname(
      "https://avishek04.github.io/projects/",
      "avishek04.github.io",
    ),
    undefined,
  );
});

test("referrer attribution keeps only an external hostname", () => {
  assert.equal(
    externalReferrerHostname(
      "https://www.linkedin.com/jobs/view/123?tracking=private",
      "avishek04.github.io",
    ),
    "www.linkedin.com",
  );
  assert.equal(
    externalReferrerHostname("not a URL", "avishek04.github.io"),
    undefined,
  );
});
