import { io, type Socket } from "socket.io-client";
import { getApiBaseUrl, getDefaultDevApiBaseUrl } from "@/lib/api/base-url";

export function getRealtimeOrigin(): string {
  const direct = process.env.NEXT_PUBLIC_REALTIME_ORIGIN?.trim();
  if (direct) {
    return direct.replace(/\/$/, "");
  }
  const api = getApiBaseUrl();
  if (api.startsWith("http://") || api.startsWith("https://")) {
    return api.replace(/\/api\/v1\/?$/, "");
  }
  return getDefaultDevApiBaseUrl().replace(/\/api\/v1\/?$/, "");
}

export function createRealtimeSocket(): Socket {
  return io(`${getRealtimeOrigin()}/realtime`, {
    withCredentials: true,
    transports: ["websocket", "polling"],
    autoConnect: false,
  });
}

export type CheckInUpdatePayload = {
  eventId: string;
  checkedInTotal: number;
  result: string;
};

export type InventoryUpdatePayload = {
  eventId: string;
  ticketsRemaining: number;
  isSoldOut: boolean;
};
