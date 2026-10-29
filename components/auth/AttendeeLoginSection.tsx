"use client";

import { useEffect, useState } from "react";
import { AttendeeAlreadySignedIn } from "@/components/auth/AttendeeAlreadySignedIn";
import { AttendeeAuthForm } from "@/components/auth/AttendeeAuthForm";
import { LoadingState } from "@/components/ui/LoadingState";
import { fetchOptionalSessionUser } from "@/lib/api/session";
import { UserRole, type SafeUser } from "@/lib/types/user";

type AttendeeLoginSectionProps = {
  returnTo?: string | null;
};

export function AttendeeLoginSection({
  returnTo = null,
}: AttendeeLoginSectionProps) {
  const [user, setUser] = useState<SafeUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchOptionalSessionUser()
      .then((res) => {
        if (!cancelled) setUser(res.user);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (user === undefined) {
    return <LoadingState label="Checking session…" />;
  }

  if (user?.role === UserRole.Attendee) {
    return <AttendeeAlreadySignedIn user={user} returnTo={returnTo} />;
  }

  return <AttendeeAuthForm />;
}
