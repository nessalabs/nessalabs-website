"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export type ToolApprovalResolution = "allow" | "allow-always" | "deny";

export interface ToolApprovalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  /** The command or payload the agent wants to run. */
  command?: React.ReactNode;
  variant?: "docked" | "floating";
  /** Once set the card goes inert and shows the decision. */
  resolution?: ToolApprovalResolution | null;
  onResolve?: (resolution: ToolApprovalResolution) => void;
  allowLabel?: string;
  alwaysLabel?: string;
  denyLabel?: string;
}

/**
 * A tool-permission request: the agent wants to run something and the person
 * decides. Once resolved the card becomes inert and states the decision, so a
 * settled request never looks live.
 */
export function ToolApproval({
  title,
  description,
  icon,
  command,
  variant = "docked",
  resolution = null,
  onResolve,
  allowLabel = "Allow once",
  alwaysLabel = "Always allow",
  denyLabel = "Deny",
  className,
  ...props
}: ToolApprovalProps) {
  const resolved = resolution !== null;

  return (
    <div
      role="group"
      data-resolution={resolution ?? undefined}
      aria-live="polite"
      className={cn(
        "rounded-xl border bg-ink transition-opacity",
        variant === "floating" ? "border-line shadow-2xl" : "border-warn/40",
        resolved && "opacity-60",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-3 p-3">
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
            resolved ? "border-line text-dim" : "border-warn/40 text-warn"
          )}
        >
          {icon ?? <ShieldIcon />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-fg">{title}</div>
          {description ? (
            <p className="mt-0.5 text-sm leading-6 text-muted">{description}</p>
          ) : null}
        </div>
      </div>

      {command ? (
        <pre className="mx-3 overflow-x-auto rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs leading-5 text-muted">
          {command}
        </pre>
      ) : null}

      <div className="flex items-center justify-end gap-2 p-3">
        {resolved ? (
          <span className="text-xs text-dim">
            {resolution === "deny"
              ? "Denied"
              : resolution === "allow-always"
                ? "Always allowed"
                : "Allowed once"}
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onResolve?.("deny")}
              className="h-8 rounded-lg px-3 text-sm text-muted transition-colors hover:bg-raised hover:text-fg"
            >
              {denyLabel}
            </button>
            <button
              type="button"
              onClick={() => onResolve?.("allow-always")}
              className="h-8 rounded-lg border border-line px-3 text-sm text-fg transition-colors hover:bg-raised"
            >
              {alwaysLabel}
            </button>
            <button
              type="button"
              onClick={() => onResolve?.("allow")}
              className="h-8 rounded-lg bg-fg px-3 text-sm font-medium text-ink transition-opacity hover:opacity-90"
            >
              {allowLabel}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
      <path d="M12 3 5 6v6c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6z" />
    </svg>
  );
}
