import { apiClient } from "@/lib/api-client";
import type { SafeUser } from "@/lib/types/user";

export async function fetchOptionalSessionUser() {
  return apiClient<{ user: SafeUser | null }>("/auth/session", {
    cache: "no-store",
  });
}
