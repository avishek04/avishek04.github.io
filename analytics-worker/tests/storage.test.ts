import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Env } from "../src/env";
import {
  aggregationDatesNeedingRefresh,
  previousUtcDate,
  runDailyMaintenance,
} from "../src/storage";

type MockStatement = {
  bind: (...values: unknown[]) => MockStatement;
  all: <T>() => Promise<{ results: T[] }>;
  run: () => Promise<object>;
};

function maintenanceDatabase(
  pendingDates: string[],
  options: { failFirstBatch?: boolean } = {},
) {
  const aggregatedDates: string[] = [];
  let retentionCleanupStarted = false;
  let batchCount = 0;

  const db = {
    prepare(sql: string) {
      const statement: MockStatement = {
        bind(...values: unknown[]) {
          if (sql.startsWith("DELETE FROM daily_site_totals")) {
            aggregatedDates.push(String(values[0]));
          }

          if (sql.startsWith("DELETE FROM events WHERE received_at_ms")) {
            retentionCleanupStarted = true;
          }

          return statement;
        },
        async all<T>() {
          return {
            results: pendingDates.map((stat_date) => ({ stat_date })) as T[],
          };
        },
        async run() {
          return {};
        },
      };

      return statement;
    },
    async batch() {
      batchCount += 1;

      if (options.failFirstBatch && batchCount === 1) {
        throw new Error("Simulated aggregation failure");
      }

      return [];
    },
  } as unknown as D1Database;

  return {
    db,
    aggregatedDates,
    get retentionCleanupStarted() {
      return retentionCleanupStarted;
    },
  };
}

describe("daily aggregation date", () => {
  it("uses the previous UTC calendar day", () => {
    assert.equal(
      previousUtcDate(new Date("2026-10-03T07:15:00.000Z")),
      "2026-10-02",
    );
  });

  it("crosses month and year boundaries safely", () => {
    assert.equal(
      previousUtcDate(new Date("2026-01-01T07:15:00.000Z")),
      "2025-12-31",
    );
  });
});

describe("daily aggregation backfill", () => {
  it("includes stale event dates and the previous UTC day oldest-first", async () => {
    const database = maintenanceDatabase([
      "2026-10-01",
      "invalid-date",
      "2026-09-30",
      "2026-10-03",
    ]);

    assert.deepEqual(
      await aggregationDatesNeedingRefresh(
        database.db,
        new Date("2026-10-03T07:15:00.000Z"),
      ),
      ["2026-09-30", "2026-10-01", "2026-10-02"],
    );
  });

  it("backfills every missing date before retention cleanup", async () => {
    const database = maintenanceDatabase(["2026-10-01", "2026-09-30"]);
    const env = {
      ANALYTICS_DB: database.db,
      RAW_EVENT_RETENTION_DAYS: "30",
    } as Env;

    await runDailyMaintenance(env, new Date("2026-10-03T07:15:00.000Z"));

    assert.deepEqual(database.aggregatedDates, [
      "2026-09-30",
      "2026-10-01",
      "2026-10-02",
    ]);
    assert.equal(database.retentionCleanupStarted, true);
  });

  it("does not start retention cleanup when a backfill fails", async () => {
    const database = maintenanceDatabase(["2026-09-30"], {
      failFirstBatch: true,
    });
    const env = {
      ANALYTICS_DB: database.db,
      RAW_EVENT_RETENTION_DAYS: "30",
    } as Env;

    await assert.rejects(
      runDailyMaintenance(env, new Date("2026-10-03T07:15:00.000Z")),
      /Simulated aggregation failure/,
    );
    assert.equal(database.retentionCleanupStarted, false);
  });
});
