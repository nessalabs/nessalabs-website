import * as React from "react";
import { cn } from "@/lib/cn";

export interface CellGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 2 | 3 | 4;
}

const colClasses: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

/** A grid of equal cards. */
export function CellGrid({ cols = 3, className, children, ...props }: CellGridProps) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-4", colClasses[cols], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function Cell({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-surface p-5 transition-colors hover:border-dim",
        className
      )}
      {...props}
    />
  );
}
