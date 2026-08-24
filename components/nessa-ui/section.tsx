import * as React from "react";
import { cn } from "@/lib/cn";

export interface SectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Small monospace kicker rendered above the title. */
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function Section({
  eyebrow,
  title,
  description,
  action,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("border-b border-line px-6 py-16 sm:px-10", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-6xl">
        {(eyebrow || title || action) && (
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              {eyebrow ? (
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
                  {eyebrow}
                </div>
              ) : null}
              {title ? (
                <h2 className="text-2xl font-medium tracking-tight text-fg sm:text-3xl">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p className="mt-3 font-mono text-xs leading-6 text-muted">
                  {description}
                </p>
              ) : null}
            </div>
            {action}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
