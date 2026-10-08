import assert from "node:assert/strict";
import test from "node:test";
import {
  education,
  experience,
  projects,
  skillMap,
  type EducationItem,
  type ExperienceItem,
  type ProjectItem,
  type SkillMapItem,
} from "../src/content/portfolio";
import { externalReferrerHostname } from "../src/lib/analytics";
import {
  formatDateRange,
  groupProjectsByDomain,
  sortEducation,
  sortExperience,
  sortProjects,
  toAnalyticsId,
} from "../src/lib/portfolio";
import {
  createSkillEvidenceLayout,
  createSkillNetworkEdges,
  createSkillNetworkLayout,
  displaceSkillNetwork,
} from "../src/lib/skill-network";
import { skillBubbleSize, skillUsageScore } from "../src/lib/skills";

test("projects sort by priority and then descending year", () => {
  const items: ProjectItem[] = [
    { title: "Older", domain: "Systems & networking", category: "Test", summary: "", technologies: [], priority: 10, featured: false, year: 2022 },
    { title: "High priority", domain: "AI & machine learning", category: "Test", summary: "", technologies: [], priority: 20, featured: false, year: 2020 },
    { title: "Newer", domain: "Systems & networking", category: "Test", summary: "", technologies: [], priority: 10, featured: false, year: 2025 },
  ];

  assert.deepEqual(sortProjects(items).map((item) => item.title), ["High priority", "Newer", "Older"]);
});

test("projects group into technology domains and preserve priority within each domain", () => {
  const sortedProjects = sortProjects();
  const groups = groupProjectsByDomain(sortedProjects);

  assert.deepEqual(
    groups.map((group) => group.domain),
    ["AI & machine learning", "Distributed & backend", "Full-stack & data", "Systems & networking"],
  );
  for (const group of groups) {
    assert.deepEqual(
      group.projects,
      sortedProjects.filter((project) => project.domain === group.domain),
    );
  }
  assert.equal(groups.reduce((count, group) => count + group.projects.length, 0), sortedProjects.length);
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

test("skill usage scores weight experience above projects and coursework", () => {
  const skill: SkillMapItem = {
    id: "test-skill",
    label: "Test skill",
    category: "Test",
    evidence: [
      { kind: "Experience", title: "Role", href: "/experience/#role" },
      { kind: "Project", title: "Project", href: "/projects/#project" },
      { kind: "Course", title: "Course", href: "/education/#course" },
    ],
  };

  assert.equal(skillUsageScore(skill), 7);
});

test("skill bubble size increases with documented usage", () => {
  const smaller: SkillMapItem = {
    id: "smaller",
    label: "Smaller",
    category: "Test",
    evidence: [{ kind: "Course", title: "Course", href: "/education/#course" }],
  };
  const larger: SkillMapItem = {
    id: "larger",
    label: "Larger",
    category: "Test",
    evidence: [{ kind: "Experience", title: "Role", href: "/experience/#role" }],
  };

  assert.ok(skillBubbleSize(larger, 1, 4) > skillBubbleSize(smaller, 1, 4));
});

test("every skill evidence link points to a rendered portfolio anchor", () => {
  const anchors = new Set([
    ...experience.map(
      (item) =>
        `/experience/#${toAnalyticsId(`${item.company}-${item.role}`)}`,
    ),
    ...education.map(
      (item) =>
        `/education/#${toAnalyticsId(`${item.institution}-${item.degree}`)}`,
    ),
    ...projects.map((item) => `/projects/#${toAnalyticsId(item.title)}`),
  ]);

  for (const skill of skillMap) {
    for (const evidence of skill.evidence) {
      assert.ok(
        anchors.has(evidence.href),
        `${skill.label} points to missing anchor ${evidence.href}`,
      );
    }
  }
});

test("skill network forms a connected mesh inside its stage", () => {
  const { height, nodes } = createSkillNetworkLayout(skillMap, 1152);
  const edges = createSkillNetworkEdges(nodes);

  assert.equal(nodes.length, skillMap.length);
  assert.ok(height < 1152, "desktop skill network should be horizontally oriented");
  assert.equal(edges.length, (nodes.length * (nodes.length - 1)) / 2);
  for (const node of nodes) {
    assert.ok(node.depth >= 0 && node.depth <= 1);
    assert.ok(node.x - node.radius >= 0);
    assert.ok(node.x + node.radius <= 1152);
    assert.ok(node.y - node.radius >= 0);
    assert.ok(node.y + node.radius <= height);
  }
});

test("skill network perspective makes equally weighted foreground nodes larger", () => {
  const equalWeightSkills = skillMap.map((skill, index) => ({
    ...skill,
    id: `${skill.id}-${index}`,
    evidence: skillMap[0].evidence,
  }));
  const { nodes } = createSkillNetworkLayout(equalWeightSkills, 1152);
  const farthest = nodes.reduce((current, node) =>
    node.depth < current.depth ? node : current,
  );
  const nearest = nodes.reduce((current, node) =>
    node.depth > current.depth ? node : current,
  );

  assert.ok(nearest.depth > farthest.depth);
  assert.ok(nearest.size > farthest.size);
});

test("expanded evidence displaces neighboring skill nodes", () => {
  const width = 1152;
  const { height, nodes } = createSkillNetworkLayout(skillMap, width);
  const evidence = createSkillEvidenceLayout(
    nodes[0],
    skillMap[0].evidence.length,
    width,
    height,
  );
  const displaced = displaceSkillNetwork(nodes, 0, evidence, width, height);

  assert.equal(displaced[0].x, nodes[0].x);
  assert.equal(displaced[0].y, nodes[0].y);
  assert.ok(
    displaced.some(
      (node, index) =>
        index !== 0 &&
        Math.hypot(node.x - nodes[index].x, node.y - nodes[index].y) > 1,
    ),
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
