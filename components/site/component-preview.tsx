"use client";

import { CodeBlock, Tabs } from "@/components/nessa-ui";
import { previews } from "@/registry/previews";
import { previewSource } from "@/registry/preview-source.generated";

export function ComponentPreview({
  previewId,
  code,
}: {
  previewId: string;
  /** Fallback when a preview has no generated source. */
  code: string;
}) {
  const preview = previews[previewId];
  // The code tab shows what actually renders above it, extracted from
  // registry/previews.tsx at build time.
  const source = previewSource[previewId] ?? code;

  return (
    <Tabs
      items={[
        {
          value: "preview",
          label: "Preview",
          content: (
            <div className="flex min-h-52 items-center justify-center rounded-xl border border-line bg-surface p-8">
              {preview ?? (
                <span className="text-sm text-dim">
                  no preview registered
                </span>
              )}
            </div>
          ),
        },
        {
          value: "code",
          label: "Code",
          content: <CodeBlock code={source} showLineNumbers />,
        },
      ]}
    />
  );
}
