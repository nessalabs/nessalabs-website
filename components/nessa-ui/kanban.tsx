"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface KanbanCard {
  id: string;
  title: string;
  meta?: React.ReactNode;
  tag?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  columns: KanbanColumn[];
  /** Controlled: pass the next board back through this. Omit for internal state. */
  onChange?: (columns: KanbanColumn[]) => void;
}

/** Board with native drag and drop between columns. */
export function Kanban({ columns, onChange, className, ...props }: KanbanProps) {
  const [internal, setInternal] = React.useState(columns);
  const board = onChange ? columns : internal;
  const [dragging, setDragging] = React.useState<string | null>(null);
  const [over, setOver] = React.useState<string | null>(null);

  function move(cardId: string, toColumn: string) {
    const next = board.map((col) => ({
      ...col,
      cards: col.cards.filter((c) => c.id !== cardId),
    }));
    const card = board.flatMap((c) => c.cards).find((c) => c.id === cardId);
    if (!card) return;
    const target = next.find((c) => c.id === toColumn);
    target?.cards.push(card);
    if (onChange) onChange(next);
    else setInternal(next);
  }

  return (
    <div
      className={cn("flex gap-3 overflow-x-auto pb-2", className)}
      {...props}
    >
      {board.map((col) => (
        <div
          key={col.id}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(col.id);
          }}
          onDragLeave={() => setOver((v) => (v === col.id ? null : v))}
          onDrop={() => {
            if (dragging) move(dragging, col.id);
            setDragging(null);
            setOver(null);
          }}
          className={cn(
            "flex w-64 shrink-0 flex-col rounded-xl border bg-surface transition-colors",
            over === col.id ? "border-fg/40" : "border-line"
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-3 py-2">
            <span className="text-sm font-medium text-fg">{col.title}</span>
            <span className="rounded-full bg-raised px-1.5 text-xs text-dim">
              {col.cards.length}
            </span>
          </div>

          <div className="flex min-h-24 flex-col gap-2 p-2">
            {col.cards.map((card) => (
              <article
                key={card.id}
                draggable
                onDragStart={() => setDragging(card.id)}
                onDragEnd={() => {
                  setDragging(null);
                  setOver(null);
                }}
                className={cn(
                  "cursor-grab rounded-lg border border-line bg-ink p-3 transition-opacity active:cursor-grabbing",
                  dragging === card.id && "opacity-40"
                )}
              >
                <div className="text-sm text-fg">{card.title}</div>
                {card.tag ? (
                  <span className="mt-2 inline-block rounded-full border border-line px-2 py-0.5 text-xs text-dim">
                    {card.tag}
                  </span>
                ) : null}
                {card.meta ? (
                  <div className="mt-2 text-xs text-dim">{card.meta}</div>
                ) : null}
              </article>
            ))}
            {col.cards.length === 0 ? (
              <div className="rounded-lg border border-dashed border-line px-3 py-6 text-center text-xs text-dim">
                Drop here
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
