import { resolveApiBaseUrlForFetch } from "@/lib/api/base-url";
import {
  API_LOCAL_DEV_HINT,
  API_UNREACHABLE_MESSAGE,
} from "@/lib/api/messages";

export { getApiBaseUrl, getServerSideApiBaseUrl } from "@/lib/api/base-url";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function resolveUrl(path: string, baseUrl: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl.replace(/\/$/, "")}${normalized}`;
}

export type ApiClientOptions = Omit<RequestInit, "body"> & {
  baseUrl?: string;
  body?: unknown;
  json?: boolean;
};

export async function apiClient<T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { baseUrl = resolveApiBaseUrlForFetch(), body, json = true, headers, ...init } =
    options;

  let res: Response;
  try {
    res = await fetch(resolveUrl(path, baseUrl), {
      ...init,
      credentials: "include",
      headers: {
        ...(json && body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
        ...headers,
      },
      body:
        body === undefined
          ? undefined
          : json
            ? JSON.stringify(body)
            : (body as BodyInit),
    });
  } catch {
    const onLocalDev =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");
    throw new ApiError(
      0,
      onLocalDev ? API_LOCAL_DEV_HINT : API_UNREACHABLE_MESSAGE,
    );
  }

  const contentType = res.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    let message = res.statusText || "Request failed";
    if (payload && typeof payload === "object" && "message" in payload) {
      const raw = (payload as { message: unknown }).message;
      if (typeof raw === "string") {
        message = raw;
      } else if (Array.isArray(raw)) {
        message = raw.filter((m): m is string => typeof m === "string").join(" · ");
      }
    }
    throw new ApiError(res.status, message, payload);
  }

  return payload as T;
}
