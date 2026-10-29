import type { ReactNode } from "react";
import { EventPulseLogo } from "@/components/brand/EventPulseLogo";
import { LogoutButton } from "@/components/auth/LogoutButton";
import type { SafeUser } from "@/lib/types/user";

type PortalShellProps = {
  user: SafeUser;
  portalLabel: string;
  loginPath: string;
  children: ReactNode;
};

export function PortalShell({
  user,
  portalLabel,
  loginPath,
  children,
}: PortalShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <EventPulseLogo variant="nav" href="/" />
            <span className="hidden text-sm text-ink-subtle sm:inline">
              {portalLabel}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-muted sm:inline">
              {user.name}
            </span>
            <LogoutButton redirectTo={loginPath} variant="secondary" />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
