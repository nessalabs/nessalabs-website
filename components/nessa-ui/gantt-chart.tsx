"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  addDays,
  MONTHS,
  parseISO,
  toISO,
  weekdayIndex,
  WEEKDAYS,
  type ISODate,
} from "@/lib/date";

export type GanttScale = "day" | "week" | "month";
export type GanttTone = "neutral" | "accent" | "success" | "warn" | "danger";

export interface GanttTask {
  id: string;
  name: string;
  /** Inclusive start day, YYYY-MM-DD. */
  start: ISODate;
  /** Inclusive end day. A task whose end equals its start is a milestone. */
  end: ISODate;
  /** 0–1, drawn as a fill inside the bar. */
  progress?: number;
  tone?: GanttTone;
  /** Finish-to-start arrows. Purely visual — nothing is rescheduled for you. */
  dependsOn?: string[];
  /** Nest under another task; that task becomes a summary row. */
  parentId?: string;
}

export interface GanttChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  tasks: GanttTask[];
  onTasksChange?: (tasks: GanttTask[]) => void;
  scale?: GanttScale;
  defaultScale?: GanttScale;
  onScaleChange?: (scale: GanttScale) => void;
  /** Fixed "today" so rendering stays pure. */
  today?: ISODate;
  selectedTaskId?: string | null;
  onSelectTask?: (id: string | null) => void;
  /** Drag bars to reschedule, and edges to resize. */
  editable?: boolean;
  rowHeight?: number;
  taskListWidth?: number;
  /** h/l scroll, t today, d/w/m scale. */
  shortcuts?: boolean;
  renderTask?: (task: GanttTask, span: { start: ISODate; end: ISODate }) => React.ReactNode;
  classNames?: { root?: string; row?: string; bar?: string; list?: string };
}

const COLUMN_WIDTH: Record<GanttScale, number> = { day: 44, week: 22, month: 8 };

const toneClass: Record<GanttTone, string> = {
  neutral: "bg-dim/70",
  accent: "bg-fg",
  success: "bg-success",
  warn: "bg-warn",
  danger: "bg-danger",
};

const SCALES: { value: GanttScale; label: string; key: string }[] = [
  { value: "day", label: "Day", key: "D" },
  { value: "week", label: "Week", key: "W" },
  { value: "month", label: "Month", key: "M" },
];

/**
 * A plan on a timeline. Summaries roll their span and progress up from their
 * children, a task whose start equals its end renders as a milestone diamond,
 * and dependencies draw as finish-to-start arrows. Bars drag to reschedule and
 * their edges drag to resize; nothing reschedules itself behind your back.
 */
export function GanttChart({
  tasks,
  onTasksChange,
  scale,
  defaultScale = "week",
  onScaleChange,
  today = "2026-08-23",
  selectedTaskId,
  onSelectTask,
  editable = true,
  rowHeight = 36,
  taskListWidth = 208,
  shortcuts = true,
  renderTask,
  classNames,
  className,
  ...props
}: GanttChartProps) {
  const [internalTasks, setInternalTasks] = React.useState(tasks);
  const rows = onTasksChange ? tasks : internalTasks;

  const [scaleState, setScaleState] = React.useState<GanttScale>(defaultScale);
  const activeScale = scale ?? scaleState;

  const [selectedState, setSelectedState] = React.useState<string | null>(null);
  const selected = selectedTaskId !== undefined ? selectedTaskId : selectedState;

  const [collapsed, setCollapsed] = React.useState<string[]>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const dayWidth = COLUMN_WIDTH[activeScale];

  const drag = React.useRef<
    | {
        id: string;
        mode: "move" | "start" | "end";
        startX: number;
        from: ISODate;
        to: ISODate;
      }
    | null
  >(null);

  function commit(next: GanttTask[]) {
    if (onTasksChange) onTasksChange(next);
    else setInternalTasks(next);
  }

  function setScale(next: GanttScale) {
    if (scale === undefined) setScaleState(next);
    onScaleChange?.(next);
  }

  function select(id: string | null) {
    if (selectedTaskId === undefined) setSelectedState(id);
    onSelectTask?.(id);
  }

  const children = React.useMemo(() => {
    const map = new Map<string, GanttTask[]>();
    for (const task of rows) {
      if (!task.parentId) continue;
      map.set(task.parentId, [...(map.get(task.parentId) ?? []), task]);
    }
    return map;
  }, [rows]);

  /** Summary spans and progress roll up from descendants. */
  const spanOf = React.useCallback(
    (task: GanttTask): { start: ISODate; end: ISODate; progress: number } => {
      const kids = children.get(task.id);
      if (!kids?.length) {
        return { start: task.start, end: task.end, progress: task.progress ?? 0 };
      }
      const spans = kids.map(spanOf);
      return {
        start: spans.reduce((a, s) => (s.start < a ? s.start : a), spans[0].start),
        end: spans.reduce((a, s) => (s.end > a ? s.end : a), spans[0].end),
        progress: spans.reduce((a, s) => a + s.progress, 0) / spans.length,
      };
    },
    [children]
  );

  // Visible rows: depth-first, skipping the subtree of collapsed summaries.
  const visible = React.useMemo(() => {
    const out: { task: GanttTask; depth: number }[] = [];
    const walk = (task: GanttTask, depth: number) => {
      out.push({ task, depth });
      if (collapsed.includes(task.id)) return;
      for (const kid of children.get(task.id) ?? []) walk(kid, depth + 1);
    };
    for (const task of rows.filter((t) => !t.parentId)) walk(task, 0);
    return out;
  }, [rows, children, collapsed]);

  const range = React.useMemo(() => {
    if (!rows.length) return { start: today, days: 30 };
    const starts = rows.map((t) => t.start).sort();
    const ends = rows.map((t) => t.end).sort();
    const start = addDays(starts[0], -3);
    const end = addDays(ends[ends.length - 1], 4);
    const days =
      Math.round(
        (parseISO(end).getTime() - parseISO(start).getTime()) / 86400000
      ) + 1;
    return { start, days: Math.max(days, 14) };
  }, [rows, today]);

  const offsetOf = React.useCallback(
    (date: ISODate) =>
      Math.round(
        (parseISO(date).getTime() - parseISO(range.start).getTime()) / 86400000
      ),
    [range.start]
  );

  React.useEffect(() => {
    if (!drag.current) return;
    function onMove(e: PointerEvent) {
      const state = drag.current;
      if (!state) return;
      const delta = Math.round((e.clientX - state.startX) / dayWidth);
      if (!delta) return;
      commit(
        rows.map((task) => {
          if (task.id !== state.id) return task;
          if (state.mode === "move")
            return {
              ...task,
              start: addDays(state.from, delta),
              end: addDays(state.to, delta),
            };
          if (state.mode === "start") {
            const next = addDays(state.from, delta);
            return { ...task, start: next > task.end ? task.end : next };
          }
          const next = addDays(state.to, delta);
          return { ...task, end: next < task.start ? task.start : next };
        })
      );
    }
    function onUp() {
      drag.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  });

  function scrollToToday() {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollLeft = Math.max(0, offsetOf(today) * dayWidth - el.clientWidth / 2);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!shortcuts) return;
    const key = e.key.toLowerCase();
    const el = scrollRef.current;
    if (key === "l" || key === "arrowright") {
      e.preventDefault();
      if (el) el.scrollLeft += dayWidth * 4;
    } else if (key === "h" || key === "arrowleft") {
      e.preventDefault();
      if (el) el.scrollLeft -= dayWidth * 4;
    } else if (key === "t") {
      e.preventDefault();
      scrollToToday();
    } else if (["d", "w", "m"].includes(key)) {
      e.preventDefault();
      setScale(key === "d" ? "day" : key === "w" ? "week" : "month");
    }
  }

  const positions = new Map<string, { top: number; left: number; width: number }>();
  visible.forEach(({ task }, i) => {
    const span = spanOf(task);
    positions.set(task.id, {
      top: i * rowHeight + rowHeight / 2,
      left: offsetOf(span.start) * dayWidth,
      width: Math.max(dayWidth, (offsetOf(span.end) - offsetOf(span.start) + 1) * dayWidth),
    });
  });

  return (
    <div
      tabIndex={shortcuts ? 0 : undefined}
      onKeyDown={onKeyDown}
      className={cn(
        "overflow-hidden rounded-xl border border-line bg-surface outline-none focus-visible:ring-2 focus-visible:ring-fg/20",
        classNames?.root,
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
        <button
          type="button"
          onClick={scrollToToday}
          className="h-7 rounded-md border border-line px-2.5 text-xs text-muted transition-colors hover:bg-raised hover:text-fg"
        >
          Today
        </button>
        <div className="flex items-center gap-1 rounded-lg border border-line p-0.5">
          {SCALES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setScale(item.value)}
              title={shortcuts ? `Shortcut: ${item.key}` : undefined}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs transition-colors",
                activeScale === item.value
                  ? "bg-fg text-ink"
                  : "text-muted hover:bg-raised hover:text-fg"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex">
        {/* pinned task list */}
        <div
          style={{ width: taskListWidth }}
          className={cn("shrink-0 border-r border-line", classNames?.list)}
        >
          <div
            className="border-b border-line px-3 text-xs text-dim"
            style={{ lineHeight: `${rowHeight}px`, height: rowHeight }}
          >
            Task
          </div>
          {visible.map(({ task, depth }) => {
            const isSummary = (children.get(task.id) ?? []).length > 0;
            return (
              <div
                key={task.id}
                style={{ height: rowHeight, paddingLeft: 12 + depth * 14 }}
                className={cn(
                  "flex items-center gap-1.5 border-b border-line pr-2 text-sm",
                  selected === task.id ? "bg-raised text-fg" : "text-muted",
                  classNames?.row
                )}
              >
                {isSummary ? (
                  <button
                    type="button"
                    aria-label={
                      collapsed.includes(task.id) ? "Expand" : "Collapse"
                    }
                    onClick={() =>
                      setCollapsed((c) =>
                        c.includes(task.id)
                          ? c.filter((id) => id !== task.id)
                          : [...c, task.id]
                      )
                    }
                    className="text-dim transition-colors hover:text-fg"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn(
                        "transition-transform",
                        collapsed.includes(task.id) ? "" : "rotate-90"
                      )}
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                ) : (
                  <span className="w-3" />
                )}
                <span
                  className={cn("truncate", isSummary && "font-medium text-fg")}
                >
                  {task.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* timeline */}
        <div ref={scrollRef} className="min-w-0 flex-1 overflow-x-auto">
          <div style={{ width: range.days * dayWidth }}>
            <TimelineHeader
              start={range.start}
              days={range.days}
              dayWidth={dayWidth}
              scale={activeScale}
              rowHeight={rowHeight}
              today={today}
            />

            <div
              className="relative"
              style={{ height: visible.length * rowHeight }}
            >
              {/* today marker */}
              {offsetOf(today) >= 0 && offsetOf(today) < range.days ? (
                <div
                  className="pointer-events-none absolute top-0 z-10 w-px bg-danger/60"
                  style={{
                    left: offsetOf(today) * dayWidth + dayWidth / 2,
                    height: visible.length * rowHeight,
                  }}
                />
              ) : null}

              {/* dependency arrows */}
              <svg
                className="pointer-events-none absolute inset-0 overflow-visible"
                width="100%"
                height={visible.length * rowHeight}
              >
                {visible.flatMap(({ task }) =>
                  (task.dependsOn ?? []).map((fromId) => {
                    const from = positions.get(fromId);
                    const to = positions.get(task.id);
                    if (!from || !to) return null;
                    const x1 = from.left + from.width;
                    const x2 = to.left;
                    const mid = x1 + Math.max(12, (x2 - x1) / 2);
                    return (
                      <path
                        key={`${fromId}-${task.id}`}
                        d={`M ${x1} ${from.top} H ${mid} V ${to.top} H ${x2}`}
                        fill="none"
                        stroke="var(--color-dim)"
                        strokeWidth="1"
                        markerEnd=""
                      />
                    );
                  })
                )}
              </svg>

              {visible.map(({ task }, i) => {
                const span = spanOf(task);
                const pos = positions.get(task.id)!;
                const isSummary = (children.get(task.id) ?? []).length > 0;
                const isMilestone = span.start === span.end && !isSummary;

                return (
                  <div
                    key={task.id}
                    className="absolute inset-x-0 border-b border-line"
                    style={{ top: i * rowHeight, height: rowHeight }}
                  >
                    {isMilestone ? (
                      <button
                        type="button"
                        onClick={() => select(task.id)}
                        title={`${task.name} · ${span.start}`}
                        style={{ left: pos.left + dayWidth / 2 - 7, top: rowHeight / 2 - 7 }}
                        className={cn(
                          "absolute h-3.5 w-3.5 rotate-45",
                          toneClass[task.tone ?? "accent"],
                          selected === task.id && "ring-2 ring-fg ring-offset-2 ring-offset-surface"
                        )}
                      />
                    ) : (
                      <div
                        onPointerDown={(e) => {
                          if (!editable || isSummary) return;
                          select(task.id);
                          document.body.style.cursor = "grabbing";
                          document.body.style.userSelect = "none";
                          drag.current = {
                            id: task.id,
                            mode: "move",
                            startX: e.clientX,
                            from: task.start,
                            to: task.end,
                          };
                        }}
                        onClick={() => select(task.id)}
                        title={`${task.name} · ${span.start} → ${span.end}`}
                        style={{
                          left: pos.left,
                          width: pos.width,
                          top: isSummary ? rowHeight / 2 - 4 : rowHeight / 2 - 9,
                          height: isSummary ? 8 : 18,
                        }}
                        className={cn(
                          "absolute overflow-hidden rounded",
                          isSummary
                            ? "rounded-sm bg-dim/50"
                            : cn(
                                "bg-raised",
                                editable && "cursor-grab active:cursor-grabbing"
                              ),
                          selected === task.id && "ring-2 ring-fg",
                          classNames?.bar
                        )}
                      >
                        {renderTask ? (
                          renderTask(task, span)
                        ) : isSummary ? null : (
                          <>
                            <div
                              className={cn(
                                "absolute inset-y-0 left-0",
                                toneClass[task.tone ?? "accent"]
                              )}
                              style={{ width: `${(span.progress ?? 0) * 100}%` }}
                            />
                            {pos.width >= 72 ? (
                              <span className="relative z-10 block truncate px-2 text-[11px] leading-[18px] text-fg">
                                {task.name}
                              </span>
                            ) : null}
                          </>
                        )}

                        {editable && !isSummary ? (
                          <>
                            <span
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                drag.current = {
                                  id: task.id,
                                  mode: "start",
                                  startX: e.clientX,
                                  from: task.start,
                                  to: task.end,
                                };
                              }}
                              className="absolute inset-y-0 left-0 z-20 w-1.5 cursor-ew-resize"
                            />
                            <span
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                drag.current = {
                                  id: task.id,
                                  mode: "end",
                                  startX: e.clientX,
                                  from: task.start,
                                  to: task.end,
                                };
                              }}
                              className="absolute inset-y-0 right-0 z-20 w-1.5 cursor-ew-resize"
                            />
                          </>
                        ) : null}
                      </div>
                    )}

                    {/* narrow bars carry their label beside them, unclipped */}
                    {!isMilestone && !isSummary && pos.width < 72 ? (
                      <span
                        className="pointer-events-none absolute whitespace-nowrap text-[11px] text-muted"
                        style={{
                          left: pos.left + pos.width + 6,
                          lineHeight: `${rowHeight}px`,
                        }}
                      >
                        {task.name}
                      </span>
                    ) : null}
                    {isMilestone ? (
                      <span
                        className="pointer-events-none absolute whitespace-nowrap text-[11px] text-muted"
                        style={{
                          left: pos.left + dayWidth / 2 + 12,
                          lineHeight: `${rowHeight}px`,
                        }}
                      >
                        {task.name}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {shortcuts ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-line px-3 py-2 text-xs text-dim">
          <Kbd>H</Kbd>
          <Kbd>L</Kbd>
          <span>scroll</span>
          <Kbd>T</Kbd>
          <span>today</span>
          <Kbd>D</Kbd>
          <Kbd>W</Kbd>
          <Kbd>M</Kbd>
          <span>scale</span>
          <span className="ml-auto">Drag a bar to reschedule, its edges to resize</span>
        </div>
      ) : null}
    </div>
  );
}

function TimelineHeader({
  start,
  days,
  dayWidth,
  scale,
  rowHeight,
  today,
}: {
  start: ISODate;
  days: number;
  dayWidth: number;
  scale: GanttScale;
  rowHeight: number;
  today: ISODate;
}) {
  const cells: { label: string; span: number; date: ISODate }[] = [];

  if (scale === "day") {
    for (let i = 0; i < days; i++) {
      const date = addDays(start, i);
      cells.push({
        label: `${WEEKDAYS[weekdayIndex(date)][0]} ${parseISO(date).getUTCDate()}`,
        span: 1,
        date,
      });
    }
  } else if (scale === "week") {
    for (let i = 0; i < days; ) {
      const date = addDays(start, i);
      const span = Math.min(7 - weekdayIndex(date), days - i);
      cells.push({
        label: `${MONTHS[parseISO(date).getUTCMonth()].slice(0, 3)} ${parseISO(date).getUTCDate()}`,
        span,
        date,
      });
      i += span;
    }
  } else {
    for (let i = 0; i < days; ) {
      const date = addDays(start, i);
      const d = parseISO(date);
      const daysInThisMonth = new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)
      ).getUTCDate();
      const span = Math.min(daysInThisMonth - d.getUTCDate() + 1, days - i);
      cells.push({
        label: `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`,
        span,
        date,
      });
      i += span;
    }
  }

  return (
    <div
      className="flex border-b border-line"
      style={{ height: rowHeight }}
    >
      {cells.map((cell) => (
        <div
          key={cell.date}
          style={{ width: cell.span * dayWidth, lineHeight: `${rowHeight}px` }}
          className={cn(
            "shrink-0 truncate border-r border-line px-1.5 text-center text-[11px]",
            cell.date <= today && addDays(cell.date, cell.span) > today
              ? "text-fg"
              : "text-dim"
          )}
        >
          {cell.label}
        </div>
      ))}
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-muted">
      {children}
    </kbd>
  );
}
