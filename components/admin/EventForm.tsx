"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api-client";
import {
  adminCreateEvent,
  adminCreatePackage,
  adminUpdateEvent,
  type CreateEventBody,
} from "@/lib/api/admin";
import {
  fromDatetimeLocalValue,
  toDatetimeLocalValue,
} from "@/lib/format/form-datetime";
import { EventCategoryPicker } from "@/components/admin/EventCategoryPicker";
import type { AdminEvent } from "@/lib/types/admin";
import { EventCardImageField } from "@/components/admin/EventCardImageField";
import { EventDetailHeroField } from "@/components/admin/EventDetailHeroField";
import {
  EventListingBadgePicker,
  formValueToListingBadge,
  listingBadgeToFormValue,
} from "@/components/admin/EventListingBadgePicker";
import { PackageDraftEditor } from "@/components/admin/PackageDraftEditor";
import {
  draftToCreateBody,
  type PackageDraftUi,
} from "@/components/admin/package-draft-utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type EventFormProps = {
  mode: "create" | "edit";
  event?: AdminEvent;
};

function defaultBody(event?: AdminEvent): CreateEventBody {
  if (event) {
    return {
      title: event.title,
      description: event.description,
      category: event.category,
      cardImageUrls:
        event.cardImageUrls && event.cardImageUrls.length > 0
          ? event.cardImageUrls
          : event.bannerUrl
            ? [event.bannerUrl]
            : [],
      heroImageUrl: event.heroImageUrl ?? undefined,
      listingBadge: event.listingBadge ?? null,
      venue: event.venue,
      address: event.address,
      startAt: event.startAt,
      endAt: event.endAt,
      timezone: event.timezone,
      capacity: event.capacity,
      perUserTicketLimit: event.perUserTicketLimit,
      cancellationPolicy: event.cancellationPolicy ?? undefined,
      refundPolicy: event.refundPolicy ?? undefined,
      instructions: event.instructions ?? undefined,
    };
  }
  const start = new Date();
  start.setDate(start.getDate() + 14);
  const end = new Date(start);
  end.setHours(end.getHours() + 3);
  return {
    title: "",
    description: "",
    category: "concert",
    venue: "",
    address: "",
    startAt: start.toISOString(),
    endAt: end.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    capacity: 100,
    perUserTicketLimit: 10,
    cardImageUrls: [],
    listingBadge: null,
  };
}

export function EventForm({ mode, event }: EventFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<CreateEventBody>(() => defaultBody(event));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [packageDrafts, setPackageDrafts] = useState<PackageDraftUi[]>([]);
  const [listingBadgeUi, setListingBadgeUi] = useState(() =>
    listingBadgeToFormValue(event?.listingBadge),
  );

  function patch<K extends keyof CreateEventBody>(key: K, value: CreateEventBody[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "create") {
        const { event: created } = await adminCreateEvent({
          ...form,
          listingBadge: formValueToListingBadge(listingBadgeUi),
        });
        const namedDrafts = packageDrafts.filter((d) => d.name.trim());
        const packageBodies = namedDrafts
          .map(draftToCreateBody)
          .filter((b): b is NonNullable<typeof b> => b !== null);
        if (
          namedDrafts.length > 0 &&
          packageBodies.length !== namedDrafts.length
        ) {
          setError(
            "Fix ticket packages — each needs a name, price in ₹, and quantity.",
          );
          setLoading(false);
          return;
        }
        for (const body of packageBodies) {
          await adminCreatePackage(created.id, body);
        }
        router.push(`/admin/events/${created.id}`);
      } else if (event) {
        await adminUpdateEvent(event.id, {
          ...form,
          listingBadge: formValueToListingBadge(listingBadgeUi),
        });
        router.refresh();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        const body = err.body;
        const detail =
          body &&
          typeof body === "object" &&
          "message" in body &&
          Array.isArray((body as { message: unknown }).message)
            ? (body as { message: string[] }).message.join(" · ")
            : err.message;
        setError(detail);
      } else {
        setError("Save failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card title={mode === "create" ? "New event" : "Edit event"}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Title"
          name="title"
          required
          value={form.title}
          onChange={(e) => patch("title", e.target.value)}
        />
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-muted">Description</span>
          <textarea
            className="min-h-28 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm"
            required
            value={form.description}
            onChange={(e) => patch("description", e.target.value)}
          />
        </label>
        <EventCategoryPicker
          value={form.category}
          onChange={(category) => patch("category", category)}
        />
        <EventListingBadgePicker
          value={listingBadgeUi}
          onChange={setListingBadgeUi}
        />
        <EventCardImageField
          imageUrls={form.cardImageUrls ?? []}
          onChange={(urls) => {
            patch("cardImageUrls", urls);
            patch("bannerUrl", urls[0]);
          }}
        />
        <EventDetailHeroField
          heroImageUrl={form.heroImageUrl}
          onChange={(url) => patch("heroImageUrl", url)}
        />
        {mode === "create" ? (
          <div className="space-y-3 rounded-2xl border border-border bg-surface-muted/40 p-4">
            <div>
              <p className="text-sm font-semibold text-ink">Ticket packages</p>
              <p className="text-xs text-ink-muted">
                Add one or more packages now — prices in rupees (₹). You can add
                more after saving from the event page.
              </p>
            </div>
            <PackageDraftEditor
              drafts={packageDrafts}
              onChange={setPackageDrafts}
              minRows={0}
              showDescription
            />
          </div>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Venue"
            name="venue"
            required
            value={form.venue}
            onChange={(e) => patch("venue", e.target.value)}
          />
          <Input
            label="Address"
            name="address"
            required
            value={form.address}
            onChange={(e) => patch("address", e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Starts"
            name="startAt"
            type="datetime-local"
            required
            value={toDatetimeLocalValue(form.startAt)}
            onChange={(e) => patch("startAt", fromDatetimeLocalValue(e.target.value))}
          />
          <Input
            label="Ends"
            name="endAt"
            type="datetime-local"
            required
            value={toDatetimeLocalValue(form.endAt)}
            onChange={(e) => patch("endAt", fromDatetimeLocalValue(e.target.value))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Timezone"
            name="timezone"
            required
            value={form.timezone}
            onChange={(e) => patch("timezone", e.target.value)}
          />
          <Input
            label="Capacity"
            name="capacity"
            type="number"
            min={1}
            required
            value={form.capacity}
            onChange={(e) => patch("capacity", Number(e.target.value))}
          />
          <Input
            label="Per-user ticket limit"
            name="perUserTicketLimit"
            type="number"
            min={1}
            value={form.perUserTicketLimit ?? ""}
            onChange={(e) =>
              patch("perUserTicketLimit", Number(e.target.value) || undefined)
            }
          />
        </div>
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" loading={loading}>
          {mode === "create" ? "Create draft" : "Save changes"}
        </Button>
      </form>
    </Card>
  );
}
