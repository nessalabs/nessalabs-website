"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Render leading/trailing square brackets, terminal style. */
  brackets?: boolean;
}

const variants: Record<Variant, string> = {
  solid:
    "bg-fg text-ink border border-fg hover:bg-transparent hover:text-fg",
  outline:
    "bg-transparent text-fg border border-line hover:border-fg hover:bg-raised",
  ghost:
    "bg-transparent text-muted border border-transparent hover:text-fg hover:bg-raised",
  accent:
    "bg-transparent text-accent border border-accent-dim hover:border-accent hover:bg-accent/10",
};

const sizes: Record<Size, string> = {
  sm: "h-7 px-2.5 text-[11px]",
  md: "h-9 px-3.5 text-xs",
  lg: "h-11 px-5 text-sm",
};

export function Button({
  className,
  variant = "outline",
  size = "md",
  brackets = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.12em]",
        "transition-colors duration-150 outline-none",
        "focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
        "disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {brackets && <span aria-hidden>[</span>}
      {children}
      {brackets && <span aria-hidden>]</span>}
    </button>
  );
}
