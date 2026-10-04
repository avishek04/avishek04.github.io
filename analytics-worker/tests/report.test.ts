import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

function sectionEngagementQuery() {
  const report = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "../queries/report.sql"),
    "utf8",
  );
  const [, sectionReport] = report.split(
    "-- Experiences and projects ranked by average session-day engagement.",
  );
  const [query] = sectionReport.split("-- Project source links ranked by clicks.");

  return query.trim();
}

describe("section engagement report", () => {
  it("combines event fragments and ranks by average time per session-day", () => {
    const database = new DatabaseSync(":memory:");
    database.exec(`
      CREATE TABLE daily_section_dwell (
        stat_date TEXT NOT NULL,
        section_type TEXT NOT NULL,
        section_id TEXT NOT NULL,
        total_duration_ms INTEGER NOT NULL,
        view_events INTEGER NOT NULL,
        sessions INTEGER NOT NULL
      );

      INSERT INTO daily_section_dwell VALUES
        (date('now', '-1 day'), 'project', 'fragmented-project', 120000, 3, 1),
        (date('now', '-1 day'), 'project', 'multi-session-project', 180000, 2, 2);
    `);

    const rows = database.prepare(sectionEngagementQuery()).all() as Array<{
      section_id: string;
      total_seconds: number;
      average_seconds_per_session_day: number;
      session_days: number;
      dwell_event_fragments: number;
    }>;

    assert.equal(rows[0].section_id, "fragmented-project");
    assert.equal(rows[0].total_seconds, 120);
    assert.equal(rows[0].average_seconds_per_session_day, 120);
    assert.equal(rows[0].session_days, 1);
    assert.equal(rows[0].dwell_event_fragments, 3);
    assert.equal(rows[1].average_seconds_per_session_day, 90);

    database.close();
  });
});
