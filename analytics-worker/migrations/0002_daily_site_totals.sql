CREATE TABLE IF NOT EXISTS daily_site_totals (
  stat_date TEXT PRIMARY KEY,
  page_views INTEGER NOT NULL,
  sessions INTEGER NOT NULL,
  dwell_events INTEGER NOT NULL,
  link_clicks INTEGER NOT NULL,
  all_events INTEGER NOT NULL
);
