import * as React from "react";
import { cn } from "@/lib/cn";

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Card({
  title,
  description,
  footer,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-line bg-surface",
        className
      )}
      {...props}
    >
      {(title || description) && (
        <div className="border-b border-line px-5 py-4">
          {title ? (
            <div className="font-medium text-fg">{title}</div>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm leading-6 text-muted">{description}</p>
          ) : null}
        </div>
      )}
      {children ? <div className="flex-1 px-5 py-4">{children}</div> : null}
      {footer ? (
        <div className="border-t border-line px-5 py-3">{footer}</div>
      ) : null}
    </div>
  );
}
