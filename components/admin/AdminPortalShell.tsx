import type { ReactNode } from "react";
import { EventPulseLogo } from "@/components/brand/EventPulseLogo";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";
import type { SafeUser } from "@/lib/types/user";

type AdminPortalShellProps = {
  user: SafeUser;
  children: ReactNode;
};

export function AdminPortalShell({ user, children }: AdminPortalShellProps) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0f1419]">
      <div
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_120%_80%_at_0%_0%,rgba(62,116,92,0.12),transparent_50%),radial-gradient(ellipse_80%_60%_at_100%_20%,rgba(212,188,106,0.08),transparent_45%)]"
        aria-hidden
      />

      <header className="relative z-50 shrink-0 border-b border-white/10 bg-ink/95 backdrop-blur-md">
        <div className="flex h-14 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:pl-[4.75rem]">
          <div className="flex items-center gap-3">
            <EventPulseLogo variant="nav" href="/" onDark />
            <span className="hidden rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 sm:inline">
              Admin console
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[12rem] truncate text-sm text-white/70 sm:inline">
              {user.name}
            </span>
            <LogoutButton redirectTo="/admin" variant="secondary" />
          </div>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <AdminSidebarNav user={user} />
        <main className="min-h-[calc(100vh-3.5rem)] w-full flex-1 overflow-y-auto pb-20 lg:pb-8 lg:pl-[4.75rem]">
          <div className="min-h-full w-full bg-gradient-to-br from-bg-milk via-bg-milk to-surface-muted/50 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
            <div className="mx-auto w-full max-w-[1600px]">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
