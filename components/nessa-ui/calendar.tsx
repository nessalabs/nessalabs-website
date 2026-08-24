"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface CalendarEvent {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  title: string;
}

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Month to show, as YYYY-MM. Defaults to the month of `today`. */
  month?: string;
  events?: CalendarEvent[];
  /** ISO date highlighted as today. Pass it in so rendering stays pure. */
  today?: string;
  onSelect?: (date: string) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function Calendar({
  month,
  events = [],
  today,
  onSelect,
  className,
  ...props
}: CalendarProps) {
  const initial = month ?? today?.slice(0, 7) ?? "2026-08";
  const [cursor, setCursor] = React.useState(initial);
  const [selected, setSelected] = React.useState<string | null>(null);

  const [year, monthIndex] = cursor.split("-").map(Number);
  const first = new Date(Date.UTC(year, monthIndex - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  // Monday-first offset.
  const offset = (first.getUTCDay() + 6) % 7;

  const byDate = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const list = map.get(event.date) ?? [];
      list.push(event);
      map.set(event.date, list);
    }
    return map;
  }, [events]);

  function shift(delta: number) {
    const next = new Date(Date.UTC(year, monthIndex - 1 + delta, 1));
    setCursor(`${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}`);
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      className={cn("rounded-xl border border-line bg-surface", className)}
      {...props}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="text-sm font-medium text-fg">
          {MONTHS[monthIndex - 1]} {year}
        </div>
        <div className="flex items-center gap-1">
          <NavButton label="Previous month" onClick={() => shift(-1)}>
            ←
          </NavButton>
          <NavButton label="Next month" onClick={() => shift(1)}>
            →
          </NavButton>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-line">
        {WEEKDAYS.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-xs text-dim">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null)
            return <div key={`empty-${i}`} className="min-h-20 border-b border-r border-line last:border-r-0" />;

          const date = `${year}-${pad(monthIndex)}-${pad(day)}`;
          const dayEvents = byDate.get(date) ?? [];
          const isToday = date === today;
          const isSelected = date === selected;

          return (
            <button
              key={date}
              type="button"
              onClick={() => {
                setSelected(date);
                onSelect?.(date);
              }}
              className={cn(
                "min-h-20 border-b border-r border-line p-1.5 text-left align-top transition-colors last:border-r-0",
                "hover:bg-raised",
                isSelected && "bg-raised"
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-xs",
                  isToday ? "bg-fg font-medium text-ink" : "text-muted"
                )}
              >
                {day}
              </span>
              <span className="mt-1 flex flex-col gap-0.5">
                {dayEvents.slice(0, 2).map((event) => (
                  <span
                    key={event.title}
                    className="truncate rounded bg-raised px-1 py-0.5 text-[11px] text-fg"
                  >
                    {event.title}
                  </span>
                ))}
                {dayEvents.length > 2 ? (
                  <span className="px-1 text-[11px] text-dim">
                    +{dayEvents.length - 2} more
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
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
      className="h-7 w-7 rounded-md border border-line text-sm text-muted transition-colors hover:bg-raised hover:text-fg"
      {...props}
    >
      {children}
    </button>
  );
}
