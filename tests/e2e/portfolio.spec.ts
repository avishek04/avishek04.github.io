import { expect, test } from "@playwright/test";

const routes = [
  { path: "/", heading: /Avishek Choudhury/i },
  { path: "/experience/", heading: /^Experience$/i },
  { path: "/education/", heading: /^Education$/i },
  { path: "/projects/", heading: /Selected projects/i },
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
  await page.getByTestId("copy-email").click();
  await expect(page.getByTestId("copy-status")).toHaveText("Email copied");

  const externalLinks = page.locator('a[target="_blank"]');
  const count = await externalLinks.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    await expect(externalLinks.nth(index)).toHaveAttribute("rel", /noreferrer/);
  }
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
  await expect(page.getByRole("link", { name: /Download résumé/i })).toBeVisible();
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
