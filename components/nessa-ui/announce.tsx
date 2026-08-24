import * as React from "react";
import { cn } from "@/lib/cn";

export interface AnnounceProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
}

/** A pill-shaped announcement link: [ LABEL ] message → */
export function Announce({
  label,
  className,
  children,
  ...props
}: AnnounceProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-3 rounded-full border border-line bg-raised py-1 pl-1 pr-4",
        "font-mono text-xs text-muted transition-colors hover:border-dim hover:text-fg",
        className
      )}
      {...props}
    >
      <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-accent">
        {label}
      </span>
      <span className="truncate">{children}</span>
      <span aria-hidden className="text-dim">
        →
      </span>
    </a>
  );
}
