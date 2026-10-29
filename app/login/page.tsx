import { Suspense } from "react";
import { AttendeeLoginPageContent } from "@/components/auth/AttendeeLoginPageContent";
import { LoadingState } from "@/components/ui/LoadingState";

export const metadata = {
  title: "Sign in · EventPulse",
};

type LoginPageProps = {
  searchParams: Promise<{ registered?: string; returnTo?: string; email?: string }>;
};

export default function AttendeeLoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense fallback={<LoadingState label="Loading sign in…" />}>
      <AttendeeLoginPageContent searchParams={searchParams} />
    </Suspense>
  );
}
