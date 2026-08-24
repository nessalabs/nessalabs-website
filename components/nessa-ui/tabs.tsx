"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItem[];
  defaultValue?: string;
}

export function Tabs({ items, defaultValue, className, ...props }: TabsProps) {
  const [active, setActive] = React.useState(defaultValue ?? items[0]?.value);

  return (
    <div className={cn("w-full", className)} {...props}>
      <div role="tablist" className="flex gap-1 border-b border-line">
        {items.map((item) => {
          const selected = item.value === active;
          return (
            <button
              key={item.value}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(item.value)}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-sm transition-colors",
                selected
                  ? "border-fg text-fg"
                  : "border-transparent text-dim hover:text-muted"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) =>
        item.value === active ? (
          <div key={item.value} role="tabpanel" className="pt-4">
            {item.content}
          </div>
        ) : null
      )}
    </div>
  );
}
