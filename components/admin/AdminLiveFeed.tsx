"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  createRealtimeSocket,
  type CheckInUpdatePayload,
  type InventoryUpdatePayload,
} from "@/lib/realtime/client";
import { Card } from "@/components/ui/Card";

type FeedItem =
  | { id: string; kind: "check-in"; at: number; payload: CheckInUpdatePayload }
  | { id: string; kind: "inventory"; at: number; payload: InventoryUpdatePayload };

export function AdminLiveFeed() {
  const [connected, setConnected] = useState(false);
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    const socket = createRealtimeSocket();

    function push(item: FeedItem) {
      setItems((prev) => [item, ...prev].slice(0, 12));
    }

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join", { room: "admin" });
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on("check-in:update", (payload: CheckInUpdatePayload) => {
      push({
        id: `ci-${Date.now()}-${Math.random()}`,
        kind: "check-in",
        at: Date.now(),
        payload,
      });
    });

    socket.on("inventory:update", (payload: InventoryUpdatePayload) => {
      push({
        id: `inv-${Date.now()}-${Math.random()}`,
        kind: "inventory",
        at: Date.now(),
        payload,
      });
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Card
      title="Live activity"
      subtitle={connected ? "Socket.IO · admin room" : "Connecting…"}
    >
      {items.length === 0 ? (
        <p className="text-sm text-ink-muted">
          Check-ins and inventory updates appear here in real time.
        </p>
      ) : (
        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-xl border border-border bg-surface-muted px-3 py-2 text-sm"
              >
                {item.kind === "check-in" ? (
                  <>
                    <span className="font-semibold capitalize text-success">
                      Check-in · {item.payload.result.replace("_", " ")}
                    </span>
                    <p className="text-xs text-ink-muted">
                      Event {item.payload.eventId.slice(-6)} · total checked in{" "}
                      {item.payload.checkedInTotal}
                    </p>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-primary">
                      Inventory update
                    </span>
                    <p className="text-xs text-ink-muted">
                      {item.payload.ticketsRemaining} tickets left
                      {item.payload.isSoldOut ? " · sold out" : ""}
                    </p>
                  </>
                )}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Card>
  );
}
