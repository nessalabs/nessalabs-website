"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { highlight, type TokenKind } from "@/lib/highlight";

const tokenClass: Record<TokenKind, string> = {
  plain: "text-foreground",
  comment: "text-muted-foreground italic",
  string: "text-emerald-600 dark:text-emerald-300",
  keyword: "text-violet-600 dark:text-violet-300",
  number: "text-amber-600 dark:text-amber-300",
  tag: "text-rose-600 dark:text-rose-300",
  attr: "text-sky-700 dark:text-sky-300",
  prop: "text-sky-700 dark:text-sky-300",
  fn: "text-cyan-700 dark:text-cyan-300",
  punct: "text-muted-foreground",
};

/**
 * The docs' own code surface.
 *
 * nessa-ui's CodeBlock renders through Pierre's worker-backed engine, which
 * does not paint inside this app yet (tracked with the library team). Until it
 * does, docs chrome (install commands, preview source) uses this local
 * renderer. The CodeBlock page still demos the real component.
 */
export function SourceBlock({
  code,
  lang = "tsx",
  className,
}: {
  code: string;
  lang?: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const lines = React.useMemo(
    () => code.replace(/\n$/, "").split("\n"),
    [code]
  );

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
      className={cn(
        "group relative min-w-0 overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-2 top-2 z-10 rounded-md border border-border bg-background/80 px-2 py-1 text-xs text-muted-foreground opacity-0 backdrop-blur transition hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-6">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {line ? <Line line={line} lang={lang} /> : " "}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function Line({ line, lang }: { line: string; lang: string }) {
  const tokens = React.useMemo(() => highlight(line, lang), [line, lang]);
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} className={tokenClass[token.kind]}>
          {token.value}
        </span>
      ))}
    </>
  );
}
