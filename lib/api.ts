/**
 * HTTP client for the two·tickets backend (FastAPI — see backend/README.md §8).
 *
 * Every route lives under `${NEXT_PUBLIC_API_BASE_URL}/api/v1`. Failures come back
 * as `ApiError` carrying the backend's own `detail` string, so the UI can say what
 * actually went wrong instead of "something failed".
 */

/** The deployed backend. Override with NEXT_PUBLIC_API_BASE_URL to use a local one. */
const DEPLOYED_API = "https://ohys7a7koazwgvaopochceokye0htxhz.lambda-url.ap-south-1.on.aws";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? DEPLOYED_API
).replace(/\/+$/, "");

const PREFIX = "/api/v1";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly detail: string,
    readonly path: string,
  ) {
    super(detail);
    this.name = "ApiError";
  }

  /** True when the backend could not be reached at all. */
  get offline(): boolean {
    return this.status === 0;
  }
}

type QueryValue = string | number | boolean | undefined;
export type Query = Record<string, QueryValue>;

interface RequestOptions {
  body?: unknown;
  query?: Query;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Query): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) search.set(key, String(value));
  }
  const qs = search.toString();
  return `${API_BASE_URL}${PREFIX}${path}${qs ? `?${qs}` : ""}`;
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** FastAPI sends `detail` as a string (HTTPException) or a list of issues (422). */
function detailOf(payload: unknown): string | null {
  if (typeof payload === "string") return payload || null;
  if (!payload || typeof payload !== "object") return null;
  const detail = (payload as { detail?: unknown }).detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((issue) => {
        if (!issue || typeof issue !== "object") return null;
        const { loc, msg } = issue as { loc?: unknown[]; msg?: string };
        const field = Array.isArray(loc) ? loc.filter((p) => p !== "body").join(".") : "";
        return field ? `${field}: ${msg}` : msg ?? null;
      })
      .filter(Boolean);
    if (messages.length) return messages.join("; ");
  }
  return null;
}

async function request<T>(method: string, path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  // Only needed when the backend runs with AUTH_ENABLED=true; harmless otherwise.
  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, opts.query), {
      method,
      headers,
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
      signal: opts.signal,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new ApiError(0, "Can't reach the backend. Is it running?", path);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  const payload = text ? parseJson(text) : null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      detailOf(payload) ?? `Request failed with ${response.status}`,
      path,
    );
  }
  return payload as T;
}

export const apiGet = <T>(path: string, query?: Query, signal?: AbortSignal) =>
  request<T>("GET", path, { query, signal });

export const apiPost = <T>(path: string, body?: unknown, query?: Query) =>
  request<T>("POST", path, { body, query });

export const apiPatch = <T>(path: string, body: unknown) => request<T>("PATCH", path, { body });

/** Most DELETE routes return 204; a couple return the updated trip, hence the generic. */
export const apiDelete = <T = void>(path: string) => request<T>("DELETE", path);

/** Health probe (unprefixed route) — used to tell "backend down" from "no data yet". */
export async function apiHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, { signal });
    return response.ok;
  } catch {
    return false;
  }
}
