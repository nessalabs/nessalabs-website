"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface JsonTreeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Already-parsed value. Parsing a JSON string is the host's job. */
  value: unknown;
  /** Adds a disclosure toggle to every object and array. */
  collapsible?: boolean;
  /** With `collapsible`, containers at this depth or deeper start folded. */
  defaultExpandedDepth?: number;
}

/**
 * A structured JSON renderer: keys tint muted so values carry the emphasis,
 * containers indent with real punctuation, and the text stays selectable.
 * Circular references render as [Circular] rather than recursing.
 */
export function JsonTree({
  value,
  collapsible = false,
  defaultExpandedDepth,
  className,
  ...props
}: JsonTreeProps) {
  return (
    <div
      data-slot="json-tree"
      className={cn(
        "overflow-x-auto rounded-lg border border-line bg-surface p-3 font-mono text-xs leading-5",
        className
      )}
      {...props}
    >
      <Node
        value={value}
        depth={0}
        collapsible={collapsible}
        defaultExpandedDepth={defaultExpandedDepth}
        ancestors={[]}
      />
    </div>
  );
}

function Node({
  name,
  value,
  depth,
  collapsible,
  defaultExpandedDepth,
  ancestors,
  trailingComma,
}: {
  name?: string;
  value: unknown;
  depth: number;
  collapsible: boolean;
  defaultExpandedDepth?: number;
  /** The chain from the root to this node — a cycle is a value that repeats. */
  ancestors: object[];
  trailingComma?: boolean;
}) {
  const isObject = value !== null && typeof value === "object";
  const shouldFold =
    collapsible &&
    defaultExpandedDepth !== undefined &&
    depth >= defaultExpandedDepth;
  const [open, setOpen] = React.useState(!shouldFold);

  const key = name ? (
    <>
      <span data-slot="json-tree-key" className="text-dim">
        &quot;{name}&quot;
      </span>
      <span className="text-dim">: </span>
    </>
  ) : null;

  if (!isObject) {
    return (
      <div data-slot="json-tree-row" className="whitespace-nowrap">
        {key}
        <Leaf value={value} />
        {trailingComma ? <span className="text-dim">,</span> : null}
      </div>
    );
  }

  if (ancestors.includes(value as object)) {
    return (
      <div className="whitespace-nowrap">
        {key}
        <span className="text-warn">[Circular]</span>
      </div>
    );
  }
  const nextAncestors = [...ancestors, value as object];

  const isArray = Array.isArray(value);
  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);
  const [openBrace, closeBrace] = isArray ? ["[", "]"] : ["{", "}"];

  return (
    <div data-slot="json-tree-row">
      <div className="flex items-center gap-1 whitespace-nowrap">
        {collapsible ? (
          <button
            type="button"
            data-slot="json-tree-toggle"
            aria-expanded={open}
            aria-label={open ? "Collapse" : "Expand"}
            onClick={() => setOpen((v) => !v)}
            className="text-dim transition-colors hover:text-fg"
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn("transition-transform", open && "rotate-90")}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        ) : null}
        {key}
        <span className="text-dim">{openBrace}</span>
        {!open ? (
          <>
            <span data-slot="json-tree-count" className="text-dim">
              … {entries.length}
            </span>
            <span className="text-dim">
              {closeBrace}
              {trailingComma ? "," : ""}
            </span>
          </>
        ) : null}
      </div>

      {open ? (
        <>
          <div
            data-slot="json-tree-children"
            className="border-l border-line pl-3"
            style={{ marginLeft: collapsible ? 4 : 0 }}
          >
            {entries.map(([k, v], i) => (
              <Node
                key={k}
                name={isArray ? undefined : k}
                value={v}
                depth={depth + 1}
                collapsible={collapsible}
                defaultExpandedDepth={defaultExpandedDepth}
                ancestors={nextAncestors}
                trailingComma={i < entries.length - 1}
              />
            ))}
          </div>
          <div className="text-dim">
            {closeBrace}
            {trailingComma ? "," : ""}
          </div>
        </>
      ) : null}
    </div>
  );
}

function Leaf({ value }: { value: unknown }) {
  if (typeof value === "string")
    return (
      <span data-slot="json-tree-value" className="text-code-string">
        &quot;{value}&quot;
      </span>
    );
  if (typeof value === "number")
    return (
      <span data-slot="json-tree-value" className="text-code-number">
        {value}
      </span>
    );
  if (typeof value === "boolean")
    return (
      <span data-slot="json-tree-value" className="text-code-keyword">
        {String(value)}
      </span>
    );
  return (
    <span data-slot="json-tree-value" className="text-dim">
      null
    </span>
  );
}
