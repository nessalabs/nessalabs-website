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
    <div className="relative h-[calc(100dvh-3.5rem-1px)] overflow-hidden">
      <AgentHarness />

      <button
        type="button"
        onClick={() => setShowCode((v) => !v)}
        aria-label={showCode ? "Hide source" : "View source"}
        title={showCode ? "Hide source" : "View source"}
        className={cn(
          "absolute right-3 top-2 z-30 inline-flex size-7 items-center justify-center rounded-md border border-border",
          "bg-background/80 text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
        )}
      >
        {showCode ? <X className="size-3.5" /> : <Code2 className="size-3.5" />}
      </button>

      {showCode ? (
        <div className="absolute inset-0 z-20 overflow-auto bg-background/95 p-6 backdrop-blur">
          <div className="mx-auto w-full max-w-4xl">
            <h2 className="mb-1 text-lg font-semibold">Harness source</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Everything on this page, assembled from @nessa-ui/react.
            </p>
            {source ? (
              <SourceBlock code={source} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Source unavailable.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
