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
          content: <CodeBlock code={code} showLineNumbers />,
        },
      ]}
    />
  );
}
