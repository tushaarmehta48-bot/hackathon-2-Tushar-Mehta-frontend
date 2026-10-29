"use client";

import { fetchOptionalSessionUser } from "@/lib/api/session";
import { logout } from "@/lib/auth/api";

export const SESSION_SYNC_EVENT = "eventpulse:session-sync";

/** Clear client UI immediately, then destroy the server session. */
export async function signOutAndSync(): Promise<void> {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_SYNC_EVENT));
  }

  try {
    await logout();
  } catch {
    /* cookie may already be cleared */
  }

  try {
    const { user } = await fetchOptionalSessionUser();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(SESSION_SYNC_EVENT, { detail: { user } }),
      );
    }
  } catch {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent(SESSION_SYNC_EVENT, { detail: { user: null } }),
      );
    }
  }
}
