import type { Metadata } from "next";
import { DM_Serif_Display, Manrope } from "next/font/google";
import { Suspense } from "react";
import { ElevenLabsConvaiWidget } from "@/components/elevenlabs/ElevenLabsConvaiWidget";
import "@/lib/fontawesome";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EventPulse — Discover events, book tickets, check in",
  description:
    "Event discovery, secure QR ticketing, organizer tools, and ElevenLabs voice assistant.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${dmSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full w-full max-w-[100vw] flex-col overflow-x-hidden bg-bg-milk font-sans text-ink">
        {children}
        <Suspense fallback={null}>
          <ElevenLabsConvaiWidget />
        </Suspense>
      </body>
    </html>
  );
}
