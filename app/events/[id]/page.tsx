import type { Metadata } from "next";
import { Suspense } from "react";
import { PortalLoading } from "@/components/auth/PortalLoading";
import { EventDetailContent } from "@/components/events/EventDetailContent";
import { PublicNav } from "@/components/marketing/PublicNav";
import { getEvent } from "@/lib/api/events";

type EventDetailPageProps = PageProps<"/events/[id]">;

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const { event } = await getEvent(id);
    const description =
      event.description.length > 155
        ? `${event.description.slice(0, 152)}…`
        : event.description;

    return {
      title: `${event.title} · EventPulse`,
      description,
      openGraph: {
        title: event.title,
        description,
        type: "website",
        ...(event.bannerUrl ? { images: [{ url: event.bannerUrl }] } : {}),
      },
      twitter: {
        card: event.bannerUrl ? "summary_large_image" : "summary",
        title: event.title,
        description,
        ...(event.bannerUrl ? { images: [event.bannerUrl] } : {}),
      },
    };
  } catch {
    return {
      title: "Event · EventPulse",
      description: "Event details and tickets on EventPulse.",
    };
  }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PublicNav />
      <Suspense fallback={<PortalLoading />}>
        <EventDetailContent params={params} />
      </Suspense>
    </div>
  );
}
