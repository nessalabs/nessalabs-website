import * as React from "react";
import { cn } from "@/lib/cn";

type Tone = "info" | "success" | "warn" | "danger";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title?: string;
}

const tones: Record<Tone, string> = {
  info: "border-line bg-surface text-fg",
  success: "border-success/30 bg-success/5 text-success",
  warn: "border-warn/30 bg-warn/5 text-warn",
  danger: "border-danger/30 bg-danger/5 text-danger",
};

export function Alert({
  tone = "info",
  title,
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="status"
      className={cn("rounded-lg border p-4", tones[tone], className)}
      {...props}
    >
      {title ? <div className="text-sm font-medium">{title}</div> : null}
      {children ? (
        <div className={cn("text-sm leading-6 opacity-90", title && "mt-1")}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
