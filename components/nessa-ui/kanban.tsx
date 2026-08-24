"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  tag?: string;
  assignee?: React.ReactNode;
  meta?: React.ReactNode;
  data?: Record<string, unknown>;
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  /** Work-in-progress limit; the header flags the column when exceeded. */
  limit?: number;
  accent?: "neutral" | "success" | "warn" | "danger";
}

export interface KanbanProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  columns: KanbanColumn[];
  /** Controlled board. Omit to let the component own the state. */
  onChange?: (columns: KanbanColumn[]) => void;
  /** Drag column headers to reorder stages. */
  reorderColumns?: boolean;
  onCardClick?: (card: KanbanCard, column: KanbanColumn) => void;
  renderCard?: (card: KanbanCard, column: KanbanColumn) => React.ReactNode;
  classNames?: { root?: string; column?: string; header?: string; card?: string };
}

interface DragState {
  kind: "card" | "column";
  id: string;
  fromColumn: string;
  /** Pointer offset inside the dragged element, so it does not jump on grab. */
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  x: number;
  y: number;
}

const accentClass = {
  neutral: "text-fg",
  success: "text-success",
  warn: "text-warn",
  danger: "text-danger",
};

const THRESHOLD = 4;

/**
 * Board with pointer-driven drag and drop. The dragged card is lifted out and
 * follows the pointer one-to-one (no browser drag image), while a dashed slot
 * opens at the exact insertion index. Columns reorder the same way.
 */
export function Kanban({
  columns,
  onChange,
  reorderColumns = true,
  onCardClick,
  renderCard,
  classNames,
  className,
  ...props
}: KanbanProps) {
  const [internal, setInternal] = React.useState(columns);
  const board = onChange ? columns : internal;

  const [drag, setDrag] = React.useState<DragState | null>(null);
  const [slot, setSlot] = React.useState<{ column: string; index: number } | null>(
    null
  );
  const [columnSlot, setColumnSlot] = React.useState<number | null>(null);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const pending = React.useRef<
    | (DragState & { startX: number; startY: number; moved: boolean })
    | null
  >(null);

  const commit = React.useCallback(
    (next: KanbanColumn[]) => {
      if (onChange) onChange(next);
      else setInternal(next);
    },
    [onChange]
  );

  /** Which column/index is under the pointer right now. */
  const resolveTarget = React.useCallback(
    (clientX: number, clientY: number, state: DragState) => {
      const root = rootRef.current;
      if (!root) return;

      const columnEls = Array.from(
        root.querySelectorAll<HTMLElement>("[data-column]")
      );

      if (state.kind === "column") {
        let index = columnEls.length - 1;
        for (let i = 0; i < columnEls.length; i++) {
          const rect = columnEls[i].getBoundingClientRect();
          if (clientX < rect.left + rect.width / 2) {
            index = i;
            break;
          }
        }
        setColumnSlot(index);
        return;
      }

      const hovered =
        columnEls.find((el) => {
          const rect = el.getBoundingClientRect();
          return clientX >= rect.left && clientX <= rect.right;
        }) ?? columnEls.find((el) => el.dataset.column === state.fromColumn);

      if (!hovered) return;
      const columnId = hovered.dataset.column!;

      const cardEls = Array.from(
        hovered.querySelectorAll<HTMLElement>("[data-card]")
      ).filter((el) => el.dataset.card !== state.id);

      let index = cardEls.length;
      for (let i = 0; i < cardEls.length; i++) {
        const rect = cardEls[i].getBoundingClientRect();
        if (clientY < rect.top + rect.height / 2) {
          index = i;
          break;
        }
      }
      setSlot({ column: columnId, index });
    },
    []
  );

  React.useEffect(() => {
    if (!drag) return;
    const active = drag;

    function onMove(e: PointerEvent) {
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
      resolveTarget(e.clientX, e.clientY, active);

      // auto-scroll the board when dragging near its edges
      const root = rootRef.current;
      if (root) {
        const rect = root.getBoundingClientRect();
        const edge = 64;
        if (e.clientX > rect.right - edge) root.scrollLeft += 12;
        else if (e.clientX < rect.left + edge) root.scrollLeft -= 12;
      }
    }

    function onUp() {
      if (active.kind === "card" && slot) {
        const card = board
          .flatMap((c) => c.cards)
          .find((c) => c.id === active.id);
        if (card) {
          const next = board.map((col) => ({
            ...col,
            cards: col.cards.filter((c) => c.id !== active.id),
          }));
          const target = next.find((col) => col.id === slot.column);
          target?.cards.splice(
            Math.min(slot.index, target.cards.length),
            0,
            card
          );
          commit(next);
        }
      } else if (active.kind === "column" && columnSlot != null) {
        const next = [...board];
        const from = next.findIndex((c) => c.id === active.id);
        if (from >= 0) {
          const [moved] = next.splice(from, 1);
          next.splice(Math.min(columnSlot, next.length), 0, moved);
          commit(next);
        }
      }
      setDrag(null);
      setSlot(null);
      setColumnSlot(null);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [drag, slot, columnSlot, board, commit, resolveTarget]);

  /** Arm a drag; it only starts once the pointer passes the threshold. */
  function arm(
    e: React.PointerEvent,
    kind: DragState["kind"],
    id: string,
    fromColumn: string
  ) {
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    pending.current = {
      kind,
      id,
      fromColumn,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };

    function onMove(ev: PointerEvent) {
      const p = pending.current;
      if (!p || p.moved) return;
      if (
        Math.abs(ev.clientX - p.startX) > THRESHOLD ||
        Math.abs(ev.clientY - p.startY) > THRESHOLD
      ) {
        p.moved = true;
        document.body.style.userSelect = "none";
        document.body.style.cursor = "grabbing";
        const { startX, startY, moved, ...state } = p;
        setDrag({ ...state, x: ev.clientX, y: ev.clientY });
        resolveTarget(ev.clientX, ev.clientY, state);
      }
    }
    function onUp() {
      pending.current = null;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }

  const draggedCard =
    drag?.kind === "card"
      ? board.flatMap((c) => c.cards).find((c) => c.id === drag.id)
      : null;
  const draggedColumn =
    drag?.kind === "column" ? board.find((c) => c.id === drag.id) : null;

  return (
    <>
      <div
        ref={rootRef}
        className={cn(
          "flex gap-3 overflow-x-auto pb-2",
          classNames?.root,
          className
        )}
        {...props}
      >
        {board.map((column, columnIndex) => {
          const overLimit =
            column.limit != null && column.cards.length > column.limit;
          const isDraggedColumn = drag?.kind === "column" && drag.id === column.id;

          return (
            <React.Fragment key={column.id}>
              {drag?.kind === "column" && columnSlot === columnIndex ? (
                <div
                  className="w-64 shrink-0 rounded-xl border-2 border-dashed border-fg/30 bg-fg/5"
                  style={{ height: drag.height }}
                />
              ) : null}

              <section
                data-column={column.id}
                className={cn(
                  "flex w-64 shrink-0 flex-col rounded-xl border border-line bg-surface",
                  isDraggedColumn && "opacity-30",
                  classNames?.column
                )}
              >
                <header
                  onPointerDown={(e) => {
                    if (!reorderColumns || e.button !== 0) return;
                    arm(
                      {
                        ...e,
                        currentTarget: e.currentTarget.parentElement!,
                      } as unknown as React.PointerEvent,
                      "column",
                      column.id,
                      column.id
                    );
                  }}
                  className={cn(
                    "flex items-center justify-between gap-2 border-b border-line px-3 py-2 select-none",
                    reorderColumns && "cursor-grab active:cursor-grabbing",
                    classNames?.header
                  )}
                >
                  <span className="flex items-center gap-2">
                    {reorderColumns ? (
                      <span aria-hidden className="text-dim">
                        ⠿
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        accentClass[column.accent ?? "neutral"]
                      )}
                    >
                      {column.title}
                    </span>
                  </span>
                  <span
                    title={
                      column.limit != null ? `WIP limit ${column.limit}` : undefined
                    }
                    className={cn(
                      "rounded-full px-1.5 text-xs",
                      overLimit ? "bg-warn/15 text-warn" : "bg-raised text-dim"
                    )}
                  >
                    {column.cards.length}
                    {column.limit != null ? `/${column.limit}` : ""}
                  </span>
                </header>

                <div className="flex min-h-28 flex-col gap-2 p-2">
                  {column.cards.map((card, index) => {
                    const lifted = drag?.kind === "card" && drag.id === card.id;
                    return (
                      <React.Fragment key={card.id}>
                        {slot?.column === column.id && slot.index === index ? (
                          <DropSlot height={drag?.height} />
                        ) : null}
                        <article
                          data-card={card.id}
                          onPointerDown={(e) => {
                            if (e.button !== 0) return;
                            arm(e, "card", card.id, column.id);
                          }}
                          onClick={() => {
                            if (!drag) onCardClick?.(card, column);
                          }}
                          className={cn(
                            "cursor-grab select-none rounded-lg border border-line bg-ink p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing",
                            lifted && "invisible",
                            classNames?.card
                          )}
                        >
                          {renderCard ? (
                            renderCard(card, column)
                          ) : (
                            <CardBody card={card} />
                          )}
                        </article>
                      </React.Fragment>
                    );
                  })}

                  {slot?.column === column.id &&
                  slot.index >= column.cards.filter((c) => c.id !== drag?.id).length ? (
                    <DropSlot height={drag?.height} />
                  ) : null}

                  {column.cards.length === 0 && slot?.column !== column.id ? (
                    <div className="rounded-lg border border-dashed border-line px-3 py-6 text-center text-xs text-dim">
                      Drop cards here
                    </div>
                  ) : null}
                </div>
              </section>
            </React.Fragment>
          );
        })}

        {drag?.kind === "column" && columnSlot === board.length ? (
          <div
            className="w-64 shrink-0 rounded-xl border-2 border-dashed border-fg/30 bg-fg/5"
            style={{ height: drag.height }}
          />
        ) : null}
      </div>

      {/* The lifted element, following the pointer one-to-one. */}
      {drag && (draggedCard || draggedColumn) ? (
        <div
          className="pointer-events-none fixed z-50 rotate-2 opacity-95 drop-shadow-2xl"
          style={{
            left: drag.x - drag.offsetX,
            top: drag.y - drag.offsetY,
            width: drag.width,
          }}
        >
          {draggedCard ? (
            <div className="rounded-lg border border-fg/30 bg-ink p-3 shadow-2xl">
              {renderCard ? (
                renderCard(
                  draggedCard,
                  board.find((c) => c.id === drag.fromColumn)!
                )
              ) : (
                <CardBody card={draggedCard} />
              )}
            </div>
          ) : draggedColumn ? (
            <div className="rounded-xl border border-fg/30 bg-surface shadow-2xl">
              <div className="flex items-center justify-between border-b border-line px-3 py-2">
                <span className="text-sm font-medium text-fg">
                  {draggedColumn.title}
                </span>
                <span className="rounded-full bg-raised px-1.5 text-xs text-dim">
                  {draggedColumn.cards.length}
                </span>
              </div>
              <div className="p-2 text-xs text-dim">
                {draggedColumn.cards.length} card
                {draggedColumn.cards.length === 1 ? "" : "s"}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function CardBody({ card }: { card: KanbanCard }) {
  return (
    <>
      <div className="text-sm text-fg">{card.title}</div>
      {card.description ? (
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-dim">
          {card.description}
        </p>
      ) : null}
      {card.tag || card.assignee || card.meta ? (
        <div className="mt-2.5 flex items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            {card.tag ? (
              <span className="rounded-full border border-line px-2 py-0.5 text-xs text-dim">
                {card.tag}
              </span>
            ) : null}
            {card.meta ? (
              <span className="text-xs text-dim">{card.meta}</span>
            ) : null}
          </span>
          {card.assignee}
        </div>
      ) : null}
    </>
  );
}

/** The dashed insertion marker, sized to the card being dragged. */
function DropSlot({ height }: { height?: number }) {
  return (
    <div
      className="rounded-lg border-2 border-dashed border-fg/30 bg-fg/5"
      style={{ height: height ?? 64 }}
    />
  );
}
