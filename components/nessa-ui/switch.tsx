"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  className?: string;
}

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  label,
  className,
}: SwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isControlled = checked !== undefined;
  const on = isControlled ? checked : internal;

  function toggle() {
    const next = !on;
    if (!isControlled) setInternal(next);
    onCheckedChange?.(next);
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition-colors",
          "focus-visible:ring-2 focus-visible:ring-fg/30 focus-visible:outline-none",
          on ? "border-fg bg-fg" : "border-line bg-raised",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-3.5 w-3.5 rounded-full transition-transform",
            on ? "translate-x-[1.15rem] bg-ink" : "translate-x-0.5 bg-dim"
          )}
        />
      </button>
      {label ? <span className="text-sm text-fg">{label}</span> : null}
    </div>
  );
}
