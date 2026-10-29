"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api-client";
import { login } from "@/lib/auth/api";
import { UserRole, type UserRole as UserRoleType } from "@/lib/types/user";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type LoginFormProps = {
  intendedRole?: UserRoleType;
  redirectTo: string;
  submitLabel?: string;
};

export function LoginForm({
  intendedRole,
  redirectTo,
  submitLabel = "Sign in",
}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({
        email: email.trim(),
        password,
        ...(intendedRole ? { intendedRole } : {}),
      });
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not sign in. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" loading={loading}>
          {submitLabel}
        </Button>
      </form>
    </Card>
  );
}

export const AdminLoginForm = () => (
  <LoginForm
    intendedRole={UserRole.Admin}
    redirectTo="/admin/overview"
    submitLabel="Sign in to admin"
  />
);

export const StaffLoginForm = () => (
  <LoginForm
    intendedRole={UserRole.Gatekeeper}
    redirectTo="/gatekeeper/overview"
    submitLabel="Sign in to gatekeeper"
  />
);
