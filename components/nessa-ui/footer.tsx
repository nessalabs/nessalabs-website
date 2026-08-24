import * as React from "react";
import { cn } from "@/lib/cn";

export interface FooterColumn {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  tagline?: string;
  columns?: FooterColumn[];
  note?: string;
}

export function Footer({
  brand,
  tagline,
  columns = [],
  note,
  className,
  ...props
}: FooterProps) {
  return (
    <footer className={cn("border-t border-line", className)} {...props}>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:px-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          {brand}
          {tagline ? (
            <p className="mt-4 max-w-xs font-mono text-xs leading-6 text-dim">
              {tagline}
            </p>
          ) : null}
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
              {col.title}
            </div>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="font-mono text-xs text-muted transition-colors hover:text-fg"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {note ? (
        <div className="hatch border-t border-line">
          <div className="mx-auto w-full max-w-6xl px-6 py-4 sm:px-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
              {note}
            </p>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
