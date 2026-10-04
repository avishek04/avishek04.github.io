import type { Env } from "./env";

const UNAVAILABLE_CLIENT_ADDRESS = "unavailable";

export function trustedClientRateLimitKey(request: Request) {
  const connectingAddress = request.headers.get("CF-Connecting-IP")?.trim();
  const safeAddress =
    connectingAddress && connectingAddress.length <= 64
      ? connectingAddress
      : UNAVAILABLE_CLIENT_ADDRESS;

  return `events:${safeAddress}`;
}

export async function edgeRateLimitExceeded(request: Request, env: Env) {
  const outcome = await env.ANALYTICS_RATE_LIMITER.limit({
    key: trustedClientRateLimitKey(request),
  });

  return !outcome.success;
}
