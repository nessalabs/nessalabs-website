"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface TerminalProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  lines: string[];
  /** Type the lines out character by character on mount. */
  typing?: boolean;
  speed?: number;
}

export function Terminal({
  title = "nessa@labs",
  lines,
  typing = false,
  speed = 18,
  className,
  ...props
}: TerminalProps) {
  const full = React.useMemo(() => lines.join("\n"), [lines]);
  const [shown, setShown] = React.useState(typing ? "" : full);

  React.useEffect(() => {
    if (!typing) {
      setShown(full);
      return;
    }
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setShown(full);
      return;
    }
    let i = 0;
    setShown("");
    const id = window.setInterval(() => {
      i += 1;
      setShown(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [full, typing, speed]);

  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-surface text-xs",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-dim">
        <span>{title}</span>
        <span aria-hidden>─ □ ×</span>
      </div>
      <pre className="overflow-x-auto whitespace-pre p-4 leading-6 text-muted">
        {shown}
        <span className="animate-blink text-accent">█</span>
      </pre>
    </div>
  );
}
