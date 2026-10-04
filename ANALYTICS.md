# Private analytics integration

The portfolio includes a cookieless analytics client, but it is disabled until a
collector URL is configured. It does not add anything visible to the site.

## What the client records

- A page-view event for every route visit, with the route and UTC timestamp.
- The hostname of the first external website that sends a visitor into the
  portfolio during a browser-tab session. Navigation between portfolio pages is
  never stored as a referral, and subsequent external entries in the same tab
  are not attributed again.
- Time spent with each experience or project entry at least 55% visible.
- Clicks on project source-code links, including the project identifier and
  destination host/path.
- A random session identifier stored only in `sessionStorage` so events from one
  browser tab can be grouped without a cookie.

The tracker respects Global Privacy Control and Do Not Track. It does not use
fingerprinting, request precise browser location, or include a visitor's IP
address in its JSON payload.

## Enabling the client

Create `.env.local` for local development or set the same value in the GitHub
Actions build environment:

```bash
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://analytics.example.com/events
```

Because the site is statically exported, changing this value requires a rebuild.
The endpoint must accept cross-origin `POST` requests with a
`text/plain;charset=UTF-8` JSON body. Using `text/plain` lets page-exit beacons
reach the collector without a CORS preflight.

Example event:

```json
{
  "schemaVersion": 1,
  "eventId": "43da11c1-d766-4ef8-9b90-8c6b541a2fd4",
  "sessionId": "2aa9e448-00fb-491a-9dc6-47ee272dced2",
  "timestamp": "2026-10-03T18:15:00.000Z",
  "type": "section_dwell",
  "path": "/projects/",
  "sectionType": "project",
  "sectionId": "dns-resolver",
  "durationMs": 18422
}
```

## Collector and storage

The collector is implemented in `analytics-worker/` as a Cloudflare Worker with
a D1 database. It validates event shapes and permitted origins, applies a basic
per-session rate guard, adds a trusted receipt timestamp, and stores only the
country, region, and city supplied by Cloudflare. It never reads or stores the
raw IP in D1 or application logs, and it never stores latitude, longitude, or
postal code. A Cloudflare Rate Limiting binding uses the edge-provided client
address transiently as a quota key before any D1 query or write; a second limit
is applied to the anonymous browser session identifier.

Every day at 07:15 UTC, a scheduled job creates permanent summaries for:

- page visits grouped by route and date;
- referral counts grouped by hostname;
- total dwell time and average dwell time per distinct session-day, grouped by
  experience/project identifier;
- project source-link clicks grouped by project identifier;
- page views and sessions grouped by coarse location.

Before raw-event retention runs, the job checks `aggregation_runs` and
reprocesses completed dates that were missed or whose event count no longer
matches the source events. Backfills run oldest-first. If a backfill fails, the
job stops before deleting raw data so the next scheduled run can retry it.

Raw events are deleted after 30 days by default. Daily aggregate rows remain in
D1. The Worker exposes only `/events` for writes and `/health`; it has no public
report-reading endpoint.

The deployment flow is:

```text
Browser -> Cloudflare Worker -> private D1 database -> daily aggregate tables
```

Follow `analytics-worker/README.md` to create the D1 database, apply migrations,
test, and deploy the Worker. Then set the GitHub repository variable
`NEXT_PUBLIC_ANALYTICS_ENDPOINT` to the deployed Worker URL ending in `/events`.

Even though analytics are not rendered in the interface, network requests can
always be inspected with browser developer tools. The site's privacy disclosure
should state what is collected before analytics are enabled publicly.
