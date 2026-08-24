"use client";

import { CodeBlock, Tabs } from "@/components/nessa-ui";
import { previews } from "@/registry/previews";

export function ComponentPreview({
  previewId,
  code,
}: {
  previewId: string;
  code: string;
}) {
  const preview = previews[previewId];

  return (
    <Tabs
      items={[
        {
          value: "preview",
          label: "Preview",
          content: (
            <div className="grid-lines flex min-h-48 items-center justify-center border border-line p-8">
              {preview ?? (
                <span className="font-mono text-xs text-dim">
                  no preview registered
                </span>
              )}
            </div>
          ),
        },
        {
          value: "code",
          label: "Code",
          content: <CodeBlock code={code} showLineNumbers />,
        },
      ]}
    />
  );
}
