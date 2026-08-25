"use client";

import { CodeBlock } from "@nessa-ui/react";
import { previews } from "@/registry/previews";
import { previewSource } from "@/registry/preview-source.generated";

export function ComponentPreview({ previewId }: { previewId: string }) {
  const preview = previews[previewId];
  // The code tab shows what renders above it, extracted from the demo source.
  const source = previewSource[previewId];

  return (
    <div className="space-y-3">
      <div className="flex min-h-52 items-center justify-center overflow-x-auto rounded-xl border border-border bg-card p-6">
        {preview ?? (
          <span className="text-sm text-muted-foreground">
            No preview registered
          </span>
        )}
      </div>
      {source ? <CodeBlock language="tsx" code={source} /> : null}
    </div>
  );
}
