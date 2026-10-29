"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api-client";
import { login, register } from "@/lib/auth/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type Mode = "login" | "register";

export function AttendeeAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const registered = searchParams.get("registered") === "1";
  const emailFromQuery = searchParams.get("email") ?? "";

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(emailFromQuery);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const trimmedEmail = email.trim();
      if (mode === "register") {
        await register({
          name: name.trim(),
          email: trimmedEmail,
          password,
        });
        const params = new URLSearchParams({
          registered: "1",
          email: trimmedEmail,
        });
        if (returnTo?.startsWith("/")) {
          params.set("returnTo", returnTo);
        }
        router.push(`/login?${params.toString()}`);
        router.refresh();
        return;
      }

      await login({ email: trimmedEmail, password });
      const target = returnTo?.startsWith("/") ? returnTo : "/";
      router.push(target);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      {registered && mode === "login" ? (
        <p className="mb-4 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2.5 text-sm text-ink">
          <strong className="font-semibold">Account created.</strong> Sign in
          with your email and password to continue.
        </p>
      ) : null}

      <div className="mb-4 flex rounded-xl bg-surface-muted p-1">
        <button
          type="button"
          className={[
            "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors",
            mode === "login" ? "bg-surface text-ink shadow-sm" : "text-ink-muted",
          ].join(" ")}
          onClick={() => setMode("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          className={[
            "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors",
            mode === "register"
              ? "bg-surface text-ink shadow-sm"
              : "text-ink-muted",
          ].join(" ")}
          onClick={() => setMode("register")}
        >
          Create account
        </button>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        {mode === "register" ? (
          <Input
            name="name"
            label="Full name"
            autoComplete="name"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : null}
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
          autoComplete={
            mode === "register" ? "new-password" : "current-password"
          }
          required
          minLength={8}
          hint="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {mode === "register" ? (
          <p className="text-xs leading-relaxed text-ink-muted">
            After creating your account, you&apos;ll sign in on the next step
            with the same email and password.
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" className="w-full" loading={loading}>
          {mode === "register" ? "Create account" : "Sign in"}
        </Button>
      </form>
    </Card>
  );
}
