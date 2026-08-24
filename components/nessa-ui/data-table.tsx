"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Input } from "./input";
import { Pagination } from "./pagination";

export interface DataColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right";
  sortable?: boolean;
  /** Falls back to row[key] when sorting. */
  sortValue?: (row: T) => string | number;
}

export interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: DataColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  /** Columns searched by the filter box. Omit to hide the box. */
  searchKeys?: string[];
  pageSize?: number;
  toolbar?: React.ReactNode;
  onRowClick?: (row: T) => void;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

/**
 * Table with client-side search, sorting, and pagination. State lives here, so
 * it is drop-in for a fixed dataset; lift it out for server-side data.
 */
export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  searchKeys,
  pageSize = 8,
  toolbar,
  onRowClick,
  className,
  ...props
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortState>(null);
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    if (!query.trim() || !searchKeys?.length) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) =>
      searchKeys.some((key) => String(row[key] ?? "").toLowerCase().includes(q))
    );
  }, [rows, query, searchKeys]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    const value = (row: T) =>
      col?.sortValue ? col.sortValue(row) : (row[sort.key] as string | number);
    return [...filtered].sort((a, b) => {
      const av = value(a);
      const bv = value(b);
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);

  function toggleSort(key: string) {
    setSort((prev) =>
      prev?.key === key
        ? prev.dir === "asc"
          ? { key, dir: "desc" }
          : null
        : { key, dir: "asc" }
    );
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      {(searchKeys?.length || toolbar) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          {searchKeys?.length ? (
            <Input
              className="w-full max-w-xs"
              placeholder="Search…"
              value={query}
              aria-label="Search"
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          ) : (
            <span />
          )}
          {toolbar}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-surface text-xs text-muted">
              {columns.map((col) => {
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 font-medium",
                      col.align === "right" ? "text-right" : "text-left"
                    )}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className={cn(
                          "inline-flex items-center gap-1 transition-colors hover:text-fg",
                          active && "text-fg"
                        )}
                      >
                        {col.header}
                        <span aria-hidden className="text-dim">
                          {active ? (sort?.dir === "asc" ? "↑" : "↓") : "↕"}
                        </span>
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-sm text-dim"
                >
                  No results.
                </td>
              </tr>
            ) : (
              visible.map((row, i) => (
                <tr
                  key={rowKey(row, i)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-line last:border-0",
                    onRowClick ? "cursor-pointer hover:bg-surface" : "hover:bg-surface"
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-fg",
                        col.align === "right" ? "text-right" : "text-left"
                      )}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-xs text-dim">
            {sorted.length} row{sorted.length === 1 ? "" : "s"}
          </span>
          <Pagination
            page={current}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
}
