"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ icon, className, ...props }: InputProps) {
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-3",
        "transition-colors focus-within:border-dim",
        className
      )}
    >
      {icon ? <span className="shrink-0 text-dim">{icon}</span> : null}
      <input
        className="h-full w-full bg-transparent text-sm text-fg outline-none placeholder:text-dim"
        {...props}
      />
    </div>
  );
}
