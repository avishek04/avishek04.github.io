export type SectionType = "experience" | "project";

type CommonAnalyticsEvent = {
  schemaVersion: 1;
  eventId: string;
  sessionId: string;
  timestamp: string;
  path: string;
};

export type AnalyticsEvent =
  | (CommonAnalyticsEvent & {
      type: "page_view";
      referrerHost?: string;
    })
  | (CommonAnalyticsEvent & {
      type: "section_dwell";
      sectionType: SectionType;
      sectionId: string;
      durationMs: number;
    })
  | (CommonAnalyticsEvent & {
      type: "link_click";
      linkType: "project-source";
      itemId?: string;
      destinationHost: string;
      destinationPath: string;
    });

export type ParseResult =
  | { ok: true; event: AnalyticsEvent }
  | { ok: false; error: string };

const IDENTIFIER_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{7,127}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HOST_PATTERN = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  record: Record<string, unknown>,
  key: string,
  maximumLength: number,
): string | null {
  const value = record[key];

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maximumLength ? trimmed : null;
}

function optionalString(
  record: Record<string, unknown>,
  key: string,
  maximumLength: number,
): string | null | undefined {
  if (!(key in record)) {
    return undefined;
  }

  return requiredString(record, key, maximumLength);
}

function validPath(value: string, maximumLength = 512): boolean {
  return (
    value.length <= maximumLength &&
    value.startsWith("/") &&
    !/[\u0000-\u001f\u007f]/.test(value)
  );
}

function validTimestamp(value: string): boolean {
  return Number.isFinite(Date.parse(value));
}

function invalidCommonFields(record: Record<string, unknown>) {
  const eventId = requiredString(record, "eventId", 128);
  const sessionId = requiredString(record, "sessionId", 128);
  const timestamp = requiredString(record, "timestamp", 64);
  const path = requiredString(record, "path", 512);

  if (record.schemaVersion !== 1) {
    return "Unsupported analytics schema version.";
  }

  if (!eventId || !IDENTIFIER_PATTERN.test(eventId)) {
    return "Invalid event identifier.";
  }

  if (!sessionId || !IDENTIFIER_PATTERN.test(sessionId)) {
    return "Invalid session identifier.";
  }

  if (!timestamp || !validTimestamp(timestamp)) {
    return "Invalid event timestamp.";
  }

  if (!path || !validPath(path)) {
    return "Invalid page path.";
  }

  return null;
}

function commonFields(record: Record<string, unknown>): CommonAnalyticsEvent {
  return {
    schemaVersion: 1,
    eventId: requiredString(record, "eventId", 128)!,
    sessionId: requiredString(record, "sessionId", 128)!,
    timestamp: new Date(requiredString(record, "timestamp", 64)!).toISOString(),
    path: requiredString(record, "path", 512)!,
  };
}

export function parseAnalyticsEvent(value: unknown): ParseResult {
  if (!isRecord(value)) {
    return { ok: false, error: "The request body must be a JSON object." };
  }

  const commonError = invalidCommonFields(value);

  if (commonError) {
    return { ok: false, error: commonError };
  }

  const common = commonFields(value);

  if (value.type === "page_view") {
    const referrerHost = optionalString(value, "referrerHost", 253);

    if (referrerHost === null || (referrerHost && !HOST_PATTERN.test(referrerHost))) {
      return { ok: false, error: "Invalid referrer hostname." };
    }

    return {
      ok: true,
      event: {
        ...common,
        type: "page_view",
        ...(referrerHost ? { referrerHost: referrerHost.toLowerCase() } : {}),
      },
    };
  }

  if (value.type === "section_dwell") {
    const sectionId = requiredString(value, "sectionId", 128);
    const durationMs = value.durationMs;

    if (value.sectionType !== "experience" && value.sectionType !== "project") {
      return { ok: false, error: "Invalid section type." };
    }

    if (!sectionId || !SLUG_PATTERN.test(sectionId)) {
      return { ok: false, error: "Invalid section identifier." };
    }

    if (
      !Number.isInteger(durationMs) ||
      (durationMs as number) < 1_000 ||
      (durationMs as number) > 86_400_000
    ) {
      return { ok: false, error: "Invalid section duration." };
    }

    return {
      ok: true,
      event: {
        ...common,
        type: "section_dwell",
        sectionType: value.sectionType,
        sectionId,
        durationMs: durationMs as number,
      },
    };
  }

  if (value.type === "link_click") {
    const itemId = optionalString(value, "itemId", 128);
    const destinationHost = requiredString(value, "destinationHost", 253);
    const destinationPath = requiredString(value, "destinationPath", 512);

    if (value.linkType !== "project-source") {
      return { ok: false, error: "Invalid tracked-link type." };
    }

    if (itemId === null || (itemId && !SLUG_PATTERN.test(itemId))) {
      return { ok: false, error: "Invalid tracked-item identifier." };
    }

    if (!destinationHost || !HOST_PATTERN.test(destinationHost)) {
      return { ok: false, error: "Invalid destination hostname." };
    }

    if (!destinationPath || !validPath(destinationPath)) {
      return { ok: false, error: "Invalid destination path." };
    }

    return {
      ok: true,
      event: {
        ...common,
        type: "link_click",
        linkType: "project-source",
        ...(itemId ? { itemId } : {}),
        destinationHost: destinationHost.toLowerCase(),
        destinationPath,
      },
    };
  }

  return { ok: false, error: "Unknown analytics event type." };
}

export function originIsAllowed(origin: string | null, configuredOrigins: string) {
  if (!origin) {
    return false;
  }

  try {
    const normalizedOrigin = new URL(origin).origin;
    return configuredOrigins
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .some((entry) => new URL(entry).origin === normalizedOrigin);
  } catch {
    return false;
  }
}

export type CoarseLocation = {
  countryCode: string | null;
  region: string | null;
  city: string | null;
};

function cleanLocationPart(value: unknown, maximumLength: number) {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, "").trim();
  return cleaned.length > 0 && cleaned.length <= maximumLength ? cleaned : null;
}

export function coarseLocationFromCloudflare(value: unknown): CoarseLocation {
  if (!isRecord(value)) {
    return { countryCode: null, region: null, city: null };
  }

  const countryCode = cleanLocationPart(value.country, 2);

  return {
    countryCode: countryCode?.toUpperCase() ?? null,
    region: cleanLocationPart(value.region, 100),
    city: cleanLocationPart(value.city, 100),
  };
}
