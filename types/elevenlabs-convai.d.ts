import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          "agent-id"?: string;
          "signed-url"?: string;
          "server-location"?: string;
          variant?: "compact" | "expanded";
          "mobile-fullscreen"?: string;
          "show-resize-button"?: string;
          dismissible?: string;
          "action-text"?: string;
          "start-call-text"?: string;
          "end-call-text"?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
