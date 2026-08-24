"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface ModelOption {
  id: string;
  name: string;
  description?: string;
  /** Small trailing markers: context window, tier, badges. */
  meta?: string;
  disabled?: boolean;
}

export interface ModelGroup {
  label: string;
  models: ModelOption[];
}

export interface ModelPickerProps {
  groups: ModelGroup[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

/**
 * A grouped, searchable model list in a popover. Type to filter, ↑/↓ to move,
 * Enter to choose, Escape to dismiss — the roving highlight never leaves the
 * search field, so filtering and selecting are the same gesture.
 */
export function ModelPicker({
  groups,
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen = false,
  onOpenChange,
  placeholder = "Select a model",
  searchPlaceholder = "Search models…",
  emptyMessage = "No models match.",
  disabled,
  className,
  contentClassName,
}: ModelPickerProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const selected = value ?? internalValue;

  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return groups
      .map((group) => ({
        ...group,
        models: group.models.filter(
          (m) =>
            !q ||
            m.name.toLowerCase().includes(q) ||
            m.description?.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.models.length > 0);
  }, [groups, query]);

  const flat = React.useMemo(
    () => filtered.flatMap((group) => group.models),
    [filtered]
  );

  const current = React.useMemo(
    () => groups.flatMap((g) => g.models).find((m) => m.id === selected),
    [groups, selected]
  );

  function setOpen(next: boolean) {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
    if (next) {
      setQuery("");
      setActive(0);
    }
  }

  function choose(model: ModelOption) {
    if (model.disabled) return;
    if (value === undefined) setInternalValue(model.id);
    onValueChange?.(model.id);
    setOpen(false);
  }

  React.useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  });

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm transition-colors",
          "hover:bg-raised disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <span className={current ? "text-fg" : "text-dim"}>
          {current?.name ?? placeholder}
        </span>
        {current?.meta ? (
          <span className="text-xs text-dim">{current.meta}</span>
        ) : null}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-dim" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen ? (
        <div
          className={cn(
            "absolute z-50 mt-2 w-72 overflow-hidden rounded-lg border border-line bg-ink shadow-xl",
            contentClassName
          )}
        >
          <input
            autoFocus
            value={query}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(flat.length - 1, i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(0, i - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                const model = flat[active];
                if (model) choose(model);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setOpen(false);
              }
            }}
            className="w-full border-b border-line bg-transparent px-3 py-2 text-sm text-fg outline-none placeholder:text-dim"
          />

          <div role="listbox" className="max-h-64 overflow-y-auto p-1">
            {flat.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-dim">
                {emptyMessage}
              </div>
            ) : (
              filtered.map((group) => (
                <div key={group.label} className="mb-1 last:mb-0">
                  <div className="px-2 py-1 text-xs text-dim">{group.label}</div>
                  {group.models.map((model) => {
                    const index = flat.indexOf(model);
                    return (
                      <button
                        key={model.id}
                        type="button"
                        role="option"
                        aria-selected={model.id === selected}
                        disabled={model.disabled}
                        onMouseEnter={() => setActive(index)}
                        onClick={() => choose(model)}
                        className={cn(
                          "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
                          index === active && "bg-raised",
                          model.disabled && "cursor-not-allowed opacity-40"
                        )}
                      >
                        <span className="mt-1 w-3 text-xs text-fg">
                          {model.id === selected ? "✓" : ""}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate text-sm text-fg">
                              {model.name}
                            </span>
                            {model.meta ? (
                              <span className="shrink-0 text-xs text-dim">
                                {model.meta}
                              </span>
                            ) : null}
                          </span>
                          {model.description ? (
                            <span className="block truncate text-xs text-dim">
                              {model.description}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
