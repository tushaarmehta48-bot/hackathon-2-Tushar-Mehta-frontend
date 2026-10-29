import { Suspense } from "react";
import { EventPulseLogo } from "@/components/brand/EventPulseLogo";
import {
  PublicNavClient,
  type PublicNavClientProps,
} from "@/components/marketing/PublicNavClient";

function PublicNavFallback({ variant = "default" }: PublicNavClientProps) {
  const overlay = variant === "overlay";
  return (
    <header
      className={[
        "z-50 w-full px-4 sm:px-6",
        overlay ? "absolute inset-x-0 top-0 pt-4" : "sticky top-0 pt-3 pb-1",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto flex max-w-6xl items-center rounded-[2rem] border px-4 py-2.5 shadow-soft backdrop-blur-xl sm:px-5 sm:py-3",
          overlay
            ? "border-white/25 bg-ink/35"
            : "border-border/80 bg-surface/95",
        ].join(" ")}
      >
        <EventPulseLogo variant="nav" href="/" onDark={overlay} />
      </div>
    </header>
  );
}

export function PublicNav(props: PublicNavClientProps) {
  return (
    <Suspense fallback={<PublicNavFallback {...props} />}>
      <PublicNavClient {...props} />
    </Suspense>
  );
}
