# Avishek Choudhury — Portfolio

A static, recruiter-focused portfolio built with Next.js, TypeScript, and Tailwind CSS. It exports plain HTML, CSS, and JavaScript for GitHub Pages.

## Local development

Requirements: Node.js 22.12 or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Editing content

All biography, experience, education, skill-map, project, Explore, contact, social, and SEO content lives in `src/content/portfolio.ts`. Optional fields are hidden automatically when omitted.

- Experience and education sort by their date fields.
- Projects sort by `priority`, then by `year` when available.
- Skill bubbles are sized from linked evidence: experience counts 4, projects count 2, and coursework counts 1. Keep each evidence link pointed at an existing experience, education, or project anchor.
- A verified current experience uses `current: true` to display “Present”; an item without an `endDate` or current confirmation displays only its verified start date.
- Add Explore images under `public/images/explore/`, then set `image` and `imageAlt` on the matching item.
- Replace `public/documents/Avishek-Choudhury-Resume.pdf` whenever the résumé changes; the Home and Contact download links use this file directly.

Review `CONTENT_REVIEW.md` before publishing or using the site in applications.

## Quality checks

```bash
npm run check
npm run build
npm run test:e2e
```

`npm run build` writes the static site to `out/`. Use `npm run preview` to serve that exported build locally.

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` validates pull requests and deploys `out/` after a push to `main`.

In the GitHub repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. The configuration assumes the root-domain repository `avishek04/avishek04.github.io`, so no `basePath` is required.

## Private analytics

The site contains an optional analytics client for page views, external
referrals, experience/project dwell time, and project source-link clicks. It is
disabled unless `NEXT_PUBLIC_ANALYTICS_ENDPOINT` is set. See `ANALYTICS.md` for
the event contract and privacy behavior. The Cloudflare Worker and D1 schema are
implemented in `analytics-worker/` and remain inactive until deployed.
