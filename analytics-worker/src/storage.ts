import type { Env } from "./env";
import type { AnalyticsEvent, CoarseLocation } from "./validation";

const MINUTE_MS = 60_000;
const DAY_MS = 86_400_000;

function configuredInteger(
  value: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : fallback;
}

export async function sessionRateLimitExceeded(
  env: Env,
  sessionId: string,
  nowMs: number,
) {
  const limit = configuredInteger(
    env.MAX_EVENTS_PER_SESSION_PER_MINUTE,
    120,
    10,
    1_000,
  );
  const result = await env.ANALYTICS_DB.prepare(
    `SELECT COUNT(*) AS event_count
     FROM events
     WHERE session_id = ? AND received_at_ms >= ?`,
  )
    .bind(sessionId, nowMs - MINUTE_MS)
    .first<{ event_count: number }>();

  return (result?.event_count ?? 0) >= limit;
}

export async function storeAnalyticsEvent(
  env: Env,
  event: AnalyticsEvent,
  location: CoarseLocation,
  now: Date,
) {
  const sectionType = event.type === "section_dwell" ? event.sectionType : null;
  const sectionId = event.type === "section_dwell" ? event.sectionId : null;
  const durationMs = event.type === "section_dwell" ? event.durationMs : null;
  const referrerHost = event.type === "page_view" ? event.referrerHost ?? null : null;
  const linkType = event.type === "link_click" ? event.linkType : null;
  const itemId = event.type === "link_click" ? event.itemId ?? null : null;
  const destinationHost =
    event.type === "link_click" ? event.destinationHost : null;
  const destinationPath =
    event.type === "link_click" ? event.destinationPath : null;
  const receivedAt = now.toISOString();

  await env.ANALYTICS_DB.prepare(
    `INSERT OR IGNORE INTO events (
       event_id, session_id, received_at, received_at_ms, event_date,
       client_timestamp, event_type, path, referrer_host, section_type,
       section_id, duration_ms, link_type, item_id, destination_host,
       destination_path, country_code, region, city
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      event.eventId,
      event.sessionId,
      receivedAt,
      now.getTime(),
      receivedAt.slice(0, 10),
      event.timestamp,
      event.type,
      event.path,
      referrerHost,
      sectionType,
      sectionId,
      durationMs,
      linkType,
      itemId,
      destinationHost,
      destinationPath,
      location.countryCode,
      location.region,
      location.city,
    )
    .run();
}

export function previousUtcDate(anchor: Date) {
  return new Date(anchor.getTime() - DAY_MS).toISOString().slice(0, 10);
}

export async function aggregationDatesNeedingRefresh(
  db: D1Database,
  anchor: Date,
) {
  const currentUtcDate = anchor.toISOString().slice(0, 10);
  const result = await db.prepare(
    `SELECT events.event_date AS stat_date
     FROM events
     LEFT JOIN aggregation_runs
       ON aggregation_runs.stat_date = events.event_date
     WHERE events.event_date < ?
     GROUP BY events.event_date
     HAVING COALESCE(MAX(aggregation_runs.event_count), -1) <> COUNT(*)
     ORDER BY events.event_date ASC`,
  )
    .bind(currentUtcDate)
    .all<{ stat_date: string }>();
  const dates = new Set([previousUtcDate(anchor)]);

  for (const row of result.results) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(row.stat_date) && row.stat_date < currentUtcDate) {
      dates.add(row.stat_date);
    }
  }

  return [...dates].sort();
}

export async function aggregateDay(db: D1Database, date: string, completedAt: Date) {
  await db.batch([
    db.prepare("DELETE FROM daily_site_totals WHERE stat_date = ?").bind(date),
    db.prepare(
      `INSERT INTO daily_site_totals (
         stat_date, page_views, sessions, dwell_events, link_clicks, all_events
       )
       SELECT ?,
              COALESCE(SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END), 0),
              COUNT(DISTINCT session_id),
              COALESCE(SUM(CASE WHEN event_type = 'section_dwell' THEN 1 ELSE 0 END), 0),
              COALESCE(SUM(CASE WHEN event_type = 'link_click' THEN 1 ELSE 0 END), 0),
              COUNT(*)
       FROM events
       WHERE event_date = ?`,
    ).bind(date, date),
    db.prepare("DELETE FROM daily_page_views WHERE stat_date = ?").bind(date),
    db.prepare(
      `INSERT INTO daily_page_views (stat_date, path, page_views, sessions)
       SELECT event_date, path, COUNT(*), COUNT(DISTINCT session_id)
       FROM events
       WHERE event_date = ? AND event_type = 'page_view'
       GROUP BY event_date, path`,
    ).bind(date),
    db.prepare("DELETE FROM daily_referrers WHERE stat_date = ?").bind(date),
    db.prepare(
      `INSERT INTO daily_referrers (stat_date, referrer_host, visits, sessions)
       SELECT event_date, referrer_host, COUNT(*), COUNT(DISTINCT session_id)
       FROM events
       WHERE event_date = ? AND event_type = 'page_view' AND referrer_host IS NOT NULL
       GROUP BY event_date, referrer_host`,
    ).bind(date),
    db.prepare("DELETE FROM daily_locations WHERE stat_date = ?").bind(date),
    db.prepare(
      `INSERT INTO daily_locations (
         stat_date, country_code, region, city, page_views, sessions
       )
       SELECT event_date, COALESCE(country_code, ''), COALESCE(region, ''),
              COALESCE(city, ''), COUNT(*), COUNT(DISTINCT session_id)
       FROM events
       WHERE event_date = ? AND event_type = 'page_view'
       GROUP BY event_date, COALESCE(country_code, ''), COALESCE(region, ''),
                COALESCE(city, '')`,
    ).bind(date),
    db.prepare("DELETE FROM daily_section_dwell WHERE stat_date = ?").bind(date),
    db.prepare(
      `INSERT INTO daily_section_dwell (
         stat_date, section_type, section_id, total_duration_ms, view_events, sessions
       )
       SELECT event_date, section_type, section_id, SUM(duration_ms), COUNT(*),
              COUNT(DISTINCT session_id)
       FROM events
       WHERE event_date = ? AND event_type = 'section_dwell'
       GROUP BY event_date, section_type, section_id`,
    ).bind(date),
    db.prepare("DELETE FROM daily_link_clicks WHERE stat_date = ?").bind(date),
    db.prepare(
      `INSERT INTO daily_link_clicks (
         stat_date, link_type, item_id, destination_host, destination_path,
         clicks, sessions
       )
       SELECT event_date, link_type, COALESCE(item_id, ''), destination_host,
              destination_path, COUNT(*), COUNT(DISTINCT session_id)
       FROM events
       WHERE event_date = ? AND event_type = 'link_click'
       GROUP BY event_date, link_type, COALESCE(item_id, ''), destination_host,
                destination_path`,
    ).bind(date),
    db.prepare(
      `INSERT INTO aggregation_runs (stat_date, completed_at, event_count)
       VALUES (?, ?, (SELECT COUNT(*) FROM events WHERE event_date = ?))
       ON CONFLICT(stat_date) DO UPDATE SET
         completed_at = excluded.completed_at,
         event_count = excluded.event_count`,
    ).bind(date, completedAt.toISOString(), date),
  ]);
}

export async function deleteExpiredEvents(
  db: D1Database,
  anchor: Date,
  configuredRetentionDays?: string,
) {
  const retentionDays = configuredInteger(configuredRetentionDays, 30, 1, 365);
  const cutoff = anchor.getTime() - retentionDays * DAY_MS;

  await db.prepare("DELETE FROM events WHERE received_at_ms < ?").bind(cutoff).run();
}

export async function runDailyMaintenance(env: Env, anchor: Date) {
  const dates = await aggregationDatesNeedingRefresh(env.ANALYTICS_DB, anchor);

  for (const date of dates) {
    await aggregateDay(env.ANALYTICS_DB, date, anchor);
  }

  await deleteExpiredEvents(
    env.ANALYTICS_DB,
    anchor,
    env.RAW_EVENT_RETENTION_DAYS,
  );
}
