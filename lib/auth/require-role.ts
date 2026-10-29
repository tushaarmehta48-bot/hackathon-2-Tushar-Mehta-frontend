import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import type { SafeUser, UserRole } from "@/lib/types/user";

export async function requireRole(
  role: UserRole,
  loginPath: string,
): Promise<SafeUser> {
  const user = await getSessionUser();
  if (!user || user.role !== role) {
    redirect(loginPath);
  }
  return user;
}
