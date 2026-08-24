"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Leading prompt glyph, e.g. "$" or ">". */
  prompt?: string;
}

export function Input({ prompt, className, ...props }: InputProps) {
  return (
    <div
      className={cn(
        "flex h-9 items-center gap-2 border border-line bg-surface px-3",
        "focus-within:border-dim",
        className
      )}
    >
      {prompt ? (
        <span aria-hidden className="select-none font-mono text-xs text-accent">
          {prompt}
        </span>
      ) : null}
      <input
        className="h-full w-full bg-transparent font-mono text-xs text-fg outline-none placeholder:text-dim"
        {...props}
      />
    </div>
  );
}
