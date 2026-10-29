import { NextRequest, NextResponse } from "next/server";

const backendOrigin =
  process.env.API_URL?.replace(/\/$/, "") ??
  "https://hackathon-2-tushar-mehta-backend.onrender.com";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

/** Never forward these — avoids double-decode / ERR_CONTENT_DECODING_FAILED in browsers. */
const STRIP_REQUEST = new Set(["accept-encoding"]);
const STRIP_RESPONSE = new Set([
  "content-encoding",
  "content-length",
  "etag",
  "vary",
]);

function rewriteSetCookie(value: string): string {
  return value
    .replace(/;\s*Domain=[^;]*/gi, "")
    .replace(/;\s*Secure/gi, "; Secure")
    .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
}

async function proxyRequest(req: NextRequest, pathSegments: string[]) {
  const path = pathSegments.join("/");
  const search = req.nextUrl.search;
  const target = `${backendOrigin}/api/v1/${path}${search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP.has(lower) || STRIP_REQUEST.has(lower)) {
      return;
    }
    headers.set(key, value);
  });
  headers.set("Accept-Encoding", "identity");

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch {
    return NextResponse.json(
      {
        statusCode: 503,
        message:
          "EventPulse API is temporarily unreachable. Wait a moment and try again.",
      },
      { status: 503 },
    );
  }

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower === "set-cookie") {
      return;
    }
    if (HOP_BY_HOP.has(lower) || STRIP_RESPONSE.has(lower)) {
      return;
    }
    responseHeaders.set(key, value);
  });

  const setCookies =
    typeof upstream.headers.getSetCookie === "function"
      ? upstream.headers.getSetCookie()
      : upstream.headers.get("set-cookie")
        ? [upstream.headers.get("set-cookie")!]
        : [];

  for (const cookie of setCookies) {
    responseHeaders.append("set-cookie", rewriteSetCookie(cookie));
  }

  responseHeaders.set(
    "Cache-Control",
    "private, no-store, no-transform, must-revalidate",
  );

  if (req.method === "HEAD") {
    return new NextResponse(null, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  let body: BodyInit | null = null;

  if (upstream.status === 204 || upstream.status === 205) {
    body = null;
  } else if (
    contentType.includes("application/json") ||
    contentType.startsWith("text/")
  ) {
    // Decode upstream compression (if any) so the browser never sees a mismatched body.
    body = await upstream.text();
  } else {
    body = await upstream.arrayBuffer();
  }

  return new NextResponse(body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}

export async function OPTIONS(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  return proxyRequest(req, path);
}
