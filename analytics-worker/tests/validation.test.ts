import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  coarseLocationFromCloudflare,
  originIsAllowed,
  parseAnalyticsEvent,
} from "../src/validation";

const commonEvent = {
  schemaVersion: 1,
  eventId: "43da11c1-d766-4ef8-9b90-8c6b541a2fd4",
  sessionId: "2aa9e448-00fb-491a-9dc6-47ee272dced2",
  timestamp: "2026-10-03T18:15:00.000Z",
  path: "/projects/",
};

describe("analytics event validation", () => {
  it("accepts a valid page view", () => {
    const result = parseAnalyticsEvent({
      ...commonEvent,
      type: "page_view",
      referrerHost: "www.linkedin.com",
    });

    assert.equal(result.ok, true);
  });

  it("accepts a valid section dwell event", () => {
    const result = parseAnalyticsEvent({
      ...commonEvent,
      type: "section_dwell",
      sectionType: "project",
      sectionId: "dns-resolver",
      durationMs: 18_422,
    });

    assert.equal(result.ok, true);
  });

  it("rejects invalid and excessive dwell durations", () => {
    const result = parseAnalyticsEvent({
      ...commonEvent,
      type: "section_dwell",
      sectionType: "project",
      sectionId: "dns-resolver",
      durationMs: 200,
    });

    assert.equal(result.ok, false);
  });

  it("accepts only configured origins", () => {
    const configured = "https://avishek04.github.io,http://localhost:3000";

    assert.equal(originIsAllowed("https://avishek04.github.io", configured), true);
    assert.equal(originIsAllowed("https://example.com", configured), false);
    assert.equal(originIsAllowed(null, configured), false);
  });

  it("keeps only coarse location fields", () => {
    assert.deepEqual(
      coarseLocationFromCloudflare({
        country: "us",
        region: "Utah",
        city: "Salt Lake City",
        postalCode: "84101",
        latitude: "40.7608",
        longitude: "-111.8910",
      }),
      {
        countryCode: "US",
        region: "Utah",
        city: "Salt Lake City",
      },
    );
  });
});
