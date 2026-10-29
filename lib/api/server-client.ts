import { cookies } from "next/headers";
import { ApiError, getApiBaseUrl } from "@/lib/api-client";
import { API_UNREACHABLE_MESSAGE } from "@/lib/api/messages";

async function sessionCookieHeader(): Promise<string | undefined> {
  const store = await cookies();
  const all = store.getAll();
  if (all.length === 0) {
    return undefined;
  }
  return all.map((c) => `${c.name}=${c.value}`).join("; ");
}

export async function serverApiClient<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const cookie = await sessionCookieHeader();

  let res: Response;
  try {
    res = await fetch(`${getApiBaseUrl()}${normalized}`, {
      ...init,
      cache: "no-store",
      headers: {
        ...(init.headers ?? {}),
        ...(cookie ? { Cookie: cookie } : {}),
        ...(init.body ? { "Content-Type": "application/json" } : {}),
      },
    });
  } catch {
    throw new ApiError(0, API_UNREACHABLE_MESSAGE);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof (payload as { message: unknown }).message === "string"
        ? (payload as { message: string }).message
        : res.statusText || "Request failed";
    throw new ApiError(res.status, message, payload);
  }

  return payload as T;
}
