"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/auth/api";
import { Button } from "@/components/ui/Button";

type LogoutButtonProps = {
  redirectTo?: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function LogoutButton({
  redirectTo = "/",
  variant = "ghost",
  className = "",
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await logout();
    } catch {
      /* session may already be gone */
    } finally {
      router.push(redirectTo);
      router.refresh();
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      loading={loading}
      onClick={onLogout}
    >
      Sign out
    </Button>
  );
}
