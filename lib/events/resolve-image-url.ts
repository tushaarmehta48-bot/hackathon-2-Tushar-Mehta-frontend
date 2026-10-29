/** Use same-origin media paths so Vercel rewrites can reach the API (and fix dev localhost URLs). */
export function resolveEventImageUrl(url: string | undefined | null): string | null {
  const trimmed = url?.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.startsWith("/api/v1/media/")) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    const idx = parsed.pathname.indexOf("/api/v1/media/");
    if (idx >= 0) {
      return parsed.pathname.slice(idx);
    }
  } catch {
    return trimmed;
  }
  return trimmed;
}

export function resolveEventImageUrls(urls: string[]): string[] {
  return urls
    .map((u) => resolveEventImageUrl(u))
    .filter((u): u is string => Boolean(u));
}

/** Next.js Image cannot optimize same-origin API media paths. */
export function eventImageUseUnoptimized(url: string): boolean {
  const trimmed = url.trim();
  return (
    trimmed.startsWith("/api/v1/media/") ||
    trimmed.startsWith("http://localhost") ||
    trimmed.startsWith("http://127.0.0.1")
  );
}
