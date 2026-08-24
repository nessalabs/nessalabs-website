import * as React from "react";
import { cn } from "@/lib/cn";

export interface Column<T> {
  key: string;
  header: string;
  /** Falls back to String(row[key]). */
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right";
  width?: string;
}

export interface TableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  empty?: React.ReactNode;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  empty = "No results.",
  className,
  ...props
}: TableProps<T>) {
  return (
    <div
      className={cn("overflow-x-auto rounded-xl border border-line", className)}
      {...props}
    >
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-surface text-xs text-muted">
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  "px-4 py-2.5 font-medium",
                  col.align === "right" ? "text-right" : "text-left"
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-dim"
              >
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                className="border-b border-line last:border-0 hover:bg-surface"
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
  );
}
