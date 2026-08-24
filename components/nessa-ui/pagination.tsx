"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  const pages = React.useMemo(() => {
    const out: (number | "…")[] = [];
    for (let i = 1; i <= pageCount; i++) {
      if (i === 1 || i === pageCount || Math.abs(i - page) <= 1) out.push(i);
      else if (out[out.length - 1] !== "…") out.push("…");
    }
    return out;
  }, [page, pageCount]);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      <PageButton
        disabled={page <= 1}
        onClick={() => onPageChange?.(page - 1)}
      >
        Previous
      </PageButton>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-2 text-sm text-dim">
            …
          </span>
        ) : (
          <PageButton
            key={p}
            active={p === page}
            onClick={() => onPageChange?.(p)}
          >
            {p}
          </PageButton>
        )
      )}
      <PageButton
        disabled={page >= pageCount}
        onClick={() => onPageChange?.(page + 1)}
      >
        Next
      </PageButton>
    </nav>
  );
}

function PageButton({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      className={cn(
        "h-8 min-w-8 rounded-lg border px-2.5 text-sm transition-colors",
        active
          ? "border-fg bg-fg text-ink"
          : "border-line text-muted hover:bg-raised hover:text-fg",
        "disabled:pointer-events-none disabled:opacity-40",
        className
      )}
      {...props}
    />
  );
}
