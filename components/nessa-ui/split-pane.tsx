"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface SplitPaneProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: [React.ReactNode, React.ReactNode];
  direction?: "horizontal" | "vertical";
  /** Size of the first pane in pixels. */
  defaultSize?: number;
  min?: number;
  max?: number;
  onResize?: (size: number) => void;
  /** Double-clicking the handle returns to this size. */
  resetSize?: number;
}

/**
 * Two panes with a draggable divider. Keyboard accessible: focus the handle and
 * use the arrow keys; double-click to reset.
 */
export function SplitPane({
  children,
  direction = "horizontal",
  defaultSize = 260,
  min = 140,
  max = 640,
  onResize,
  resetSize,
  className,
  ...props
}: SplitPaneProps) {
  const [size, setSize] = React.useState(defaultSize);
  const ref = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);
  const horizontal = direction === "horizontal";

  const apply = React.useCallback(
    (next: number) => {
      const clamped = Math.min(max, Math.max(min, next));
      setSize(clamped);
      onResize?.(clamped);
    },
    [min, max, onResize]
  );

  React.useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!dragging.current || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      apply(horizontal ? e.clientX - rect.left : e.clientY - rect.top);
    }
    function onUp() {
      dragging.current = false;
      document.body.style.userSelect = "";
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [apply, horizontal]);

  return (
    <div
      ref={ref}
      className={cn("flex min-h-0 min-w-0", horizontal ? "flex-row" : "flex-col", className)}
      {...props}
    >
      <div
        className="min-h-0 min-w-0 overflow-auto"
        style={horizontal ? { width: size, flex: "0 0 auto" } : { height: size, flex: "0 0 auto" }}
      >
        {children[0]}
      </div>

      <div
        role="separator"
        aria-orientation={horizontal ? "vertical" : "horizontal"}
        aria-valuenow={size}
        tabIndex={0}
        onPointerDown={() => {
          dragging.current = true;
          document.body.style.userSelect = "none";
        }}
        onDoubleClick={() => apply(resetSize ?? defaultSize)}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 40 : 10;
          if (e.key === (horizontal ? "ArrowLeft" : "ArrowUp")) {
            e.preventDefault();
            apply(size - step);
          } else if (e.key === (horizontal ? "ArrowRight" : "ArrowDown")) {
            e.preventDefault();
            apply(size + step);
          }
        }}
        className={cn(
          "group relative shrink-0 bg-line transition-colors hover:bg-dim focus-visible:bg-fg focus-visible:outline-none",
          horizontal ? "w-px cursor-col-resize" : "h-px cursor-row-resize"
        )}
      >
        {/* widened hit area without widening the visual line */}
        <span
          aria-hidden
          className={cn(
            "absolute",
            horizontal ? "-inset-x-1.5 inset-y-0" : "-inset-y-1.5 inset-x-0"
          )}
        />
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto">{children[1]}</div>
    </div>
  );
}
