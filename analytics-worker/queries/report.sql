-- Overall traffic by completed UTC day.
SELECT *
FROM daily_site_totals
WHERE stat_date >= date('now', '-30 days')
ORDER BY stat_date DESC;

-- Page traffic over the last 30 completed UTC days.
SELECT
  path,
  SUM(page_views) AS page_views,
  SUM(sessions) AS daily_sessions
FROM daily_page_views
WHERE stat_date >= date('now', '-30 days')
GROUP BY path
ORDER BY page_views DESC;

-- Experiences and projects ranked by average session-day engagement.
-- `view_events` is diagnostic only: one session can emit multiple fragments
-- when the page is hidden or navigation flushes an active timer.
SELECT
  section_type,
  section_id,
  ROUND(SUM(total_duration_ms) / 1000.0, 1) AS total_seconds,
  ROUND(SUM(total_duration_ms) / NULLIF(SUM(sessions), 0) / 1000.0, 1)
    AS average_seconds_per_session_day,
  SUM(sessions) AS session_days,
  SUM(view_events) AS dwell_event_fragments
FROM daily_section_dwell
WHERE stat_date >= date('now', '-30 days')
GROUP BY section_type, section_id
ORDER BY average_seconds_per_session_day DESC, total_seconds DESC;

-- Project source links ranked by clicks.
SELECT
  item_id,
  destination_host,
  destination_path,
  SUM(clicks) AS clicks
FROM daily_link_clicks
WHERE stat_date >= date('now', '-30 days')
GROUP BY item_id, destination_host, destination_path
ORDER BY clicks DESC;

-- External websites that referred visitors.
SELECT referrer_host, SUM(visits) AS visits
FROM daily_referrers
WHERE stat_date >= date('now', '-30 days')
GROUP BY referrer_host
ORDER BY visits DESC;

-- Coarse locations ranked by page views. Empty fields mean unavailable.
SELECT country_code, region, city, SUM(page_views) AS page_views
FROM daily_locations
WHERE stat_date >= date('now', '-30 days')
GROUP BY country_code, region, city
ORDER BY page_views DESC;
