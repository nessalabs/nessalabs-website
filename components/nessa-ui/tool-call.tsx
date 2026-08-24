"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type ToolCallStatus = "pending" | "running" | "complete" | "error";

export interface ToolCallProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  name: string;
  /** Leading glyph. Hosts map their own tool names to icons. */
  icon?: React.ReactNode;
  /** Short summary shown on the trigger row. */
  summary?: React.ReactNode;
  status?: ToolCallStatus;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Input and output panes, shown as tabs when both are present. */
  input?: React.ReactNode;
  output?: React.ReactNode;
  /** Files this call touched, rendered as chips. */
  files?: string[];
}

/**
 * One tool invocation in an agent transcript: a disclosure row that names the
 * tool and reveals its input, output and touched files. Expansion is
 * uncontrolled by default; `status` is exposed as `data-status` for styling.
 */
export function ToolCall({
  name,
  icon,
  summary,
  status = "complete",
  open,
  defaultOpen = false,
  onOpenChange,
  input,
  output,
  files,
  className,
  ...props
}: ToolCallProps) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const expanded = open ?? internal;
  const [pane, setPane] = React.useState<"input" | "output">(
    output ? "output" : "input"
  );
  const expandable = Boolean(input || output || files?.length);

  function toggle() {
    const next = !expanded;
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  }

  return (
    <div
      data-status={status}
      aria-busy={status === "running"}
      className={cn("rounded-lg border border-line bg-ink", className)}
      {...props}
    >
      <button
        type="button"
        onClick={expandable ? toggle : undefined}
        aria-expanded={expandable ? expanded : undefined}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-left text-xs",
          expandable && "transition-colors hover:bg-surface"
        )}
      >
        <StatusDot status={status} />
        {icon ? <span className="text-dim">{icon}</span> : null}
        <code
          className={cn(
            "text-fg",
            status === "error" && "text-danger",
            status === "running" && "animate-pulse"
          )}
        >
          {name}
        </code>
        {summary ? (
          <span className="min-w-0 flex-1 truncate text-dim">{summary}</span>
        ) : (
          <span className="flex-1" />
        )}
        {expandable ? (
          <span className="text-dim">{expanded ? "Hide" : "Show"}</span>
        ) : null}
      </button>

      {expanded && expandable ? (
        <div className="border-t border-line">
          {input && output ? (
            <div className="flex gap-1 border-b border-line px-2 py-1.5">
              {(["input", "output"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPane(value)}
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs capitalize transition-colors",
                    pane === value
                      ? "bg-raised text-fg"
                      : "text-dim hover:text-fg"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          ) : null}

          <div className="overflow-x-auto whitespace-pre-wrap px-3 py-2 font-mono text-xs leading-5 text-muted">
            {input && output ? (pane === "input" ? input : output) : input ?? output}
          </div>

          {files?.length ? (
            <div className="flex flex-wrap gap-1.5 border-t border-line px-3 py-2">
              {files.map((file) => (
                <span
                  key={file}
                  className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] text-muted"
                >
                  {file}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function StatusDot({ status }: { status: ToolCallStatus }) {
  return (
    <span
      className={cn(
        "h-1.5 w-1.5 shrink-0 rounded-full",
        status === "pending" && "bg-dim",
        status === "running" && "animate-pulse bg-warn",
        status === "complete" && "bg-success",
        status === "error" && "bg-danger"
      )}
    />
  );
}
