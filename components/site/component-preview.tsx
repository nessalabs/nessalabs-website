"use client";

import * as React from "react";
import { SourceBlock } from "./source-block";
import { cn } from "@/lib/cn";
import { previews } from "@/registry/previews";
import { previewSource } from "@/registry/preview-source.generated";

/**
 * A preview and its source behind one tab pair. The code is extracted from the
 * demo that renders above it, so the two can never disagree.
 */
export function ComponentPreview({ previewId }: { previewId: string }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const preview = previews[previewId];
  const source = previewSource[previewId];

  return (
    <div className="w-full min-w-0">
      <div role="tablist" className="flex gap-1 border-b border-border">
        <Tab active={tab === "preview"} onClick={() => setTab("preview")}>
          Preview
        </Tab>
        {source ? (
          <Tab active={tab === "code"} onClick={() => setTab("code")}>
            Code
          </Tab>
        ) : null}
      </div>

      <div className="pt-4">
        {tab === "preview" || !source ? (
          <div
            role="tabpanel"
          className="flex min-h-52 w-full min-w-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card p-6"
          >
            {preview ?? (
              <span className="text-sm text-muted-foreground">
                No preview registered
              </span>
            )}
          </div>
        ) : (
          <div role="tabpanel" className="w-full min-w-0 overflow-hidden rounded-xl">
            <SourceBlock code={source} />
          </div>
        )}
      </div>
    </div>
  );
}

function Tab({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn(
        "-mb-px border-b-2 px-3 py-2 text-sm transition-colors",
        active
          ? "border-foreground text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    />
  );
}
