import { cookies } from "next/headers";
import { cache } from "react";
import { getServerSideApiBaseUrl } from "@/lib/api/base-url";
import { fetchWithTimeout } from "@/lib/api/fetch-with-timeout";
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
    const res = await fetchWithTimeout(
      `${getServerSideApiBaseUrl()}/auth/session`,
      {
        headers: { Cookie: header },
        cache: "no-store",
      },
    );
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as { user?: SafeUser | null };
    return data.user ?? null;
  } catch {
    return null;
  }
});
