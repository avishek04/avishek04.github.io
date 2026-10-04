"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { externalReferrerHostname } from "@/lib/analytics";

const ANALYTICS_ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT?.trim();
const SESSION_KEY = "portfolio-analytics-session";
const EXTERNAL_REFERRER_RECORDED_KEY =
  "portfolio-analytics-external-referrer-recorded";
const MINIMUM_DWELL_MS = 1_000;

type SectionType = "experience" | "project";

type AnalyticsEvent =
  | {
      type: "page_view";
      path: string;
      referrerHost?: string;
    }
  | {
      type: "section_dwell";
      path: string;
      sectionType: SectionType;
      sectionId: string;
      durationMs: number;
    }
  | {
      type: "link_click";
      path: string;
      linkType: string;
      itemId?: string;
      destinationHost: string;
      destinationPath: string;
    };

type TrackedSection = {
  sectionType: SectionType;
  sectionId: string;
  inView: boolean;
  startedAt: number | null;
  totalMs: number;
};

type PrivacyNavigator = Navigator & {
  globalPrivacyControl?: boolean;
  msDoNotTrack?: string;
};

type PrivacyWindow = Window & {
  doNotTrack?: string;
};

let inMemorySessionId: string | undefined;
let inMemoryExternalReferrerRecorded = false;

function createIdentifier() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getSessionId() {
  if (inMemorySessionId) {
    return inMemorySessionId;
  }

  try {
    const savedId = window.sessionStorage.getItem(SESSION_KEY);

    if (savedId) {
      inMemorySessionId = savedId;
      return savedId;
    }

    const newId = createIdentifier();
    window.sessionStorage.setItem(SESSION_KEY, newId);
    inMemorySessionId = newId;
    return newId;
  } catch {
    inMemorySessionId = createIdentifier();
    return inMemorySessionId;
  }
}

function trackingIsAllowed() {
  const privacyNavigator = navigator as PrivacyNavigator;
  const privacyWindow = window as PrivacyWindow;

  return !(
    privacyNavigator.globalPrivacyControl === true ||
    privacyNavigator.doNotTrack === "1" ||
    privacyNavigator.msDoNotTrack === "1" ||
    privacyWindow.doNotTrack === "1"
  );
}

function sendAnalyticsEvent(event: AnalyticsEvent, preferBeacon = false) {
  if (!ANALYTICS_ENDPOINT || !trackingIsAllowed()) {
    return;
  }

  const payload = JSON.stringify({
    schemaVersion: 1,
    eventId: createIdentifier(),
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    ...event,
  });

  if (preferBeacon && "sendBeacon" in navigator) {
    const queued = navigator.sendBeacon(
      ANALYTICS_ENDPOINT,
      new Blob([payload], { type: "text/plain;charset=UTF-8" }),
    );

    if (queued) {
      return;
    }
  }

  void fetch(ANALYTICS_ENDPOINT, {
    method: "POST",
    body: payload,
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    credentials: "omit",
    keepalive: true,
    mode: "cors",
  }).catch(() => {
    // Analytics must never interrupt the browsing experience.
  });
}

function getFirstExternalReferrerHost() {
  if (inMemoryExternalReferrerRecorded) {
    return undefined;
  }

  try {
    if (window.sessionStorage.getItem(EXTERNAL_REFERRER_RECORDED_KEY) === "1") {
      inMemoryExternalReferrerRecorded = true;
      return undefined;
    }
  } catch {
    // Continue with in-memory attribution when sessionStorage is unavailable.
  }

  const hostname = externalReferrerHostname(
    document.referrer,
    window.location.hostname,
  );

  if (!hostname) {
    return undefined;
  }

  inMemoryExternalReferrerRecorded = true;

  try {
    window.sessionStorage.setItem(EXTERNAL_REFERRER_RECORDED_KEY, "1");
  } catch {
    // The in-memory flag still prevents duplicates during this page lifecycle.
  }

  return hostname;
}

function isSectionType(value: string | undefined): value is SectionType {
  return value === "experience" || value === "project";
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const initialPageViewSent = useRef(false);

  useEffect(() => {
    if (!ANALYTICS_ENDPOINT || !trackingIsAllowed()) {
      return;
    }

    sendAnalyticsEvent({
      type: "page_view",
      path: pathname,
      referrerHost: initialPageViewSent.current
        ? undefined
        : getFirstExternalReferrerHost(),
    });

    initialPageViewSent.current = true;
  }, [pathname]);

  useEffect(() => {
    if (!ANALYTICS_ENDPOINT || !trackingIsAllowed()) {
      return;
    }

    const handleTrackedClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>("a[data-track-link]");

      if (!link) {
        return;
      }

      const destination = new URL(link.href, window.location.href);

      sendAnalyticsEvent(
        {
          type: "link_click",
          path: window.location.pathname,
          linkType: link.dataset.trackLink ?? "external-link",
          itemId: link.dataset.trackId,
          destinationHost: destination.hostname,
          destinationPath: destination.pathname,
        },
        true,
      );
    };

    document.addEventListener("click", handleTrackedClick, true);

    return () => document.removeEventListener("click", handleTrackedClick, true);
  }, []);

  useEffect(() => {
    if (!ANALYTICS_ENDPOINT || !trackingIsAllowed()) {
      return;
    }

    const sectionStates = new Map<Element, TrackedSection>();
    const elements = document.querySelectorAll<HTMLElement>(
      "[data-track-section][data-track-id]",
    );

    elements.forEach((element) => {
      const sectionType = element.dataset.trackSection;
      const sectionId = element.dataset.trackId;

      if (!isSectionType(sectionType) || !sectionId) {
        return;
      }

      sectionStates.set(element, {
        sectionType,
        sectionId,
        inView: false,
        startedAt: null,
        totalMs: 0,
      });
    });

    const startTimer = (state: TrackedSection) => {
      if (
        state.inView &&
        state.startedAt === null &&
        document.visibilityState === "visible"
      ) {
        state.startedAt = performance.now();
      }
    };

    const stopTimer = (state: TrackedSection) => {
      if (state.startedAt === null) {
        return;
      }

      state.totalMs += performance.now() - state.startedAt;
      state.startedAt = null;
    };

    const flushTimers = (preferBeacon: boolean) => {
      sectionStates.forEach((state) => {
        stopTimer(state);

        if (state.totalMs < MINIMUM_DWELL_MS) {
          return;
        }

        sendAnalyticsEvent(
          {
            type: "section_dwell",
            path: pathname,
            sectionType: state.sectionType,
            sectionId: state.sectionId,
            durationMs: Math.round(state.totalMs),
          },
          preferBeacon,
        );

        state.totalMs = 0;
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const state = sectionStates.get(entry.target);

          if (!state) {
            return;
          }

          state.inView = entry.isIntersecting && entry.intersectionRatio >= 0.55;

          if (state.inView) {
            startTimer(state);
          } else {
            stopTimer(state);
          }
        });
      },
      { threshold: [0, 0.55, 1] },
    );

    sectionStates.forEach((_state, element) => observer.observe(element));

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushTimers(true);
        return;
      }

      sectionStates.forEach(startTimer);
    };

    const handlePageHide = () => flushTimers(true);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      flushTimers(true);
    };
  }, [pathname]);

  return null;
}
