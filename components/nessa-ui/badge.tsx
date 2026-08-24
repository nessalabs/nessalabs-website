import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "accent" | "warn" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  neutral: "bg-raised text-muted border-line",
  accent: "bg-accent/10 text-accent border-accent-dim",
  warn: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  outline: "bg-transparent text-dim border-line",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
