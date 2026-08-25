"use client";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
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

export interface CodeFolding {
  lines: string[];
  regions: Map<number, Region>;
  collapsed: Set<number>;
  hidden: Set<number>;
  allCollapsed: boolean;
  atDefault: boolean;
  toggle: (start: number) => void;
  toggleAll: () => void;
  reset: () => void;
}

/**
 * Folding state for one block of code. It lives outside SourceBlock so a host
 * can put the controls wherever they belong, which for the harness is the
 * overlay header rather than a corner of the code.
 */
export function useCodeFolding(code: string): CodeFolding {
  const lines = React.useMemo(
    () => code.replace(/\n$/, "").split("\n"),
    [code],
  );
  const regions = React.useMemo(() => findRegions(lines), [lines]);
  const initial = React.useMemo(
    () => defaultCollapsed(regions, lines),
    [lines, regions],
  );
  const [collapsed, setCollapsed] = React.useState<Set<number>>(initial);

  // Whichever collapsed region a line falls inside, it stays out of the flow.
  const hidden = React.useMemo(() => {
    const set = new Set<number>();
    for (const start of collapsed) {
      const region = regions.get(start);
      if (!region) continue;
      for (let i = start + 1; i <= region.end; i += 1) set.add(i);
    }
    return set;
  }, [collapsed, regions]);

  const allCollapsed = collapsed.size >= regions.size && regions.size > 0;

  return {
    lines,
    regions,
    collapsed,
    hidden,
    allCollapsed,
    atDefault:
      collapsed.size === initial.size &&
      [...collapsed].every((start) => initial.has(start)),
    toggle: (start) =>
      setCollapsed((prev) => {
        const next = new Set(prev);
        if (!next.delete(start)) next.add(start);
        return next;
      }),
    toggleAll: () =>
      setCollapsed(allCollapsed ? new Set() : new Set(regions.keys())),
    reset: () => setCollapsed(new Set(initial)),
  };
}

/** The fold controls, for a host that renders them outside the block. */
export function CodeFoldingControls({
  folding,
  className,
}: {
  folding: CodeFolding;
  className?: string;
}) {
  if (folding.regions.size === 0) return null;
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {folding.atDefault ? null : (
        <button
          type="button"
          onClick={folding.reset}
          className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground"
        >
          Reset
        </button>
      )}
      <button
        type="button"
        onClick={folding.toggleAll}
        className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition hover:bg-accent hover:text-foreground"
      >
        {folding.allCollapsed ? "Expand all" : "Collapse all"}
      </button>
    </div>
  );
}

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
  folding,
}: {
  code: string;
  lang?: string;
  className?: string;
  /** Editor-style folding, from useCodeFolding. Omit for a plain block. */
  folding?: CodeFolding;
}) {
  const [copied, setCopied] = React.useState(false);
  const plainLines = React.useMemo(
    () => code.replace(/\n$/, "").split("\n"),
    [code],
  );
  const lines = folding?.lines ?? plainLines;
  const regions = folding?.regions ?? emptyRegions;
  const hidden = folding?.hidden ?? emptyLines;
  const collapsed = folding?.collapsed ?? emptyLines;
  const toggle = folding?.toggle ?? noop;

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
        className,
      )}
    >
      <div className="absolute right-2 top-2 z-10 flex gap-1 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="rounded-md border border-border bg-background/80 px-2 py-1 text-xs text-muted-foreground backdrop-blur transition hover:text-foreground"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-6">
        <code>
          {lines.map((line, i) => {
            if (hidden.has(i)) return null;
            const region = regions.get(i);
            const isCollapsed = collapsed.has(i);
            return (
              <span key={i} className="flex">
                {folding ? (
                  <span className="sticky left-0 w-4 shrink-0 select-none bg-card">
                    {region ? (
                      <button
                        type="button"
                        onClick={() => toggle(i)}
                        aria-expanded={!isCollapsed}
                        aria-label={
                          isCollapsed ? "Expand block" : "Collapse block"
                        }
                        className="flex size-4 translate-y-1 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                      >
                        {isCollapsed ? (
                          <ChevronRight aria-hidden className="size-3" />
                        ) : (
                          <ChevronDown aria-hidden className="size-3" />
                        )}
                      </button>
                    ) : null}
                  </span>
                ) : null}
                <span className="min-w-0">
                  {line ? <Line line={line} lang={lang} /> : " "}
                  {isCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      className="ms-2 rounded bg-muted px-1.5 text-xs text-muted-foreground hover:text-foreground"
                      aria-label="Expand block"
                    >
                      {region ? `${region.end - i} lines` : "\u2026"}
                    </button>
                  ) : null}
                </span>
              </span>
            );
          })}
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

type Region = { end: number; indent: number };

const indentOf = (line: string) => line.match(/^\s*/)![0].length;

/**
 * Indentation folding, the way an editor does it: a line opens a region when
 * the next non-blank line is deeper, and the region runs to the last line that
 * stays deeper.
 */
function findRegions(lines: string[]): Map<number, Region> {
  const regions = new Map<number, Region>();
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].trim()) continue;
    const indent = indentOf(lines[i]);
    let next = i + 1;
    while (next < lines.length && !lines[next].trim()) next += 1;
    if (next >= lines.length || indentOf(lines[next]) <= indent) continue;
    let end = i;
    for (let j = next; j < lines.length; j += 1) {
      if (!lines[j].trim()) continue;
      if (indentOf(lines[j]) <= indent) break;
      end = j;
    }
    if (end > i) regions.set(i, { end, indent });
  }
  return regions;
}

/** `const NAME = [` / `= {`: a data literal rather than a component or hook. */
const dataDeclaration =
  /^(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*(?::[^=]+)?\s*=\s*[[{]\s*$/;

/**
 * The default view: code open, data folded. Fixtures and lookup tables are
 * the bulk of a demo file and almost never what a reader came for, so they
 * start closed; components, hooks and handlers stay open.
 */
function defaultCollapsed(regions: Map<number, Region>, lines: string[]) {
  const collapsed = new Set<number>();
  for (const [start, region] of regions) {
    if (region.indent !== 0) continue;
    if (region.end - start < 4) continue;
    if (dataDeclaration.test(lines[start])) collapsed.add(start);
  }
  return collapsed;
}

const emptyRegions = new Map<number, Region>();
const emptyLines = new Set<number>();
const noop = () => {};
