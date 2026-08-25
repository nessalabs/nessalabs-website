"use client";

import * as React from "react";
import { Code2, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { AgentHarness } from "@/registry/demos/harness";
import { previewSource } from "@/registry/preview-source.generated";
import { SourceBlock } from "./source-block";

/**
 * The harness at full size, with its own source a click away. The code is the
 * same extracted output the component pages use, so it stays in step.
 */
export function HarnessView() {
  const [showCode, setShowCode] = React.useState(false);
  const source = previewSource["agent-harness"];

  return (
    <div className="relative h-dvh overflow-hidden">
      <AgentHarness
        headerActions={
          <button
            type="button"
            onClick={() => setShowCode((v) => !v)}
            aria-label={showCode ? "Hide source" : "View source"}
            title={showCode ? "Hide source" : "View source"}
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-md",
              "text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            )}
          >
            {showCode ? (
              <X className="size-3.5" />
            ) : (
              <Code2 className="size-3.5" />
            )}
          </button>
        }
      />

      {showCode ? (
        <div className="absolute inset-0 z-20 flex flex-col bg-background/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-2">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold">Harness source</h2>
              <p className="truncate text-xs text-muted-foreground">
                Everything on this page, assembled from @nessa-ui/react.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCode(false)}
              aria-label="Close source"
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-auto p-4">
            <div className="mx-auto w-full max-w-4xl">
              {source ? (
                <SourceBlock code={source} foldable />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Source unavailable.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
