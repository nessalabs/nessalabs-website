"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { groups, registry } from "@/registry";

const sections: {
  label: string;
  items: { slug?: string; href?: string; name: string }[];
}[] = [
  {
    label: "Getting started",
    items: [
      { slug: "", name: "Overview" },
      { href: "/ui/harness", name: "Agent harness" },
    ],
  },
  ...groups.map((group) => ({
    label: group,
    items: registry.filter((c) => c.group === group),
  })),
];

/**
 * Docs navigation. A pinned rail on desktop; on small screens the same tree
 * slides in from the left as a drawer, so the reader keeps their place in the
 * page instead of having the content pushed down by a disclosure.
 */
export function DocsNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const current =
    registry.find((c) => pathname === `/ui/components/${c.slug}`)?.name ??
    "Overview";

  React.useEffect(() => setOpen(false), [pathname]);

  // While the drawer is open it owns the viewport: escape closes it, the page
  // behind it does not scroll, and focus starts inside the panel.
  React.useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      {/* mobile */}
      <div className="border-b border-border lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="docs-nav-drawer"
          className="flex w-full items-center gap-2.5 px-6 py-3 text-sm sm:px-8"
        >
          <PanelLeft size={16} className="shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">
            Components <span className="text-foreground">/ {current}</span>
          </span>
        </button>
      </div>

      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[60] lg:hidden",
          // Opening is immediate so the panel is focusable at once; closing
          // holds visibility across the slide-out, then drops out of the tab
          // order.
          open
            ? "visible"
            : "invisible transition-[visibility] duration-200 motion-reduce:transition-none"
        )}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          id="docs-nav-drawer"
          ref={panelRef}
          role="dialog"
          aria-modal={open || undefined}
          aria-label="Components navigation"
          tabIndex={-1}
          className={cn(
            "absolute inset-y-0 left-0 flex w-[17rem] max-w-[85vw] flex-col border-r border-border bg-background outline-none",
            "transition-transform duration-200 ease-out motion-reduce:transition-none",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border pl-6 pr-3">
            <span className="text-sm font-medium">Components</span>
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X size={16} aria-hidden />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain py-6 pl-3 pr-3">
            <Tree pathname={pathname} />
          </div>
        </div>
      </div>

      {/* desktop */}
      <aside className="hidden h-full w-60 shrink-0 overflow-y-auto overscroll-contain border-r border-border lg:block">
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
              const href =
                item.href ?? (item.slug ? `/ui/components/${item.slug}` : "/ui/components");
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
