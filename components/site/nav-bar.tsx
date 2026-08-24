"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface NavBarProps extends React.HTMLAttributes<HTMLElement> {
  brand: React.ReactNode;
  links?: NavLink[];
  action?: React.ReactNode;
  /** Highlight the link whose href prefixes this path. */
  activeHref?: string;
}

export function NavBar({
  brand,
  links = [],
  action,
  activeHref,
  className,
  ...props
}: NavBarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-8">
          {brand}
          <nav className="hidden items-center gap-6 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className={cn(
                  "text-sm transition-colors",
                  activeHref && activeHref.startsWith(link.href)
                    ? "text-fg"
                    : "text-dim hover:text-fg"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">{action}</div>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="text-sm text-dim hover:text-fg md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted hover:text-fg"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">{action}</div>
          </div>
        </nav>
      )}
    </header>
  );
}
