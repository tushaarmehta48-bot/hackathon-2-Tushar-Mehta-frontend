import { apiClient } from "@/lib/api-client";
import type { SafeUser, UserRole } from "@/lib/types/user";

export type LoginBody = {
  email: string;
  password: string;
  intendedRole?: UserRole;
};

export type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

export async function login(body: LoginBody) {
  return apiClient<{ user: SafeUser }>("/auth/login", {
    method: "POST",
    body,
  });
}

export async function register(body: RegisterBody) {
  return apiClient<{ user: SafeUser }>("/auth/register", {
    method: "POST",
    body,
  });
}

export async function logout() {
  return apiClient<{ success: boolean }>("/auth/logout", {
    method: "POST",
  });
}
