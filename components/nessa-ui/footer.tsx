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
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 sm:px-8 md:grid-cols-[1.5fr_repeat(2,1fr)]">
        <div>
          {brand}
          {tagline ? (
            <p className="mt-3 max-w-xs text-sm leading-6 text-dim">{tagline}</p>
          ) : null}
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <div className="mb-3 text-sm font-medium text-fg">{col.title}</div>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                    className="text-sm text-dim transition-colors hover:text-fg"
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
        <div className="border-t border-line">
          <div className="mx-auto w-full max-w-6xl px-6 py-4 sm:px-8">
            <p className="text-xs text-dim">{note}</p>
          </div>
        </div>
      ) : null}
    </footer>
  );
}
