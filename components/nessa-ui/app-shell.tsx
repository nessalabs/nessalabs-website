"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface AppShellNavItem {
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  active?: boolean;
  onSelect?: () => void;
}

export interface AppShellSection {
  title?: string;
  items: AppShellNavItem[];
}

export interface AppShellProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  brand: React.ReactNode;
  sections: AppShellSection[];
  /** Rendered in the top bar, right side. */
  actions?: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  /** Sidebar starts collapsed to icons. */
  defaultCollapsed?: boolean;
}

/**
 * The application frame: collapsible sidebar, sticky top bar, content well.
 * Composed of plain elements so it can host any routing layer.
 */
export function AppShell({
  brand,
  sections,
  actions,
  title,
  footer,
  defaultCollapsed = false,
  className,
  children,
  ...props
}: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <div
      className={cn(
        "flex h-full overflow-hidden rounded-xl border border-line bg-ink",
        className
      )}
      {...props}
    >
      <aside
        className={cn(
          "flex shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200",
          collapsed ? "w-14" : "w-56"
        )}
      >
        <div className="flex h-12 items-center gap-2 border-b border-line px-3">
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-md p-1 text-dim transition-colors hover:bg-raised hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {collapsed ? null : (
            <div className="truncate text-sm font-medium text-fg">{brand}</div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {sections.map((section, i) => (
            <div key={section.title ?? i} className="mb-4 last:mb-0">
              {section.title && !collapsed ? (
                <div className="px-2 py-1 text-xs font-medium text-dim">
                  {section.title}
                </div>
              ) : null}
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onSelect}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                      item.active
                        ? "bg-raised font-medium text-fg"
                        : "text-muted hover:bg-raised hover:text-fg",
                      collapsed && "justify-center"
                    )}
                  >
                    {item.icon ? (
                      <span className="shrink-0 text-dim">{item.icon}</span>
                    ) : null}
                    {collapsed ? null : (
                      <>
                        <span className="flex-1 truncate text-left">
                          {item.label}
                        </span>
                        {item.badge != null ? (
                          <span className="rounded-full bg-raised px-1.5 text-xs text-dim">
                            {item.badge}
                          </span>
                        ) : null}
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {footer && !collapsed ? (
          <div className="border-t border-line p-3">{footer}</div>
        ) : null}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-line px-4">
          <div className="min-w-0 truncate text-sm font-medium text-fg">
            {title}
          </div>
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </header>
        <div className="min-h-0 flex-1 overflow-auto p-4">{children}</div>
      </div>
    </div>
  );
}
