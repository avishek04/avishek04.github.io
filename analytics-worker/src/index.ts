import type { Env } from "./env";
import { edgeRateLimitExceeded } from "./rate-limit";
import {
  runDailyMaintenance,
  sessionRateLimitExceeded,
  storeAnalyticsEvent,
} from "./storage";
import {
  coarseLocationFromCloudflare,
  originIsAllowed,
  parseAnalyticsEvent,
} from "./validation";

const MAX_BODY_BYTES = 8_192;

type RequestWithCloudflare = Request & {
  cf?: unknown;
};

function securityHeaders() {
  return {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Robots-Tag": "noindex",
  };
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  origin?: string,
) {
  return Response.json(body, {
    status,
    headers: {
      ...securityHeaders(),
      ...(origin ? corsHeaders(origin) : {}),
    },
  });
}

function contentTypeIsSupported(request: Request) {
  const contentType = request.headers.get("Content-Type")?.toLowerCase() ?? "";
  return (
    contentType.startsWith("text/plain") ||
    contentType.startsWith("application/json")
  );
}

async function handleEventRequest(request: RequestWithCloudflare, env: Env) {
  const origin = request.headers.get("Origin");

  if (!originIsAllowed(origin, env.ALLOWED_ORIGINS)) {
    return jsonResponse({ accepted: false, error: "Origin is not allowed." }, 403);
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { ...securityHeaders(), ...corsHeaders(origin!) },
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(
      { accepted: false, error: "Method is not allowed." },
      405,
      origin!,
    );
  }

  if (await edgeRateLimitExceeded(request, env)) {
    return jsonResponse(
      { accepted: false, error: "Request rate limit exceeded." },
      429,
      origin!,
    );
  }

  if (!contentTypeIsSupported(request)) {
    return jsonResponse(
      { accepted: false, error: "Unsupported content type." },
      415,
      origin!,
    );
  }

  const declaredLength = Number.parseInt(
    request.headers.get("Content-Length") ?? "0",
    10,
  );

  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return jsonResponse(
      { accepted: false, error: "Request body is too large." },
      413,
      origin!,
    );
  }

  const body = await request.text();

  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) {
    return jsonResponse(
      { accepted: false, error: "Request body is too large." },
      413,
      origin!,
    );
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body);
  } catch {
    return jsonResponse(
      { accepted: false, error: "Request body is not valid JSON." },
      400,
      origin!,
    );
  }

  const parsed = parseAnalyticsEvent(payload);

  if (!parsed.ok) {
    return jsonResponse({ accepted: false, error: parsed.error }, 400, origin!);
  }

  const now = new Date();

  try {
    if (
      await sessionRateLimitExceeded(
        env,
        parsed.event.sessionId,
        now.getTime(),
      )
    ) {
      return jsonResponse(
        { accepted: false, error: "Event rate limit exceeded." },
        429,
        origin!,
      );
    }

    await storeAnalyticsEvent(
      env,
      parsed.event,
      coarseLocationFromCloudflare(request.cf),
      now,
    );
  } catch (error) {
    console.error(
      "Analytics event could not be stored.",
      error instanceof Error ? error.message : "Unknown storage error",
    );
    return jsonResponse(
      { accepted: false, error: "Analytics storage is unavailable." },
      503,
      origin!,
    );
  }

  return jsonResponse({ accepted: true }, 202, origin!);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health" && request.method === "GET") {
      return jsonResponse({ status: "ok" }, 200);
    }

    if (url.pathname === "/events") {
      return handleEventRequest(request, env);
    }

    return jsonResponse({ error: "Not found." }, 404);
  },

  async scheduled(controller, env, context) {
    context.waitUntil(
      runDailyMaintenance(env, new Date(controller.scheduledTime)).catch((error) => {
        console.error(
          "Daily analytics maintenance failed.",
          error instanceof Error ? error.message : "Unknown maintenance error",
        );
        throw error;
      }),
    );
  },
} satisfies ExportedHandler<Env>;
