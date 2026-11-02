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
    <div className="flex min-h-full w-full max-w-full flex-1 flex-col overflow-x-clip">
      <PublicNav variant="overlay" />
      <Suspense
        fallback={
          <div className="pt-28">
            <LoadingState label="Loading events…" />
          </div>
        }
      >
        <EventsList searchParams={searchParams} />
      </Suspense>
      <MarketingFooter />
    </div>
  );
}
