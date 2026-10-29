/** Public Render API host (direct — used for docs, Socket.IO, and footer link). */
export const BACKEND_PUBLIC_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.trim()?.replace(/\/$/, "") ??
  "https://hackathon-2-tushar-mehta-backend.onrender.com";

/** Browser API calls use the Vercel same-origin proxy (`/api/v1`). */
export const APP_API_BASE = "/api/v1";

export function backendHealthUrl(): string {
  return `${BACKEND_PUBLIC_URL}/api/v1/health`;
}

export function backendApiDocsUrl(): string {
  return `${BACKEND_PUBLIC_URL}/api/docs`;
}
