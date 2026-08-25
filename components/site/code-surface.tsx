"use client";

import * as React from "react";
import { CodeBlockProvider } from "@nessa-ui/react";
import { WorkerPoolContextProvider } from "@pierre/diffs/react";

/**
 * nessa-ui renders code through Pierre's engine, which highlights in a worker
 * pool. Storybook's bundler wires that up implicitly; in this app the pool is
 * declared here, once, so every CodeBlock, including those inside
 * MessageMarkdown and ToolCall, has somewhere to highlight.
 */
export function CodeSurfaceProvider({
  mode,
  children,
}: {
  mode: "light" | "dark";
  children: React.ReactNode;
}) {
  const poolOptions = React.useMemo(
    () => ({
      workerFactory: () =>
        new Worker(
          new URL("@pierre/diffs/worker/worker.js", import.meta.url),
          { type: "module" }
        ),
      poolSize: 2,
    }),
    []
  );

  return (
    <WorkerPoolContextProvider
      poolOptions={poolOptions}
      highlighterOptions={{ langs: ["tsx", "ts", "bash", "json", "md"] }}
    >
      <CodeBlockProvider mode={mode}>{children}</CodeBlockProvider>
    </WorkerPoolContextProvider>
  );
}
