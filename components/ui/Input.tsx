"use client";

import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
};

export function Input({
  id,
  label,
  hint,
  error,
  leadingIcon,
  className = "",
  type,
  ...rest
}: InputProps) {
  const inputId = id ?? rest.name;
  const isPassword = type === "password";
  const [passwordVisible, setPasswordVisible] = useState(false);
  const resolvedType =
    isPassword && passwordVisible ? "text" : type;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-ink-muted"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leadingIcon ? (
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle"
            aria-hidden
          >
            {leadingIcon}
          </span>
        ) : null}
        <input
          id={inputId}
          type={resolvedType}
          className={[
            "w-full min-h-11 rounded-xl border border-border bg-surface px-3.5 text-ink",
            "placeholder:text-ink-subtle",
            "transition-[border-color,box-shadow] duration-200",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25",
            leadingIcon ? "pl-10" : "",
            isPassword ? "pr-11" : "",
            error ? "border-danger focus:ring-danger/25" : "",
            className,
          ].join(" ")}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-ink-subtle transition hover:bg-surface-muted hover:text-ink"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            aria-pressed={passwordVisible}
            onClick={() => setPasswordVisible((v) => !v)}
          >
            <FontAwesomeIcon
              icon={passwordVisible ? faEyeSlash : faEye}
              className="h-4 w-4"
            />
          </button>
        ) : null}
      </div>
      {hint && !error ? (
        <p id={`${inputId}-hint`} className="text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
