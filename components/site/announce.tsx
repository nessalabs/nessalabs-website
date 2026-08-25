import * as React from "react";
import { cn } from "@/lib/cn";

export interface AnnounceProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
}

/** A pill-shaped announcement link: (label) message → */
export function Announce({ label, className, children, ...props }: AnnounceProps) {
  return (
    <a
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-4",
        "text-sm text-muted-foreground transition-colors hover:border-dim hover:text-foreground",
        className
      )}
      {...props}
    >
      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground">
        {label}
      </span>
      <span className="truncate">{children}</span>
      <span aria-hidden className="text-muted-foreground">
        →
      </span>
    </a>
  );
}
