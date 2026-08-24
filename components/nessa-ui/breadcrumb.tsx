import * as React from "react";
import { cn } from "@/lib/cn";

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: Crumb[];
}

export function Breadcrumb({ items, className, ...props }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <a href={item.href} className="text-dim hover:text-fg">
                  {item.label}
                </a>
              ) : (
                <span className={last ? "text-fg" : "text-dim"}>
                  {item.label}
                </span>
              )}
              {last ? null : (
                <span aria-hidden className="text-dim">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
