import { cookies } from "next/headers";
import { cache } from "react";
import { getApiBaseUrl } from "@/lib/api-client";
import type { SafeUser } from "@/lib/types/user";

async function cookieHeader(): Promise<string | undefined> {
  const store = await cookies();
  const all = store.getAll();
  if (all.length === 0) {
    return undefined;
  }
  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}

export const getSessionUser = cache(async (): Promise<SafeUser | null> => {
  const header = await cookieHeader();
  if (!header) {
    return null;
  }

  try {
    const res = await fetch(`${getApiBaseUrl()}/users/me`, {
      headers: { Cookie: header },
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as { user?: SafeUser };
    return data.user ?? null;
  } catch {
    return null;
  }
});
