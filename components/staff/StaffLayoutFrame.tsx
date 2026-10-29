import type { ReactNode } from "react";
import { StaffNav } from "@/components/staff/StaffNav";

export function StaffLayoutFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:gap-10 lg:py-8">
      <aside className="lg:w-52 lg:shrink-0">
        <div className="rounded-2xl border border-border bg-surface p-3 shadow-soft lg:sticky lg:top-24">
          <StaffNav />
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
