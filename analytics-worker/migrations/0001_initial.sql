CREATE TABLE IF NOT EXISTS events (
  event_id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  received_at TEXT NOT NULL,
  received_at_ms INTEGER NOT NULL,
  event_date TEXT NOT NULL,
  client_timestamp TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (
    event_type IN ('page_view', 'section_dwell', 'link_click')
  ),
  path TEXT NOT NULL,
  referrer_host TEXT,
  section_type TEXT CHECK (
    section_type IS NULL OR section_type IN ('experience', 'project')
  ),
  section_id TEXT,
  duration_ms INTEGER,
  link_type TEXT,
  item_id TEXT,
  destination_host TEXT,
  destination_path TEXT,
  country_code TEXT,
  region TEXT,
  city TEXT
);

CREATE INDEX IF NOT EXISTS events_by_date_and_type
  ON events (event_date, event_type);
CREATE INDEX IF NOT EXISTS events_by_session_and_time
  ON events (session_id, received_at_ms);
CREATE INDEX IF NOT EXISTS events_by_received_time
  ON events (received_at_ms);

CREATE TABLE IF NOT EXISTS daily_page_views (
  stat_date TEXT NOT NULL,
  path TEXT NOT NULL,
  page_views INTEGER NOT NULL,
  sessions INTEGER NOT NULL,
  PRIMARY KEY (stat_date, path)
);

CREATE TABLE IF NOT EXISTS daily_referrers (
  stat_date TEXT NOT NULL,
  referrer_host TEXT NOT NULL,
  visits INTEGER NOT NULL,
  sessions INTEGER NOT NULL,
  PRIMARY KEY (stat_date, referrer_host)
);

CREATE TABLE IF NOT EXISTS daily_locations (
  stat_date TEXT NOT NULL,
  country_code TEXT NOT NULL,
  region TEXT NOT NULL,
  city TEXT NOT NULL,
  page_views INTEGER NOT NULL,
  sessions INTEGER NOT NULL,
  PRIMARY KEY (stat_date, country_code, region, city)
);

CREATE TABLE IF NOT EXISTS daily_section_dwell (
  stat_date TEXT NOT NULL,
  section_type TEXT NOT NULL,
  section_id TEXT NOT NULL,
  total_duration_ms INTEGER NOT NULL,
  view_events INTEGER NOT NULL,
  sessions INTEGER NOT NULL,
  PRIMARY KEY (stat_date, section_type, section_id)
);

CREATE TABLE IF NOT EXISTS daily_link_clicks (
  stat_date TEXT NOT NULL,
  link_type TEXT NOT NULL,
  item_id TEXT NOT NULL,
  destination_host TEXT NOT NULL,
  destination_path TEXT NOT NULL,
  clicks INTEGER NOT NULL,
  sessions INTEGER NOT NULL,
  PRIMARY KEY (
    stat_date, link_type, item_id, destination_host, destination_path
  )
);

CREATE TABLE IF NOT EXISTS aggregation_runs (
  stat_date TEXT PRIMARY KEY,
  completed_at TEXT NOT NULL,
  event_count INTEGER NOT NULL
);
