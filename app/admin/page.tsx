import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { AdminLoginForm } from "@/components/auth/LoginForm";
import { AdminLoginRedirect } from "@/components/auth/LoginRedirects";
import { AUTH_IMAGES } from "@/lib/constants/auth-images";

export const metadata = {
  title: "Admin sign in · EventPulse",
};

export default function AdminLoginPage() {
  return (
    <AuthShell
      title="Admin portal"
      subtitle="Manage events, inventory, gatekeepers, and live reports."
      imageUrl={AUTH_IMAGES.admin}
      imageAlt="Conference hall with audience and stage lighting"
      footer={
        <>
          Attendee?{" "}
          <Link href="/login" className="font-medium text-primary">
            Sign in here
          </Link>
          {" · "}
          Gatekeeper?{" "}
          <Link href="/gatekeeper" className="font-medium text-primary">
            Staff portal
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <AdminLoginRedirect />
      </Suspense>
      <AdminLoginForm />
    </AuthShell>
  );
}
