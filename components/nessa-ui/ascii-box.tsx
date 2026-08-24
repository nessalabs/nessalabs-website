import * as React from "react";
import { cn } from "@/lib/cn";

export interface AsciiBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rendered into the top rule, e.g. ┌─ title ────┐ */
  title?: string;
  /** Rendered into the bottom rule, right aligned. */
  footer?: string;
  dense?: boolean;
}

/**
 * A container drawn with real box-drawing characters. The corners and rules
 * are text, not borders, so the frame stays on the monospace grid.
 */
export function AsciiBox({
  title,
  footer,
  dense = false,
  className,
  children,
  ...props
}: AsciiBoxProps) {
  return (
    <div className={cn("font-mono text-xs text-dim", className)} {...props}>
      <div className="flex items-center gap-1 select-none whitespace-nowrap">
        <span aria-hidden>┌─</span>
        {title ? (
          <span className="text-muted uppercase tracking-[0.18em]">
            {title}
          </span>
        ) : null}
        <span aria-hidden className="flex-1 overflow-hidden text-clip">
          {"─".repeat(400)}
        </span>
        <span aria-hidden>┐</span>
      </div>

      <div className="flex">
        <span aria-hidden className="select-none pr-3">
          │
        </span>
        <div
          className={cn(
            "min-w-0 flex-1 text-fg",
            dense ? "py-2" : "py-5"
          )}
        >
          {children}
        </div>
        <span aria-hidden className="select-none pl-3">
          │
        </span>
      </div>

      <div className="flex items-center gap-1 select-none whitespace-nowrap">
        <span aria-hidden>└</span>
        <span aria-hidden className="flex-1 overflow-hidden text-clip">
          {"─".repeat(400)}
        </span>
        {footer ? (
          <span className="text-dim uppercase tracking-[0.18em]">{footer}</span>
        ) : null}
        <span aria-hidden>─┘</span>
      </div>
    </div>
  );
}
