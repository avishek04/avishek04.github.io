import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", heading: /Avishek Choudhury/i },
  { path: "/experience/", heading: /^Experience$/i },
  { path: "/education/", heading: /^Education$/i },
  { path: "/skills/", heading: /^Skills$/i },
  { path: "/projects/", heading: /^Projects$/i },
  { path: "/explore/", heading: /Outside of work/i },
  { path: "/contact/", heading: /Let’s connect/i },
];

for (const route of routes) {
  test(`${route.path} renders with one primary heading and no horizontal overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(route.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
    await expect(page.locator("body")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
    expect(errors).toEqual([]);
  });
}

test("theme choice persists across navigation and reload", async ({ page }) => {
  await page.goto("/");
  const startedDark = await page.locator("html").evaluate((element) => element.classList.contains("dark"));
  await page.getByTestId("theme-toggle").click();
  await expect(page.locator("html")).toHaveClass(startedDark ? /^(?!.*dark).*$/ : /dark/);
  await page.reload();
  expect(await page.locator("html").evaluate((element) => element.classList.contains("dark"))).toBe(!startedDark);
});

test("mobile navigation opens and reaches the projects page", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation is only visible on small screens");
  await page.goto("/");
  await page.getByTestId("menu-toggle").click();
  await expect(page.getByTestId("mobile-navigation")).toBeVisible();
  await page.getByTestId("mobile-navigation").getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
});

test("contact actions expose email, copy feedback, and safe external links", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/contact/");
  await expect(page.getByRole("link", { name: "Write an email" })).toHaveAttribute("href", /^mailto:/);
  await expect(page.getByRole("link", { name: "choudhury.avishek96@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:choudhury.avishek96@gmail.com",
  );
  await expect(page.getByRole("link", { name: "avishekchoudhury04@gmail.com" })).toHaveAttribute(
    "href",
    "mailto:avishekchoudhury04@gmail.com",
  );
  await expect(
    page.getByRole("list", { name: "Social profiles" }).getByRole("link"),
  ).toHaveText(["LinkedIn/in/avishekchoudhury", "GitHub@avishek04", "Medium@avishekchoudhury"]);
  await page.getByTestId("copy-email").click();
  await expect(page.getByTestId("copy-status")).toHaveText("Email copied");

  const externalLinks = page.locator('a[target="_blank"]');
  const count = await externalLinks.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    await expect(externalLinks.nth(index)).toHaveAttribute("rel", /noreferrer/);
  }
});

test("footer appears only on the homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toBeVisible();

  for (const path of ["/experience/", "/education/", "/skills/", "/projects/", "/explore/", "/contact/"]) {
    await page.goto(path);
    await expect(page.locator("footer")).toHaveCount(0);
  }
});

test("skill bubbles reveal linked evidence and destination anchors exist", async ({ page }) => {
  await page.goto("/skills/");
  const skill = page.getByTestId("skill-bubble-distributed-systems");
  const skillNodes = page.locator("[data-skill-node]");
  await expect(skill).toBeVisible();
  await expect(skillNodes.first()).toHaveCSS("animation-name", "none");
  const positionsBefore = await skillNodes.evaluateAll((nodes) =>
    nodes.map((node) => (node as HTMLElement).style.cssText),
  );
  await expect(skill).toHaveAttribute("aria-expanded", "false");
  await skill.click();
  await expect(skill).toHaveAttribute("aria-expanded", "true");
  const positionsAfter = await skillNodes.evaluateAll((nodes) =>
    nodes.map((node) => (node as HTMLElement).style.cssText),
  );
  expect(
    positionsAfter.some(
      (position, index) => index > 0 && position !== positionsBefore[index],
    ),
  ).toBe(true);

  const evidence = page
    .locator("#skill-evidence-distributed-systems")
    .getByRole("link", { name: "Project: Replicated key-value store" });
  await expect(evidence).toBeVisible();
  await expect(evidence).toHaveAttribute(
    "href",
    "/projects/#replicated-key-value-store",
  );

  await page.goto("/projects/#replicated-key-value-store");
  await expect(page.locator("#replicated-key-value-store")).toBeVisible();
});

test("contact page discloses analytics collection and privacy controls", async ({ page }) => {
  await page.goto("/contact/");
  await expect(
    page.getByRole("heading", { name: "Privacy & analytics" }),
  ).toBeVisible();
  await expect(page.getByText("What is collected:")).toBeVisible();
  await expect(page.getByText(/does not use cookies/i)).toBeVisible();
  await expect(page.getByText(/retained for 30 days/i)).toBeVisible();
});

test("resume is discoverable from the homepage", async ({ page }) => {
  await page.goto("/");
  const resumeLink = page.getByRole("link", { name: /Download résumé/i });
  await expect(resumeLink).toBeVisible();
  await expect(resumeLink).toHaveAttribute(
    "href",
    "/documents/Avishek-Choudhury-Resume.pdf",
  );
  await expect(resumeLink).toHaveAttribute(
    "download",
    "Avishek-Choudhury-Resume.pdf",
  );
});

test("explore content is organized into clear sections", async ({ page }) => {
  await page.goto("/explore/");
  await expect(page.getByRole("heading", { name: "Trips" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Blogs" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Interests" })).toHaveCount(0);
  await expect(page.getByText("A living collection")).toHaveCount(0);
  await expect(page.getByText("More soon.")).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "LoRA, an efficient approach to fine-tuning a Large Language Model",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: /LoRA adapter training and the merged model weights/i,
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Read article" })).toHaveAttribute(
    "href",
    /medium\.com/,
  );
  await expect(page.getByRole("link", { name: "Try model" })).toHaveAttribute(
    "href",
    /huggingface\.co/,
  );
  await expect(page.getByRole("link", { name: "View code" })).toHaveAttribute(
    "href",
    /github\.com/,
  );
});

test("experience and education organizations have logos and official links", async ({ page }) => {
  await page.goto("/experience/");
  const uHealth = page.getByRole("link", { name: "University of Utah Health website" });
  await expect(uHealth).toHaveAttribute("href", "https://healthcare.utah.edu/");
  await expect(uHealth.locator("img")).toBeVisible();

  const accenture = page.getByRole("link", { name: "Accenture website" }).first();
  await expect(accenture).toHaveAttribute("href", "https://www.accenture.com/");
  await expect(accenture.locator("img")).toBeVisible();

  await page.goto("/education/");
  const university = page.getByRole("link", { name: "University of Utah website" }).first();
  await expect(university).toHaveAttribute("href", "https://www.utah.edu/");
  await expect(university.locator("img")).toBeVisible();

  const bmsce = page.getByRole("link", { name: "B.M.S. College of Engineering website" });
  await expect(bmsce).toHaveAttribute("href", "https://www.bmsce.ac.in/");
  await expect(bmsce.locator("img")).toBeVisible();
});

test("education uses the requested degree and GPA wording", async ({ page }) => {
  await page.goto("/education/");
  await expect(page.getByText("With Specialization in AI")).toBeVisible();
  await expect(page.getByText("GPA 3.0 / 4.0", { exact: true })).toBeVisible();
  await expect(page.getByText(/converted from 7\.5 \/ 10/i)).toHaveCount(0);
});

test("home narrative links to the organizations and professor it mentions", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "University of Utah Health" })).toHaveAttribute(
    "href",
    "https://healthcare.utah.edu/",
  );
  await expect(page.getByRole("link", { name: "University of Utah" })).toHaveAttribute(
    "href",
    "https://www.utah.edu/",
  );
  await expect(page.getByRole("link", { name: "Professor Shandian Zhe" })).toHaveAttribute(
    "href",
    "https://users.cs.utah.edu/~zhe/",
  );
  await expect(page.getByRole("link", { name: "Accenture" })).toHaveAttribute(
    "href",
    "https://www.accenture.com/",
  );
});

test("analytics markers identify experience entries, projects, and source links", async ({ page }) => {
  await page.goto("/experience/");
  const experienceEntries = page.locator('[data-track-section="experience"][data-track-id]');
  expect(await experienceEntries.count()).toBeGreaterThan(0);

  await page.goto("/projects/");
  const projectEntries = page.locator('[data-track-section="project"][data-track-id]');
  expect(await projectEntries.count()).toBeGreaterThan(0);

  const sourceLinks = page.locator('a[data-track-link="project-source"][data-track-id]');
  expect(await sourceLinks.count()).toBeGreaterThan(0);
});
