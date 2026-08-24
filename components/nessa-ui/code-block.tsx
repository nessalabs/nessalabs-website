"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { highlight, type TokenKind } from "@/lib/highlight";

export interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  lang?: string;
  filename?: string;
  showLineNumbers?: boolean;
  copyable?: boolean;
}

const tokenClass: Record<TokenKind, string> = {
  plain: "text-fg",
  comment: "text-dim italic",
  string: "text-code-string",
  keyword: "text-code-keyword",
  number: "text-code-number",
  tag: "text-code-tag",
  attr: "text-code-attr",
  prop: "text-code-attr",
  fn: "text-code-fn",
  punct: "text-dim",
};

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
        "group relative overflow-hidden rounded-xl border border-line bg-surface",
        className
      )}
      {...props}
    >
      {filename ? (
        <div className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-dim">
          <span>{filename}</span>
          <span className="uppercase">{lang}</span>
        </div>
      ) : null}

      {copyable ? (
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className={cn(
            "absolute right-2 z-10 rounded-md border border-line bg-raised px-2 py-1 text-xs text-dim",
            "opacity-0 transition hover:text-fg focus-visible:opacity-100 group-hover:opacity-100",
            filename ? "top-11" : "top-2"
          )}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      ) : null}

      <pre className="overflow-x-auto p-4 text-xs leading-6">
        <code>
          {lines.map((line, i) => (
            <span key={i} className="block">
              {showLineNumbers ? (
                <span className="mr-4 inline-block w-4 select-none text-right text-dim">
                  {i + 1}
                </span>
              ) : null}
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
