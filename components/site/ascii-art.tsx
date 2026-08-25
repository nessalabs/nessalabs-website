import * as React from "react";
import { cn } from "@/lib/cn";

export interface AsciiArtProps extends React.HTMLAttributes<HTMLPreElement> {
  cols?: number;
  rows?: number;
  seed?: number;
  /** Characters ordered from lightest to densest. */
  ramp?: string;
  /** 0 = sparse, 1 = packed. */
  density?: number;
  /** Fade the field out toward the bottom. */
  fade?: boolean;
}

/**
 * A deterministic dithered ASCII field. The value at each cell comes from a
 * cheap integer hash of its coordinates, so server and client render the same
 * output and there is no hydration mismatch.
 */
export function AsciiArt({
  cols = 120,
  rows = 22,
  seed = 7,
  ramp = " ·:-=+*#%@",
  density = 0.55,
  fade = true,
  className,
  ...props
}: AsciiArtProps) {
  const lines: string[] = [];

  for (let y = 0; y < rows; y++) {
    let line = "";
    for (let x = 0; x < cols; x++) {
      const n = hash(x, y, seed);
      // Vertical gradient: dense at the top, thinning toward the bottom.
      const gradient = fade ? 1 - y / rows : 1;
      const v = n * density * gradient;
      const idx = Math.min(ramp.length - 1, Math.floor(v * ramp.length));
      line += ramp[idx];
    }
    lines.push(line);
  }

  return (
    <pre
      aria-hidden
      className={cn(
        "pointer-events-none select-none overflow-hidden font-mono text-[9px] leading-[11px] text-muted-foreground sm:text-[11px] sm:leading-[13px]",
        className
      )}
      {...props}
    >
      {lines.join("\n")}
    </pre>
  );
}

function hash(x: number, y: number, seed: number) {
  let h = x * 374761393 + y * 668265263 + seed * 2246822519;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return (h >>> 0) / 4294967295;
}
