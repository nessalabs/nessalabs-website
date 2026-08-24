"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
}

export function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const generated = React.useId();
  const inputId = id ?? generated;

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative inline-flex">
        <input
          id={inputId}
          type="checkbox"
          className={cn(
            "peer h-4 w-4 appearance-none rounded border border-line bg-surface",
            "transition-colors checked:border-fg checked:bg-fg",
            "focus-visible:ring-2 focus-visible:ring-fg/30 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...props}
        />
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-0.5 top-0.5 h-3 w-3 text-ink opacity-0 peer-checked:opacity-100"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      {label ? (
        <label htmlFor={inputId} className="text-sm text-fg">
          {label}
        </label>
      ) : null}
    </div>
  );
}
