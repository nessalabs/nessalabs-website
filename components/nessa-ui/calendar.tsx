"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  addDays,
  addMonths,
  addYears,
  daysInMonth,
  formatDay,
  minutes,
  MONTHS,
  parseISO,
  pad,
  startOfMonth,
  startOfWeek,
  weekdayIndex,
  WEEKDAYS,
  type ISODate,
} from "@/lib/date";

export type CalendarView = "day" | "week" | "month" | "year";

export interface CalendarEvent {
  id?: string;
  /** YYYY-MM-DD */
  date: ISODate;
  title: string;
  /** HH:MM — placed on the time grid in day and week views. */
  start?: string;
  end?: string;
  tone?: "neutral" | "success" | "warn" | "danger";
}

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  /** Anchor date the view is built around (YYYY-MM-DD). */
  date?: ISODate;
  defaultDate?: ISODate;
  onDateChange?: (date: ISODate) => void;
  events?: CalendarEvent[];
  /** Highlighted as today. Passed in so rendering stays pure. */
  today?: ISODate;
  onSelect?: (date: ISODate) => void;
  onEventClick?: (event: CalendarEvent) => void;
  /** Keyboard navigation while the calendar has focus. */
  shortcuts?: boolean;
}

const VIEWS: { value: CalendarView; label: string; key: string }[] = [
  { value: "day", label: "Day", key: "D" },
  { value: "week", label: "Week", key: "W" },
  { value: "month", label: "Month", key: "M" },
  { value: "year", label: "Year", key: "Y" },
];

const toneClass = {
  neutral: "bg-raised text-fg",
  success: "bg-success/15 text-success",
  warn: "bg-warn/15 text-warn",
  danger: "bg-danger/15 text-danger",
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_START = 6 * 60;
const DAY_END = 22 * 60;
const PX_PER_MIN = 44 / 60;

export function Calendar({
  view,
  defaultView = "month",
  onViewChange,
  date,
  defaultDate,
  onDateChange,
  events = [],
  today = "2026-08-23",
  onSelect,
  onEventClick,
  shortcuts = true,
  className,
  ...props
}: CalendarProps) {
  const [viewState, setViewState] = React.useState<CalendarView>(defaultView);
  const [dateState, setDateState] = React.useState<ISODate>(
    defaultDate ?? today
  );
  const [selected, setSelected] = React.useState<ISODate | null>(null);

  const activeView = view ?? viewState;
  const anchor = date ?? dateState;

  function setView(next: CalendarView) {
    if (view === undefined) setViewState(next);
    onViewChange?.(next);
  }

  function setDate(next: ISODate) {
    if (date === undefined) setDateState(next);
    onDateChange?.(next);
  }

  function shift(direction: 1 | -1) {
    if (activeView === "day") setDate(addDays(anchor, direction));
    else if (activeView === "week") setDate(addDays(anchor, 7 * direction));
    else if (activeView === "month") setDate(addMonths(anchor, direction));
    else setDate(addYears(anchor, direction));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!shortcuts) return;
    const key = e.key.toLowerCase();
    if (key === "arrowright" || key === "arrowleft") {
      e.preventDefault();
      shift(key === "arrowright" ? 1 : -1);
    } else if (key === "t") {
      e.preventDefault();
      setDate(today);
    } else if (["d", "w", "m", "y"].includes(key)) {
      e.preventDefault();
      setView(
        key === "d" ? "day" : key === "w" ? "week" : key === "m" ? "month" : "year"
      );
    }
  }

  const byDate = React.useMemo(() => {
    const map = new Map<ISODate, CalendarEvent[]>();
    for (const event of events) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) =>
        (a.start ?? "").localeCompare(b.start ?? "")
      );
    }
    return map;
  }, [events]);

  function select(day: ISODate) {
    setSelected(day);
    onSelect?.(day);
  }

  const anchorDate = parseISO(anchor);
  const title =
    activeView === "day"
      ? formatDay(anchor)
      : activeView === "week"
        ? weekTitle(anchor)
        : activeView === "month"
          ? `${MONTHS[anchorDate.getUTCMonth()]} ${anchorDate.getUTCFullYear()}`
          : String(anchorDate.getUTCFullYear());

  return (
    <div
      tabIndex={shortcuts ? 0 : undefined}
      onKeyDown={onKeyDown}
      className={cn(
        "rounded-xl border border-line bg-surface outline-none focus-visible:ring-2 focus-visible:ring-fg/20",
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDate(today)}
            className="h-7 rounded-md border border-line px-2.5 text-xs text-muted transition-colors hover:bg-raised hover:text-fg"
          >
            Today
          </button>
          <div className="flex items-center gap-1">
            <NavButton label="Previous" onClick={() => shift(-1)}>
              <ChevronIcon dir="left" />
            </NavButton>
            <NavButton label="Next" onClick={() => shift(1)}>
              <ChevronIcon dir="right" />
            </NavButton>
          </div>
          <div className="ml-1 text-sm font-medium text-fg">{title}</div>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-line p-0.5">
          {VIEWS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setView(item.value)}
              title={shortcuts ? `Shortcut: ${item.key}` : undefined}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs transition-colors",
                activeView === item.value
                  ? "bg-fg text-ink"
                  : "text-muted hover:bg-raised hover:text-fg"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {activeView === "month" ? (
        <MonthView
          anchor={anchor}
          today={today}
          selected={selected}
          byDate={byDate}
          onSelect={select}
          onEventClick={onEventClick}
        />
      ) : null}
      {activeView === "week" ? (
        <TimeGrid
          days={Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(anchor), i))}
          today={today}
          byDate={byDate}
          onSelect={select}
          onEventClick={onEventClick}
        />
      ) : null}
      {activeView === "day" ? (
        <TimeGrid
          days={[anchor]}
          today={today}
          byDate={byDate}
          onSelect={select}
          onEventClick={onEventClick}
        />
      ) : null}
      {activeView === "year" ? (
        <YearView
          anchor={anchor}
          today={today}
          byDate={byDate}
          onPickMonth={(month) => {
            setDate(month);
            setView("month");
          }}
        />
      ) : null}

      {shortcuts ? (
        <div className="flex flex-wrap items-center gap-3 border-t border-line px-4 py-2 text-xs text-dim">
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
          <span>move</span>
          <Kbd>T</Kbd>
          <span>today</span>
          <Kbd>D</Kbd>
          <Kbd>W</Kbd>
          <Kbd>M</Kbd>
          <Kbd>Y</Kbd>
          <span>switch view</span>
        </div>
      ) : null}
    </div>
  );
}

function weekTitle(anchor: ISODate) {
  const start = startOfWeek(anchor);
  const end = addDays(start, 6);
  const s = parseISO(start);
  const e = parseISO(end);
  const sameMonth = s.getUTCMonth() === e.getUTCMonth();
  return sameMonth
    ? `${MONTHS[s.getUTCMonth()]} ${s.getUTCDate()}–${e.getUTCDate()}, ${e.getUTCFullYear()}`
    : `${MONTHS[s.getUTCMonth()]} ${s.getUTCDate()} – ${MONTHS[e.getUTCMonth()]} ${e.getUTCDate()}`;
}

function MonthView({
  anchor,
  today,
  selected,
  byDate,
  onSelect,
  onEventClick,
}: {
  anchor: ISODate;
  today: ISODate;
  selected: ISODate | null;
  byDate: Map<ISODate, CalendarEvent[]>;
  onSelect: (date: ISODate) => void;
  onEventClick?: (event: CalendarEvent) => void;
}) {
  const first = startOfMonth(anchor);
  const d = parseISO(first);
  const total = daysInMonth(d.getUTCFullYear(), d.getUTCMonth() + 1);
  const offset = weekdayIndex(first);

  const cells: (ISODate | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, i) => addDays(first, i)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <>
      <div className="grid grid-cols-7 border-b border-line">
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-xs text-dim">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) =>
          day === null ? (
            <div
              key={`empty-${i}`}
              className="min-h-24 border-b border-r border-line bg-ink/20"
            />
          ) : (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(day)}
              className={cn(
                "min-h-24 border-b border-r border-line p-1.5 text-left align-top transition-colors hover:bg-raised",
                selected === day && "bg-raised"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                  day === today ? "bg-fg font-medium text-ink" : "text-muted"
                )}
              >
                {parseISO(day).getUTCDate()}
              </span>
              <span className="mt-1 flex flex-col gap-0.5">
                {(byDate.get(day) ?? []).slice(0, 2).map((event, j) => (
                  <span
                    key={event.id ?? j}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={cn(
                      "truncate rounded px-1 py-0.5 text-[11px]",
                      toneClass[event.tone ?? "neutral"]
                    )}
                  >
                    {event.start ? `${event.start} ` : ""}
                    {event.title}
                  </span>
                ))}
                {(byDate.get(day) ?? []).length > 2 ? (
                  <span className="px-1 text-[11px] text-dim">
                    +{(byDate.get(day) ?? []).length - 2} more
                  </span>
                ) : null}
              </span>
            </button>
          )
        )}
      </div>
    </>
  );
}

function TimeGrid({
  days,
  today,
  byDate,
  onSelect,
  onEventClick,
}: {
  days: ISODate[];
  today: ISODate;
  byDate: Map<ISODate, CalendarEvent[]>;
  onSelect: (date: ISODate) => void;
  onEventClick?: (event: CalendarEvent) => void;
}) {
  const visibleHours = HOURS.filter(
    (h) => h * 60 >= DAY_START && h * 60 <= DAY_END
  );

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[560px]">
        {/* all-day row */}
        <div
          className="grid border-b border-line"
          style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}
        >
          <div className="px-2 py-2 text-right text-xs text-dim">all-day</div>
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => onSelect(day)}
              className="border-l border-line p-1.5 text-left transition-colors hover:bg-raised"
            >
              <div className="mb-1 flex items-center gap-1.5">
                <span className="text-xs text-dim">
                  {WEEKDAYS[weekdayIndex(day)]}
                </span>
                <span
                  className={cn(
                    "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                    day === today ? "bg-fg font-medium text-ink" : "text-fg"
                  )}
                >
                  {parseISO(day).getUTCDate()}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {(byDate.get(day) ?? [])
                  .filter((e) => !e.start)
                  .map((event, j) => (
                    <span
                      key={event.id ?? j}
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-[11px]",
                        toneClass[event.tone ?? "neutral"]
                      )}
                    >
                      {event.title}
                    </span>
                  ))}
              </div>
            </button>
          ))}
        </div>

        {/* hour grid */}
        <div
          className="relative grid"
          style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}
        >
          <div>
            {visibleHours.map((h) => (
              <div
                key={h}
                className="border-b border-line px-2 text-right text-xs text-dim"
                style={{ height: 44 }}
              >
                {pad(h)}:00
              </div>
            ))}
          </div>

          {days.map((day) => (
            <div key={day} className="relative border-l border-line">
              {visibleHours.map((h) => (
                <div
                  key={h}
                  className="border-b border-line"
                  style={{ height: 44 }}
                />
              ))}
              {(byDate.get(day) ?? [])
                .filter((e) => e.start)
                .map((event, j) => {
                  const from = minutes(event.start!);
                  const to = event.end ? minutes(event.end) : from + 60;
                  const top = (from - DAY_START) * PX_PER_MIN;
                  const height = Math.max(20, (to - from) * PX_PER_MIN);
                  return (
                    <button
                      key={event.id ?? j}
                      type="button"
                      onClick={() => onEventClick?.(event)}
                      style={{ top, height }}
                      className={cn(
                        "absolute inset-x-1 overflow-hidden rounded-md border border-line px-1.5 py-1 text-left text-[11px] leading-4",
                        toneClass[event.tone ?? "neutral"]
                      )}
                    >
                      <span className="block truncate font-medium">
                        {event.title}
                      </span>
                      <span className="block truncate opacity-70">
                        {event.start}
                        {event.end ? `–${event.end}` : ""}
                      </span>
                    </button>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function YearView({
  anchor,
  today,
  byDate,
  onPickMonth,
}: {
  anchor: ISODate;
  today: ISODate;
  byDate: Map<ISODate, CalendarEvent[]>;
  onPickMonth: (month: ISODate) => void;
}) {
  const year = parseISO(anchor).getUTCFullYear();

  return (
    <div className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-4">
      {MONTHS.map((name, index) => {
        const first: ISODate = `${year}-${pad(index + 1)}-01`;
        const total = daysInMonth(year, index + 1);
        const offset = weekdayIndex(first);
        const cells: (ISODate | null)[] = [
          ...Array.from({ length: offset }, () => null),
          ...Array.from({ length: total }, (_, i) => addDays(first, i)),
        ];

        return (
          <button
            key={name}
            type="button"
            onClick={() => onPickMonth(first)}
            className="bg-surface p-3 text-left transition-colors hover:bg-raised"
          >
            <div className="mb-2 text-xs font-medium text-fg">{name}</div>
            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((day, i) => {
                if (!day) return <span key={`e-${i}`} />;
                const count = (byDate.get(day) ?? []).length;
                return (
                  <span
                    key={day}
                    className={cn(
                      "relative flex h-4 items-center justify-center text-[10px]",
                      day === today
                        ? "font-medium text-fg"
                        : count
                          ? "text-fg"
                          : "text-dim"
                    )}
                  >
                    {parseISO(day).getUTCDate()}
                    {count ? (
                      <span className="absolute -bottom-0.5 h-0.5 w-0.5 rounded-full bg-fg" />
                    ) : null}
                  </span>
                );
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function NavButton({
  label,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted transition-colors hover:bg-raised hover:text-fg"
      {...props}
    >
      {children}
    </button>
  );
}

export function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-muted">
      {children}
    </kbd>
  );
}
