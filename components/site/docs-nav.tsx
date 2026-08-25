"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { groups, registry } from "@/registry";

const sections = [
  { label: "Getting started", items: [{ slug: "", name: "Overview" }] },
  ...groups.map((group) => ({
    label: group,
    items: registry.filter((c) => c.group === group),
  })),
];

/**
 * Docs navigation. A pinned rail on desktop; on small screens the same tree
 * collapses into a disclosure above the content, so the docs stay navigable
 * without the rail.
 */
export function DocsNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const current =
    registry.find((c) => pathname === `/ui/components/${c.slug}`)?.name ??
    "Overview";

  React.useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {/* mobile */}
      <div className="border-b border-border lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 px-6 py-3 text-sm sm:px-8"
        >
          <span className="text-muted-foreground">
            Components <span className="text-foreground">/ {current}</span>
          </span>
          <ChevronDown
            size={16}
            className={cn(
              "text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
        {open ? (
          <div className="max-h-[60vh] overflow-y-auto border-t border-border px-4 py-3 sm:px-6">
            <Tree pathname={pathname} />
          </div>
        ) : null}
      </div>

      {/* desktop */}
      <aside className="hidden h-full w-60 shrink-0 overflow-y-auto border-r border-border lg:block">
        <div className="py-8 pl-6 pr-4">
          <Tree pathname={pathname} />
        </div>
      </aside>
    </>
  );
}

function Tree({ pathname }: { pathname: string }) {
  return (
    <>
      {sections.map((section) => (
        <div key={section.label} className="mb-6 last:mb-0">
          <div className="mb-2 px-3 text-xs font-medium text-muted-foreground">
            {section.label}
          </div>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const href = item.slug
                ? `/ui/components/${item.slug}`
                : "/ui/components";
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    pathname === href
                      ? "bg-secondary font-medium text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
