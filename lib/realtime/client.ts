import { io, type Socket } from "socket.io-client";
import { BACKEND_PUBLIC_URL } from "@/lib/constants/platform-urls";

export function getRealtimeOrigin(): string {
  const direct = process.env.NEXT_PUBLIC_REALTIME_ORIGIN?.trim();
  if (direct) {
    return direct.replace(/\/$/, "");
  }
  return BACKEND_PUBLIC_URL;
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
