import type { CreateEventBody } from "@/lib/api/admin";

/** Strip empty optional fields so Nest validation stays happy. */
export function serializeEventBody(body: CreateEventBody): CreateEventBody {
  const urls = (body.cardImageUrls ?? []).map((u) => u.trim()).filter(Boolean);
  const out: CreateEventBody = {
    title: body.title.trim(),
    description: body.description.trim(),
    category: body.category.trim(),
    venue: body.venue.trim(),
    address: body.address.trim(),
    startAt: body.startAt,
    endAt: body.endAt,
    timezone: body.timezone.trim(),
    capacity: Math.floor(Number(body.capacity)),
  };

  const touchesImages =
    body.cardImageUrls !== undefined || body.bannerUrl !== undefined;
  if (touchesImages) {
    out.cardImageUrls = urls;
    if (urls.length > 0) {
      out.bannerUrl = urls[0];
    }
  } else if (body.bannerUrl?.trim()) {
    out.bannerUrl = body.bannerUrl.trim();
    out.cardImageUrls = [body.bannerUrl.trim()];
  }

  if (body.perUserTicketLimit != null && body.perUserTicketLimit > 0) {
    out.perUserTicketLimit = Math.floor(Number(body.perUserTicketLimit));
  }
  if (body.cancellationPolicy?.trim()) {
    out.cancellationPolicy = body.cancellationPolicy.trim();
  }
  if (body.refundPolicy?.trim()) {
    out.refundPolicy = body.refundPolicy.trim();
  }
  if (body.instructions?.trim()) {
    out.instructions = body.instructions.trim();
  }
  if (body.heroImageUrl !== undefined) {
    const hero = body.heroImageUrl.trim();
    out.heroImageUrl = hero || undefined;
  }
  if (body.listingBadge !== undefined) {
    out.listingBadge =
      body.listingBadge === "live" || body.listingBadge === "upcoming"
        ? body.listingBadge
        : null;
  }

  return out;
}
