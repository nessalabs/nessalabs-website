"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  lang?: string;
  filename?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
}

export function CodeBlock({
  code,
  lang = "tsx",
  filename,
  showLineNumbers = false,
  copyable = true,
  className,
  ...props
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={cn("group relative rounded-xl border border-line bg-surface", className)}
      {...props}
    >
      {(filename || lang) && (
        <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-dim">
          <span>{filename ?? lang}</span>
        </div>
      )}

      {copyable && (
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="absolute right-2 top-2 z-10 rounded-md border border-line bg-raised px-2 py-1 text-xs text-dim opacity-0 transition hover:text-fg focus-visible:opacity-100 group-hover:opacity-100"
          style={filename || lang ? { top: "2.25rem" } : undefined}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      )}

      <pre className="overflow-x-auto p-4 text-xs leading-6 text-muted">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {showLineNumbers && (
                <span className="mr-4 select-none text-dim">
                  {String(i + 1).padStart(2, " ")}
                </span>
              )}
              {line || " "}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
