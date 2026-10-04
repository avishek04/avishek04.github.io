import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Env } from "../src/env";
import worker from "../src/index";
import {
  edgeRateLimitExceeded,
  trustedClientRateLimitKey,
} from "../src/rate-limit";

function requestWithHeaders(headers: HeadersInit = {}) {
  return new Request("https://analytics.example.com/events", { headers });
}

describe("edge request rate limiting", () => {
  it("keys limits with Cloudflare's trusted connecting address", () => {
    const request = requestWithHeaders({
      "CF-Connecting-IP": "203.0.113.42",
      "X-Forwarded-For": "198.51.100.9",
    });

    assert.equal(trustedClientRateLimitKey(request), "events:203.0.113.42");
  });

  it("uses one conservative fallback bucket when the edge header is absent", () => {
    const request = requestWithHeaders({
      "X-Forwarded-For": "198.51.100.9",
    });

    assert.equal(trustedClientRateLimitKey(request), "events:unavailable");
  });

  it("reports rejected requests from the Cloudflare binding", async () => {
    let observedKey = "";
    const limiter: RateLimit = {
      async limit({ key }) {
        observedKey = key;
        return { success: false };
      },
    };
    const env = { ANALYTICS_RATE_LIMITER: limiter } as Env;
    const request = requestWithHeaders({ "CF-Connecting-IP": "2001:db8::1" });

    assert.equal(await edgeRateLimitExceeded(request, env), true);
    assert.equal(observedKey, "events:2001:db8::1");
  });

  it("rejects an over-limit event before reading from D1", async () => {
    let databaseWasUsed = false;
    const env = {
      ANALYTICS_DB: {
        prepare() {
          databaseWasUsed = true;
          throw new Error("D1 should not be reached for a rate-limited request.");
        },
      } as unknown as D1Database,
      ANALYTICS_RATE_LIMITER: {
        async limit() {
          return { success: false };
        },
      },
      ALLOWED_ORIGINS: "https://avishek04.github.io",
    } as Env;
    const request = new Request("https://analytics.example.com/events", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "CF-Connecting-IP": "203.0.113.42",
        Origin: "https://avishek04.github.io",
      },
      body: "{}",
    });

    const response = await worker.fetch(
      request as Parameters<typeof worker.fetch>[0],
      env,
    );

    assert.equal(response.status, 429);
    assert.equal(databaseWasUsed, false);
  });
});
