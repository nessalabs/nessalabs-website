import * as React from "react";
import { cn } from "@/lib/cn";

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description?: string;
}

export interface PropTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: PropRow[];
}

export function PropTable({ rows, className, ...props }: PropTableProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-xl border border-line",
        className
      )}
      {...props}
    >
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line bg-surface text-left text-xs text-dim">
            <th className="px-4 py-2.5 font-medium">Prop</th>
            <th className="px-4 py-2.5 font-medium">Type</th>
            <th className="px-4 py-2.5 font-medium">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-line last:border-0">
              <td className="px-4 py-3 align-top">
                <code className="text-xs text-fg">{row.name}</code>
                {row.description ? (
                  <div className="pt-1 text-xs text-dim">{row.description}</div>
                ) : null}
              </td>
              <td className="px-4 py-3 align-top">
                <code className="text-xs whitespace-pre-wrap text-accent">
                  {row.type}
                </code>
              </td>
              <td className="px-4 py-3 align-top whitespace-nowrap">
                <code className="text-xs text-muted">{row.default ?? "—"}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
