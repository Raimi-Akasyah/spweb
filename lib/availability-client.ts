import type { AvailabilityDate, AvailabilityStatus } from "@/lib/availability";

type AvailabilityPayload = {
  ok?: boolean;
  entries?: unknown;
  error?: string;
};

type StoredAvailability = {
  entries: AvailabilityDate[];
  savedAt: number;
};

export type CachedAvailability = StoredAvailability & {
  isFresh: boolean;
};

const cacheDurationMs = 60_000;
const cachePrefix = "senangplanner:availability:v1:";
const validStatuses = new Set<AvailabilityStatus>(["kosong", "hampir-penuh", "penuh"]);
const memoryCache = new Map<string, StoredAvailability>();
const inFlightRequests = new Map<string, Promise<AvailabilityDate[]>>();
let callbackSequence = 0;

function cacheKey(endpoint: string, month: string) {
  return `${cachePrefix}${encodeURIComponent(endpoint)}:${month}`;
}

function isAvailabilityDate(value: unknown): value is AvailabilityDate {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
    typeof entry.status === "string" &&
    validStatuses.has(entry.status as AvailabilityStatus) &&
    (entry.note === undefined || typeof entry.note === "string")
  );
}

function isStoredAvailability(value: unknown): value is StoredAvailability {
  if (!value || typeof value !== "object") return false;
  const stored = value as Record<string, unknown>;
  return (
    typeof stored.savedAt === "number" &&
    Number.isFinite(stored.savedAt) &&
    Array.isArray(stored.entries) &&
    stored.entries.every(isAvailabilityDate)
  );
}

function readCache(key: string): StoredAvailability | null {
  const inMemory = memoryCache.get(key);
  if (inMemory) return inMemory;
  if (typeof window === "undefined") return null;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(key);
  } catch (error) {
    console.warn("Could not read the availability cache.", error);
    return null;
  }
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isStoredAvailability(parsed)) {
      window.localStorage.removeItem(key);
      return null;
    }
    memoryCache.set(key, parsed);
    return parsed;
  } catch (error) {
    console.warn("Discarding an invalid availability cache.", error);
    try {
      window.localStorage.removeItem(key);
    } catch (removeError) {
      console.warn("Could not remove the invalid availability cache.", removeError);
    }
    return null;
  }
}

function saveCache(key: string, entries: AvailabilityDate[]) {
  const stored = { entries, savedAt: Date.now() };
  memoryCache.set(key, stored);
  try {
    window.localStorage.setItem(key, JSON.stringify(stored));
  } catch (error) {
    console.warn("Could not persist the availability cache.", error);
  }
}

export function readCachedAvailability(
  endpoint: string,
  month: string,
): CachedAvailability | null {
  const cached = readCache(cacheKey(endpoint, month));
  return cached
    ? { ...cached, isFresh: Date.now() - cached.savedAt < cacheDurationMs }
    : null;
}

export function fetchAvailabilityMonth(
  endpoint: string,
  month: string,
  forceRefresh = false,
): Promise<AvailabilityDate[]> {
  const key = cacheKey(endpoint, month);
  const cached = readCache(key);
  if (!forceRefresh && cached && Date.now() - cached.savedAt < cacheDurationMs) {
    return Promise.resolve(cached.entries);
  }

  const existingRequest = inFlightRequests.get(key);
  if (existingRequest) return existingRequest;

  const callbackName = `senangCallback_availability_${Date.now()}_${callbackSequence++}`;
  const request = new Promise<AvailabilityDate[]>((resolve, reject) => {
    const script = document.createElement("script");
    let settled = false;
    const timeoutId = window.setTimeout(
      () => finishWithError(new Error("Availability request timed out.")),
      15_000,
    );

    function cleanup() {
      window.clearTimeout(timeoutId);
      script.remove();
      Reflect.deleteProperty(window, callbackName);
    }

    function finishWithError(error: Error) {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    }

    function finishWithEntries(entries: AvailabilityDate[]) {
      if (settled) return;
      settled = true;
      cleanup();
      saveCache(key, entries);
      resolve(entries);
    }

    if (!Reflect.set(window, callbackName, (payload: AvailabilityPayload) => {
      if (!payload.ok || !Array.isArray(payload.entries) || !payload.entries.every(isAvailabilityDate)) {
        finishWithError(new Error(payload.error || "Could not load availability."));
        return;
      }
      finishWithEntries(payload.entries);
    })) {
      finishWithError(new Error("Could not initialize the availability callback."));
      return;
    }

    try {
      const url = new URL(endpoint);
      url.searchParams.set("action", "availability");
      url.searchParams.set("month", month);
      url.searchParams.set("callback", callbackName);
      script.async = true;
      script.src = url.toString();
      script.onerror = () => finishWithError(new Error("Availability is temporarily unavailable."));
      script.onload = () => {
        if (!settled) finishWithError(new Error("Availability response did not include a callback."));
      };
      document.head.appendChild(script);
    } catch (error) {
      finishWithError(error instanceof Error ? error : new Error("Invalid availability endpoint."));
    }
  }).finally(() => {
    inFlightRequests.delete(key);
  });

  inFlightRequests.set(key, request);
  return request;
}
