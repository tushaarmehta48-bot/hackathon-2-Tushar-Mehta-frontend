import { io, type Socket } from "socket.io-client";

export function getRealtimeOrigin(): string {
  const api =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";
  return api.replace(/\/api\/v1\/?$/, "");
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
