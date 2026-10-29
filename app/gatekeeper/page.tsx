import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { StaffLoginForm } from "@/components/auth/LoginForm";
import { GatekeeperLoginRedirect } from "@/components/auth/LoginRedirects";
import { AUTH_IMAGES } from "@/lib/constants/auth-images";

export const metadata = {
  title: "Gatekeeper sign in · EventPulse",
};

export default function GatekeeperLoginPage() {
  return (
    <AuthShell
      title="Gatekeeper portal"
      subtitle="Scan QR tickets at your assigned gates. Accounts are created by an admin."
      imageUrl={AUTH_IMAGES.gatekeeper}
      imageAlt="Crowd at a live concert under colorful lights"
      footer={
        <>
          Attendee?{" "}
          <Link href="/login" className="font-medium text-primary">
            Sign in here
          </Link>
          {" · "}
          Organizer?{" "}
          <Link href="/admin" className="font-medium text-primary">
            Admin portal
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <GatekeeperLoginRedirect />
      </Suspense>
      <StaffLoginForm />
    </AuthShell>
  );
}
