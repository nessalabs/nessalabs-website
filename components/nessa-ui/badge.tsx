import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "solid" | "warn" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  neutral: "bg-raised text-muted border-line",
  solid: "bg-fg text-ink border-fg",
  warn: "bg-amber-400/10 text-amber-300 border-amber-400/25",
  outline: "bg-transparent text-dim border-line",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
