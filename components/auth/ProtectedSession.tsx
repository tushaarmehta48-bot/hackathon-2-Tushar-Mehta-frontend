import type { ReactNode } from "react";
import { requireSession } from "@/lib/auth/require-session";

type ProtectedSessionProps = {
  loginPath?: string;
  returnTo?: string;
  children: ReactNode;
};

export async function ProtectedSession({
  loginPath = "/login",
  returnTo,
  children,
}: ProtectedSessionProps) {
  await requireSession(loginPath, returnTo);
  return children;
}
