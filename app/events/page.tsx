import { Suspense } from "react";
import { EventsBrowseContent } from "@/components/events/EventsBrowseContent";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { PublicNav } from "@/components/marketing/PublicNav";
import { LoadingState } from "@/components/ui/LoadingState";

type EventsSearchParams = Promise<{
  q?: string;
  category?: string;
  from?: string;
}>;

async function EventsList({
  searchParams,
}: {
  searchParams: EventsSearchParams;
}) {
  const params = await searchParams;
  return (
    <EventsBrowseContent
      q={params.q}
      category={params.category}
      from={params.from}
    />
  );
}

export default function EventsBrowsePage({
  searchParams,
}: {
  searchParams: EventsSearchParams;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PublicNav />
      <Suspense fallback={<LoadingState label="Loading events…" />}>
        <EventsList searchParams={searchParams} />
      </Suspense>
      <MarketingFooter />
    </div>
  );
}
