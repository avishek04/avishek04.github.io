export interface Env {
  ANALYTICS_DB: D1Database;
  ANALYTICS_RATE_LIMITER: RateLimit;
  ALLOWED_ORIGINS: string;
  RAW_EVENT_RETENTION_DAYS?: string;
  MAX_EVENTS_PER_SESSION_PER_MINUTE?: string;
}
