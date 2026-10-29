import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import type { SafeUser } from "@/lib/types/user";

export async function requireSession(
  loginPath: string,
  returnTo?: string,
): Promise<SafeUser> {
  const user = await getSessionUser();
  if (!user) {
    const next = returnTo
      ? `${loginPath}?returnTo=${encodeURIComponent(returnTo)}`
      : loginPath;
    redirect(next);
  }
  return user;
}
