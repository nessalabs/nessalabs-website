import * as React from "react";
import { cn } from "@/lib/cn";

export interface TickerProps extends React.HTMLAttributes<HTMLDivElement> {
  items: string[];
  separator?: string;
}

/** An infinite horizontal marquee. Content is duplicated for a seamless loop. */
export function Ticker({
  items,
  separator = "◆",
  className,
  ...props
}: TickerProps) {
  const run = [...items, ...items];
  return (
    <div
      className={cn(
        "group relative overflow-hidden border-y border-line bg-surface py-2",
        className
      )}
      {...props}
    >
      <div className="animate-marquee flex w-max group-hover:[animation-play-state:paused]">
        {run.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-6 font-mono text-[10px] uppercase tracking-[0.22em] text-dim whitespace-nowrap"
          >
            {item}
            <span aria-hidden className="text-accent-dim">
              {separator}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
