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
  /** Drag the sidebar edge to resize it. */
  resizable?: boolean;
  defaultSidebarWidth?: number;
  minSidebarWidth?: number;
  maxSidebarWidth?: number;
  /** Optional right-hand panel; resizable and collapsible on its own. */
  inspector?: React.ReactNode;
  inspectorTitle?: React.ReactNode;
  defaultInspectorWidth?: number;
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
  resizable = true,
  defaultSidebarWidth = 224,
  minSidebarWidth = 180,
  maxSidebarWidth = 400,
  inspector,
  inspectorTitle = "Details",
  defaultInspectorWidth = 260,
  className,
  children,
  ...props
}: AppShellProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const [width, setWidth] = React.useState(defaultSidebarWidth);
  const [inspectorWidth, setInspectorWidth] = React.useState(defaultInspectorWidth);
  const [inspectorOpen, setInspectorOpen] = React.useState(true);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const resizing = React.useRef<"sidebar" | "inspector" | null>(null);

  React.useEffect(() => {
    function onMove(e: PointerEvent) {
      const target = resizing.current;
      if (!target || !rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      if (target === "sidebar") {
        setWidth(
          Math.min(maxSidebarWidth, Math.max(minSidebarWidth, e.clientX - rect.left))
        );
      } else {
        setInspectorWidth(
          Math.min(480, Math.max(200, rect.right - e.clientX))
        );
      }
    }
    function onUp() {
      resizing.current = null;
      document.body.style.userSelect = "";
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [minSidebarWidth, maxSidebarWidth]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "flex h-full overflow-hidden rounded-xl border border-line bg-ink",
        className
      )}
      {...props}
    >
      <aside
        style={collapsed ? undefined : { width }}
        className={cn(
          "flex shrink-0 flex-col border-r border-line bg-surface",
          collapsed && "w-14 transition-[width] duration-200"
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

      {resizable && !collapsed ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          tabIndex={0}
          onPointerDown={() => {
            resizing.current = "sidebar";
            document.body.style.userSelect = "none";
          }}
          onDoubleClick={() => setWidth(defaultSidebarWidth)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setWidth((w) => Math.max(minSidebarWidth, w - 16));
            if (e.key === "ArrowRight") setWidth((w) => Math.min(maxSidebarWidth, w + 16));
          }}
          className="relative w-px shrink-0 cursor-col-resize bg-line transition-colors hover:bg-dim focus-visible:bg-fg focus-visible:outline-none"
        >
          <span aria-hidden className="absolute -inset-x-1.5 inset-y-0" />
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-line px-4">
          <div className="min-w-0 truncate text-sm font-medium text-fg">
            {title}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            {inspector ? (
              <button
                type="button"
                onClick={() => setInspectorOpen((v) => !v)}
                aria-pressed={inspectorOpen}
                title="Toggle panel"
                className={cn(
                  "rounded-md border border-line p-1 transition-colors hover:bg-raised",
                  inspectorOpen ? "text-fg" : "text-dim"
                )}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M15 4v16" />
                </svg>
              </button>
            ) : null}
          </div>
        </header>
        <div className="flex min-h-0 flex-1">
          <div className="min-w-0 flex-1 overflow-auto p-4">{children}</div>

          {inspector && inspectorOpen ? (
            <>
              <div
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize panel"
                tabIndex={0}
                onPointerDown={() => {
                  resizing.current = "inspector";
                  document.body.style.userSelect = "none";
                }}
                onDoubleClick={() => setInspectorWidth(defaultInspectorWidth)}
                className="relative w-px shrink-0 cursor-col-resize bg-line transition-colors hover:bg-dim focus-visible:bg-fg focus-visible:outline-none"
              >
                <span aria-hidden className="absolute -inset-x-1.5 inset-y-0" />
              </div>
              <aside
                style={{ width: inspectorWidth }}
                className="shrink-0 overflow-auto bg-surface"
              >
                <div className="border-b border-line px-3 py-2 text-sm font-medium text-fg">
                  {inspectorTitle}
                </div>
                <div className="p-3">{inspector}</div>
              </aside>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
