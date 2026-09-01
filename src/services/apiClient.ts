const DEFAULT_TIMEOUT_MS = 10000;
const DEFAULT_MOCK_DELAY_MS = 250;

export interface ApiClientOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Carries whatever safe `{ code, message }` the server actually sent, so a
 * caller can show the real cause of a failure instead of a hardcoded
 * generic string. The server already sanitizes `message` before sending it
 * (never a raw provider error, never a credential) — safe to display as-is.
 */
export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...init } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(path, { ...init, signal: controller.signal });
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new ApiError(
        (body?.message as string | undefined) || `Request failed with status ${response.status}`,
        response.status,
        body?.code as string | undefined,
      );
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

/** The message an `ApiError` carries is already safe to show (the server
 * sanitizes it) — this only falls back to a generic string for a genuinely
 * unexpected failure (network error, timeout, a response with no body). */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) return error.message;
  return fallback;
}

export const apiClient = {
  get: <T>(path: string, options?: ApiClientOptions) => request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: ApiClientOptions) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json', ...options?.headers },
    }),
};

export type QueryParams = Record<string, string | number | undefined>;

export function buildQueryString(params: QueryParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

interface CacheEntry<T> {
  expires: number;
  value: T;
}

const responseCache = new Map<string, CacheEntry<unknown>>();
const inFlightRequests = new Map<string, Promise<unknown>>();

/**
 * GET with a short-lived cache and in-flight de-duping, so identical feeds
 * (e.g. re-rendering the same category) don't trigger repeat network calls.
 */
export function cachedGet<T>(path: string, params: QueryParams = {}, ttlMs = 0): Promise<T> {
  const key = `${path}${buildQueryString(params)}`;

  const cached = responseCache.get(key);
  if (cached && cached.expires > Date.now()) {
    return Promise.resolve(cached.value as T);
  }

  const pending = inFlightRequests.get(key);
  if (pending) return pending as Promise<T>;

  const promise = request<T>(key)
    .then((value) => {
      if (ttlMs > 0) responseCache.set(key, { expires: Date.now() + ttlMs, value });
      return value;
    })
    .finally(() => {
      inFlightRequests.delete(key);
    });

  inFlightRequests.set(key, promise);
  return promise;
}

export function clearApiCache(): void {
  responseCache.clear();
}

/**
 * Wraps static mock data in a Promise with a small artificial delay so
 * consuming hooks exercise the same loading/error states real API calls
 * would produce once `apiClient` is wired up to a live backend.
 */
export function simulateDelay<T>(value: T, ms = DEFAULT_MOCK_DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
