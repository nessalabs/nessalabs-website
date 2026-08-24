"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface FileDiff {
  path: string;
  additions: number;
  deletions: number;
  status?: "added" | "modified" | "deleted" | "renamed";
}

export interface FileDiffListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  files: FileDiff[];
  title?: React.ReactNode;
  /** Files shown before the "show all" toggle. */
  collapsedCount?: number;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onFileClick?: (file: FileDiff) => void;
}

const statusLabel = {
  added: "A",
  modified: "M",
  deleted: "D",
  renamed: "R",
};

/**
 * The change summary an agent produces: files touched with their add/delete
 * counts, folded to the first few until expanded.
 */
export function FileDiffList({
  files,
  title = "Changes",
  collapsedCount = 3,
  expanded,
  defaultExpanded = false,
  onExpandedChange,
  onFileClick,
  className,
  ...props
}: FileDiffListProps) {
  const [internal, setInternal] = React.useState(defaultExpanded);
  const open = expanded ?? internal;
  const visible = open ? files : files.slice(0, collapsedCount);
  const hidden = files.length - visible.length;

  const additions = files.reduce((sum, f) => sum + f.additions, 0);
  const deletions = files.reduce((sum, f) => sum + f.deletions, 0);

  function toggle() {
    const next = !open;
    if (expanded === undefined) setInternal(next);
    onExpandedChange?.(next);
  }

  return (
    <div
      className={cn("rounded-lg border border-line bg-ink", className)}
      {...props}
    >
      <div className="flex items-center gap-2 border-b border-line px-3 py-2 text-xs">
        <span className="font-medium text-fg">{title}</span>
        <span className="text-dim">
          {files.length} file{files.length === 1 ? "" : "s"}
        </span>
        <DiffStat additions={additions} deletions={deletions} className="ml-auto" />
      </div>

      <ul>
        {visible.map((file) => (
          <li key={file.path}>
            <button
              type="button"
              onClick={() => onFileClick?.(file)}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-surface"
            >
              {file.status ? (
                <span
                  className={cn(
                    "w-3 shrink-0 text-center font-mono",
                    file.status === "added" && "text-success",
                    file.status === "deleted" && "text-danger",
                    file.status === "modified" && "text-warn",
                    file.status === "renamed" && "text-dim"
                  )}
                >
                  {statusLabel[file.status]}
                </span>
              ) : null}
              <span className="min-w-0 flex-1 truncate font-mono text-muted">
                {file.path}
              </span>
              <DiffStat additions={file.additions} deletions={file.deletions} />
            </button>
          </li>
        ))}
      </ul>

      {files.length > collapsedCount ? (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          className="w-full border-t border-line px-3 py-1.5 text-xs text-dim transition-colors hover:bg-surface hover:text-fg"
        >
          {open ? "Show less" : `Show ${hidden} more`}
        </button>
      ) : null}
    </div>
  );
}

export function DiffStat({
  additions,
  deletions,
  className,
  ...props
}: Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  additions: number;
  deletions: number;
}) {
  return (
    <span
      className={cn("shrink-0 font-mono text-[11px]", className)}
      {...props}
    >
      <span className="text-success">+{additions}</span>{" "}
      <span className="text-danger">−{deletions}</span>
    </span>
  );
}
