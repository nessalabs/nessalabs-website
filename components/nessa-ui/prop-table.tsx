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
      className={cn("overflow-x-auto border border-line", className)}
      {...props}
    >
      <table className="w-full border-collapse font-mono text-xs">
        <thead>
          <tr className="border-b border-line text-left text-[10px] uppercase tracking-[0.18em] text-dim">
            <th className="px-3 py-2 font-normal">Prop</th>
            <th className="px-3 py-2 font-normal">Type</th>
            <th className="px-3 py-2 font-normal">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-line last:border-0">
              <td className="px-3 py-2 align-top text-fg whitespace-nowrap">
                {row.name}
                {row.description ? (
                  <div className="pt-1 text-[11px] text-dim normal-case">
                    {row.description}
                  </div>
                ) : null}
              </td>
              <td className="px-3 py-2 align-top text-accent whitespace-pre-wrap">
                {row.type}
              </td>
              <td className="px-3 py-2 align-top text-muted whitespace-nowrap">
                {row.default ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
