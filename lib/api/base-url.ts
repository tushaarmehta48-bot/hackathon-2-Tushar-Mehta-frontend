const DEFAULT_DEV_API = "http://localhost:3001/api/v1";

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, "");
}

export function getConfiguredPublicApiBase(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) {
    return undefined;
  }
  return stripTrailingSlash(raw);
}

/** Browser and isomorphic default — prefer same-origin `/api/v1` when proxied. */
export function getApiBaseUrl(): string {
  return getConfiguredPublicApiBase() ?? "/api/v1";
}

function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return stripTrailingSlash(explicit);
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/** Absolute base for server-side `fetch` (forwards session cookies via rewrite). */
export function getServerSideApiBaseUrl(): string {
  const configured = getConfiguredPublicApiBase();
  if (
    configured &&
    (configured.startsWith("http://") || configured.startsWith("https://"))
  ) {
    return configured;
  }
  const path = configured ?? "/api/v1";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${normalizedPath}`;
}

/** Absolute base for the current runtime (client or server). */
export function resolveApiBaseUrlForFetch(): string {
  const base = getApiBaseUrl();
  if (base.startsWith("http://") || base.startsWith("https://")) {
    return base;
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}${base.startsWith("/") ? base : `/${base}`}`;
  }
  return getServerSideApiBaseUrl();
}

export function getDefaultDevApiBaseUrl(): string {
  return DEFAULT_DEV_API;
}
