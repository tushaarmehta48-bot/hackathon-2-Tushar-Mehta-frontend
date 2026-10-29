import Link from "next/link";
import { Suspense } from "react";
import { AttendeeLoginSection } from "@/components/auth/AttendeeLoginSection";
import { AuthShell } from "@/components/auth/AuthShell";
import { AUTH_IMAGES } from "@/lib/constants/auth-images";
import { LoadingState } from "@/components/ui/LoadingState";

type AttendeeLoginPageContentProps = {
  searchParams: Promise<{ registered?: string; returnTo?: string; email?: string }>;
};

export async function AttendeeLoginPageContent({
  searchParams,
}: AttendeeLoginPageContentProps) {
  const params = await searchParams;
  const justRegistered = params.registered === "1";
  const returnTo = params.returnTo ?? null;

  return (
    <AuthShell
      title={justRegistered ? "Sign in to continue" : "Welcome back"}
      subtitle={
        justRegistered
          ? "Your attendee account is ready. Enter the email and password you just created."
          : "Browse events, book tickets, and manage bookings in one place."
      }
      imageUrl={AUTH_IMAGES.attendee}
      imageAlt="Festival crowd enjoying live music outdoors"
      footer={
        <>
          Organizer?{" "}
          <Link href="/admin" className="font-medium text-primary">
            Admin portal
          </Link>
          {" · "}
          Gatekeeper?{" "}
          <Link href="/gatekeeper" className="font-medium text-primary">
            Staff portal
          </Link>
        </>
      }
    >
      <Suspense fallback={<LoadingState label="Loading sign in…" />}>
        <AttendeeLoginSection returnTo={returnTo} />
      </Suspense>
    </AuthShell>
  );
}
