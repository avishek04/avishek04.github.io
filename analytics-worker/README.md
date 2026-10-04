# Portfolio analytics Worker

This Cloudflare Worker receives analytics events from the static portfolio and
stores them in D1. It has no public reporting endpoint and never stores an IP
address, coordinates, postal code, or browser fingerprint.

## Before the first deployment

From this directory:

```bash
npx wrangler login
npx wrangler d1 create portfolio-analytics --location=wnam
```

Replace the placeholder `database_id` in `wrangler.jsonc` with the identifier
returned by the create command. Keep the binding name as `ANALYTICS_DB`. If
Wrangler offers to add another binding automatically, do not add a duplicate;
the configured binding only needs its real database identifier.

Apply the migration and deploy:

```bash
npm run db:migrate:local
npm run test
npm run db:migrate:remote
npm run deploy
```

The deployment prints the Worker URL. The portfolio endpoint is that URL with
`/events` appended.

## Local development

```bash
npm install
npm run db:migrate:local
npm run dev
```

The Worker normally listens on `http://localhost:8787`. Configure the portfolio
with:

```bash
NEXT_PUBLIC_ANALYTICS_ENDPOINT=http://localhost:8787/events
```

## Data lifecycle

- Raw events are retained for 30 days by default.
- A UTC daily scheduled job creates permanent aggregate rows. Before deleting
  expired raw events, it uses `aggregation_runs` to backfill any completed event
  date whose aggregation is missing or whose recorded event count is stale.
- If any backfill fails, retention cleanup is skipped for that run so the raw
  events remain available for the next retry.
- Location is limited to country, region, and city supplied by Cloudflare.
- The raw request IP is never read or inserted into D1.
- Duplicate event IDs are ignored.
- A Cloudflare Rate Limiting binding rejects more than 120 event requests per
  minute for the same trusted edge-provided client address and Cloudflare
  location. The address is used only as the rate-limit key and is never written
  to D1 or application logs.
- A second per-session guard rejects more than 120 stored events per minute.

## Private queries

No HTTP endpoint exposes reports. Query them through authenticated Wrangler:

```bash
npx wrangler d1 execute portfolio-analytics --remote --command="SELECT * FROM daily_page_views ORDER BY stat_date DESC, page_views DESC LIMIT 50"
```

Useful tables are `daily_site_totals`, `daily_page_views`, `daily_referrers`,
`daily_locations`, `daily_section_dwell`, and `daily_link_clicks`.

The section report exposes both total seconds and average seconds per
session-day. The latter combines multiple timer fragments from the same session
on the same UTC date; `dwell_event_fragments` remains available only as a
diagnostic count.

Run the included 30-day report queries with:

```bash
npx wrangler d1 execute portfolio-analytics --remote --file=./queries/report.sql
```

The edge rate limit uses the `ANALYTICS_RATE_LIMITER` binding configured in
`wrangler.jsonc`; its namespace identifier is public configuration, not a
credential. Origin checks and the two rate guards substantially reduce abuse,
but a public anonymous ingestion endpoint cannot eliminate distributed traffic.
Keep Cloudflare usage alerts enabled and tighten the binding or add a WAF rule if
traffic becomes abnormal.
