"use client";

import { createElement } from "react";
import Script from "next/script";

const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID?.trim();
const serverLocation =
  process.env.NEXT_PUBLIC_ELEVENLABS_SERVER_LOCATION?.trim() || "global";

/**
 * Floating ElevenLabs Conversational AI widget (voice + chat).
 * Set NEXT_PUBLIC_ELEVENLABS_AGENT_ID in frontend/.env.local — public agent, auth off in ElevenLabs dashboard.
 */
export function ElevenLabsConvaiWidget() {
  if (!agentId) {
    return null;
  }

  return (
    <>
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="lazyOnload"
      />
      {createElement("elevenlabs-convai", {
        "agent-id": agentId,
        "server-location": serverLocation,
        variant: "compact",
        "action-text": "Talk to Pulse",
        "start-call-text": "Start call",
        "end-call-text": "End call",
        dismissible: "true",
        "mobile-fullscreen": "false",
        "show-resize-button": "false",
      })}
    </>
  );
}
