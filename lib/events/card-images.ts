import type { PublicEvent } from "@/lib/types/event";
import {
  resolveEventImageUrl,
  resolveEventImageUrls,
} from "@/lib/events/resolve-image-url";

export function getEventDetailHeroUrl(
  event: Pick<PublicEvent, "heroImageUrl" | "cardImageUrls" | "bannerUrl">,
): string | null {
  const dedicated = resolveEventImageUrl(event.heroImageUrl);
  if (dedicated) return dedicated;
  return getEventCardImages(event)[0] ?? null;
}

export function getEventCardImages(
  event: Pick<PublicEvent, "cardImageUrls" | "bannerUrl">,
): string[] {
  const fromList = resolveEventImageUrls(
    (event.cardImageUrls ?? []).map((u) => u.trim()).filter(Boolean),
  );
  if (fromList.length > 0) {
    return fromList;
  }
  const legacy = resolveEventImageUrl(event.bannerUrl);
  return legacy ? [legacy] : [];
}

export function isHostedEventPulseImage(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    const parts = parsed.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "event-banners");
    const name = idx >= 0 ? parts[idx + 1] : parts.at(-1);
    if (!name) return false;
    return /^[a-f0-9-]+\.(jpe?g|png|webp|gif)$/i.test(name);
  } catch {
    return false;
  }
}
