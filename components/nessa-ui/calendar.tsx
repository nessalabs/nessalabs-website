"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { useSystemToday } from "@/lib/use-system-today";
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
  /**
   * The date highlighted as today. Defaults to the viewer's current date; pass
   * it to pin the calendar for a test, a story, or a fixed reporting period.
   */
  today?: ISODate;
  onSelect?: (date: ISODate) => void;
  onEventClick?: (event: CalendarEvent) => void;
  /**
   * Drag events to reschedule them: across days in month view, and across
   * days and time slots in week and day views. Fires onEventsChange.
   */
  editable?: boolean;
  onEventsChange?: (events: CalendarEvent[]) => void;
  /** Minutes a dragged event snaps to on the time grid. */
  snapMinutes?: number;
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

/** Used only until the client reports the real date on first render. */
const FALLBACK_DATE = "1970-01-01";

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
  today: todayProp,
  onSelect,
  onEventClick,
  editable = false,
  onEventsChange,
  snapMinutes = 15,
  shortcuts = true,
  className,
  ...props
}: CalendarProps) {
  const systemToday = useSystemToday();
  const today = todayProp ?? systemToday ?? FALLBACK_DATE;

  const [viewState, setViewState] = React.useState<CalendarView>(defaultView);
  const [dateState, setDateState] = React.useState<ISODate | null>(
    defaultDate ?? null
  );
  const [selected, setSelected] = React.useState<ISODate | null>(null);
  const [internalEvents, setInternalEvents] = React.useState(events);
  const items = onEventsChange ? events : internalEvents;

  React.useEffect(() => {
    if (!onEventsChange) setInternalEvents(events);
  }, [events, onEventsChange]);

  const [drag, setDrag] = React.useState<{
    id: string;
    /** Minutes between the event start and the grabbed point. */
    grabOffset: number;
    duration: number;
    timed: boolean;
  } | null>(null);
  const [preview, setPreview] = React.useState<CalendarEvent | null>(null);
  // The pointer handlers read through refs so the listeners never close over
  // a stale event list, and so the drop can commit outside a state updater.
  const previewRef = React.useRef<CalendarEvent | null>(null);
  const itemsRef = React.useRef(items);
  itemsRef.current = items;

  function setPreviewEvent(next: CalendarEvent | null) {
    previewRef.current = next;
    setPreview(next);
  }

  const commitEvents = React.useCallback(
    (next: CalendarEvent[]) => {
      if (onEventsChange) onEventsChange(next);
      else setInternalEvents(next);
    },
    [onEventsChange]
  );

  /** Resolve the day (and minute, on a time grid) under the pointer. */
  function pointTarget(clientX: number, clientY: number) {
    const el = document
      .elementsFromPoint(clientX, clientY)
      .find((node) => (node as HTMLElement).dataset?.day) as
      | HTMLElement
      | undefined;
    if (!el) return null;
    const date = el.dataset.day as ISODate;
    if (el.dataset.timeColumn === undefined) return { date, minutes: null };
    const rect = el.getBoundingClientRect();
    const minutes =
      DAY_START + Math.round((clientY - rect.top) / PX_PER_MIN);
    return { date, minutes };
  }

  React.useEffect(() => {
    if (!drag) return;
    const active = drag;

    function onMove(e: PointerEvent) {
      const target = pointTarget(e.clientX, e.clientY);
      if (!target) return;
      const source =
        previewRef.current ??
        itemsRef.current.find((item) => eventKey(item) === active.id);
      if (!source) return;

      if (target.minutes === null || !active.timed) {
        setPreviewEvent({ ...source, date: target.date });
        return;
      }
      const raw = target.minutes - active.grabOffset;
      const snapped = Math.round(raw / snapMinutes) * snapMinutes;
      const start = clamp(snapped, 0, 24 * 60 - active.duration);
      setPreviewEvent({
        ...source,
        date: target.date,
        start: formatMinutes(start),
        end: formatMinutes(start + active.duration),
      });
    }

    function onUp() {
      const next = previewRef.current;
      if (next) {
        commitEvents(
          itemsRef.current.map((item) =>
            eventKey(item) === active.id ? next : item
          )
        );
      }
      setPreviewEvent(null);
      setDrag(null);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [drag, snapMinutes, commitEvents]);

  function startDrag(
    e: React.PointerEvent,
    event: CalendarEvent,
    grabOffset: number
  ) {
    if (!editable) return;
    e.preventDefault();
    e.stopPropagation();
    const timed = Boolean(event.start);
    const duration =
      timed && event.end
        ? minutes(event.end) - minutes(event.start!)
        : 60;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
    setDrag({ id: eventKey(event), grabOffset, duration, timed });
    setPreviewEvent(event);
  }

  const activeView = view ?? viewState;
  const anchor = date ?? dateState ?? today;

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
    const source = preview
      ? items.map((item) => (eventKey(item) === drag?.id ? preview : item))
      : items;
    for (const event of source) {
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
  }, [items, preview, drag]);

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
        editable && "select-none",
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
          editable={editable}
          draggingId={drag?.id ?? null}
          onEventPointerDown={startDrag}
        />
      ) : null}
      {activeView === "week" ? (
        <TimeGrid
          days={Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(anchor), i))}
          today={today}
          byDate={byDate}
          onSelect={select}
          onEventClick={onEventClick}
          editable={editable}
          draggingId={drag?.id ?? null}
          onEventPointerDown={startDrag}
        />
      ) : null}
      {activeView === "day" ? (
        <TimeGrid
          days={[anchor]}
          today={today}
          byDate={byDate}
          onSelect={select}
          onEventClick={onEventClick}
          editable={editable}
          draggingId={drag?.id ?? null}
          onEventPointerDown={startDrag}
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
          {editable ? (
            <span className="mr-auto order-last">
              Drag an event to reschedule it
            </span>
          ) : null}
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
  editable,
  draggingId,
  onEventPointerDown,
}: {
  anchor: ISODate;
  today: ISODate;
  selected: ISODate | null;
  byDate: Map<ISODate, CalendarEvent[]>;
  onSelect: (date: ISODate) => void;
  onEventClick?: (event: CalendarEvent) => void;
  editable: boolean;
  draggingId: string | null;
  onEventPointerDown: (
    e: React.PointerEvent,
    event: CalendarEvent,
    grabOffset: number
  ) => void;
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
            <div
              key={day}
              data-day={day}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(day)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(day);
              }}
              className={cn(
                "min-h-24 cursor-default border-b border-r border-line p-1.5 text-left align-top transition-colors hover:bg-raised",
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
                    onPointerDown={(e) => onEventPointerDown(e, event, 0)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={cn(
                      "truncate rounded px-1 py-0.5 text-[11px]",
                      toneClass[event.tone ?? "neutral"],
                      editable && "cursor-grab active:cursor-grabbing",
                      draggingId === eventKey(event) && "opacity-60 ring-1 ring-fg"
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
            </div>
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
  editable,
  draggingId,
  onEventPointerDown,
}: {
  days: ISODate[];
  today: ISODate;
  byDate: Map<ISODate, CalendarEvent[]>;
  onSelect: (date: ISODate) => void;
  onEventClick?: (event: CalendarEvent) => void;
  editable: boolean;
  draggingId: string | null;
  onEventPointerDown: (
    e: React.PointerEvent,
    event: CalendarEvent,
    grabOffset: number
  ) => void;
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
            <div
              key={day}
              data-day={day}
              onClick={() => onSelect(day)}
              className="cursor-default border-l border-line p-1.5 text-left transition-colors hover:bg-raised"
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
                      onPointerDown={(e) => onEventPointerDown(e, event, 0)}
                      className={cn(
                        "truncate rounded px-1 py-0.5 text-[11px]",
                        toneClass[event.tone ?? "neutral"],
                        editable && "cursor-grab active:cursor-grabbing",
                        draggingId === eventKey(event) &&
                          "opacity-60 ring-1 ring-fg"
                      )}
                    >
                      {event.title}
                    </span>
                  ))}
              </div>
            </div>
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
            <div
              key={day}
              data-day={day}
              data-time-column=""
              className="relative border-l border-line"
            >
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
                    <div
                      key={event.id ?? j}
                      role="button"
                      tabIndex={0}
                      onPointerDown={(e) => {
                        const rect = (
                          e.currentTarget as HTMLElement
                        ).getBoundingClientRect();
                        onEventPointerDown(
                          e,
                          event,
                          Math.round((e.clientY - rect.top) / PX_PER_MIN)
                        );
                      }}
                      onClick={() => onEventClick?.(event)}
                      style={{ top, height }}
                      className={cn(
                        "absolute inset-x-1 overflow-hidden rounded-md border border-line px-1.5 py-1 text-left text-[11px] leading-4",
                        toneClass[event.tone ?? "neutral"],
                        editable && "cursor-grab active:cursor-grabbing",
                        draggingId === eventKey(event) &&
                          "opacity-80 ring-1 ring-fg"
                      )}
                    >
                      <span className="block truncate font-medium">
                        {event.title}
                      </span>
                      <span className="block truncate opacity-70">
                        {event.start}
                        {event.end ? `–${event.end}` : ""}
                      </span>
                    </div>
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

/** Stable identity for an event, falling back to its content. */
function eventKey(event: CalendarEvent) {
  return event.id ?? `${event.date}-${event.title}-${event.start ?? "all-day"}`;
}

function formatMinutes(total: number) {
  const clamped = clamp(total, 0, 24 * 60 - 1);
  return `${pad(Math.floor(clamped / 60))}:${pad(clamped % 60)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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
