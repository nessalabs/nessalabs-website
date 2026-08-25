"use client";

import * as React from "react";
import {
  EventCalendar,
  EventCalendarGrid,
  EventCalendarToolbar,
  GanttChart,
  GanttChartGrid,
  GanttChartToolbar,
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanColumnList,
  WorkflowCanvas,
  WorkflowCanvasEdge,
  WorkflowCanvasEdges,
  WorkflowCanvasGrid,
  WorkflowCanvasNode,
  WorkflowCanvasSurface,
  applyKanbanMove,
  type EventCalendarEvent,
  type GanttChartTask,
  type KanbanMove,
} from "@nessa-ui/react";

/** A fixed "now" so the previews read the same on every visit. */
const NOW = new Date(2026, 7, 18, 9, 40);
const day = (month: number, date: number, hour = 0, minute = 0) =>
  new Date(2026, month, date, hour, minute);

/* ── EventCalendar ─────────────────────────────────────────────────────── */

const calendarEvents: EventCalendarEvent[] = [
  {
    id: "standup",
    title: "Team standup",
    start: day(7, 17, 9, 30),
    end: day(7, 17, 9, 45),
  },
  {
    id: "crit",
    title: "Design crit",
    start: day(7, 18, 13, 0),
    end: day(7, 18, 14, 30),
    location: "Studio",
  },
  {
    id: "pairing",
    title: "Pairing: composer chips",
    start: day(7, 18, 14, 0),
    end: day(7, 18, 15, 0),
    tone: "secondary",
  },
  {
    id: "offsite",
    title: "Team offsite",
    start: day(7, 19),
    end: day(7, 20),
    tone: "muted",
  },
  {
    id: "freeze",
    title: "Code freeze",
    start: day(7, 21, 17, 0),
    end: day(7, 21, 18, 0),
    tone: "destructive",
  },
];

export function EventCalendarDemo({
  defaultView,
}: {
  defaultView?: "day" | "week" | "month";
}) {
  return (
    <EventCalendar
      className="w-full"
      defaultEvents={calendarEvents}
      defaultDate={NOW}
      defaultView={defaultView}
      now={NOW}
      locale="en-US"
    >
      <EventCalendarToolbar />
      <EventCalendarGrid />
    </EventCalendar>
  );
}

/* ── GanttChart ────────────────────────────────────────────────────────── */

const ganttTasks: GanttChartTask[] = [
  { id: "design", name: "Design", start: day(7, 3), end: day(7, 22) },
  {
    id: "discovery",
    name: "Discovery & audit",
    start: day(7, 3),
    end: day(7, 15),
    progress: 1,
    parentId: "design",
  },
  {
    id: "visual-language",
    name: "Visual language",
    start: day(7, 10),
    end: day(7, 22),
    progress: 0.75,
    parentId: "design",
    dependsOn: ["discovery"],
  },
  {
    id: "design-review",
    name: "Design review",
    start: day(7, 21),
    end: day(7, 21),
    parentId: "design",
    dependsOn: ["visual-language"],
  },
  { id: "engineering", name: "Engineering", start: day(7, 17), end: day(9, 3) },
  {
    id: "primitives",
    name: "Primitives",
    start: day(7, 17),
    end: day(7, 29),
    progress: 0.6,
    parentId: "engineering",
    dependsOn: ["design-review"],
  },
  {
    id: "composites",
    name: "Composites",
    start: day(7, 31),
    end: day(8, 19),
    progress: 0.15,
    parentId: "engineering",
    dependsOn: ["primitives"],
  },
  {
    id: "code-freeze",
    name: "Code freeze",
    start: day(8, 28),
    end: day(8, 28),
    tone: "destructive",
    parentId: "engineering",
    dependsOn: ["composites"],
  },
];

export function GanttChartDemo({ scale }: { scale?: "day" | "week" | "month" }) {
  return (
    <GanttChart
      className="w-full"
      now={NOW}
      defaultTasks={ganttTasks}
      defaultScale={scale}
    >
      <GanttChartToolbar />
      <GanttChartGrid />
    </GanttChart>
  );
}

/* ── KanbanBoard ───────────────────────────────────────────────────────── */

const sprintColumns = [
  { id: "todo", title: "Todo" },
  { id: "doing", title: "In progress" },
  { id: "review", title: "In review" },
];

const sprintCards: Record<string, { title: string; meta: string }> = {
  "eval-harness": { title: "Eval harness v3", meta: "research" },
  "index-rebuild": { title: "Rebuild retrieval index", meta: "infra" },
  "composer-chips": { title: "Composer inline chips", meta: "ui" },
  "safety-sweep": { title: "Safety sweep", meta: "eval" },
  "docs-sprint": { title: "Docs sprint", meta: "docs" },
};

const initialSprint: Record<string, readonly string[]> = {
  todo: ["eval-harness", "docs-sprint"],
  doing: ["index-rebuild", "composer-chips"],
  review: ["safety-sweep"],
};

export function KanbanDemo() {
  const [columns, setColumns] = React.useState(initialSprint);
  const [order, setOrder] = React.useState(sprintColumns.map((c) => c.id));

  return (
    <KanbanBoard
      className="flex gap-3 overflow-x-auto pb-2"
      onCardMove={(move: KanbanMove) =>
        setColumns((current) => applyKanbanMove(current, move))
      }
      onColumnMove={(move) =>
        setOrder((current) => {
          const next = current.filter((id) => id !== move.columnId);
          next.splice(move.index, 0, move.columnId);
          return next;
        })
      }
    >
      {order.map((columnId) => {
          const column = sprintColumns.find((entry) => entry.id === columnId)!;
          const cards = columns[column.id] ?? [];

        return (
          <KanbanColumn
            key={column.id}
              columnId={column.id}
              aria-label={column.title}
              className="w-64 shrink-0 rounded-2xl border border-border bg-background p-3"
            >
              <span className="mb-3 flex items-center justify-between gap-2 px-1">
                <span className="flex items-center gap-1.5">
                  <KanbanColumnHandle
                    aria-label={`Move ${column.title} column`}
                    className="size-5"
                  />
                  <span className="text-sm font-medium">{column.title}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {cards.length}
                </span>
              </span>

            <KanbanColumnList aria-label={`${column.title} cards`}>
              {cards.map((cardId) => (
                <KanbanCard
                  key={cardId}
                  cardId={cardId}
                  aria-label={sprintCards[cardId].title}
                  className="mb-2 rounded-xl border border-border bg-card p-3 last:mb-0"
                >
                  <span className="block text-sm">
                    {sprintCards[cardId].title}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {sprintCards[cardId].meta}
                  </span>
                </KanbanCard>
              ))}
            </KanbanColumnList>
          </KanbanColumn>
        );
      })}
    </KanbanBoard>
  );
}

/* ── WorkflowCanvas ────────────────────────────────────────────────────── */

const boardJobs = [
  { id: "fetch", title: "Fetch corpus", detail: "every 15m", position: { x: 40, y: 60 } },
  { id: "listen", title: "Listen for events", detail: "webhook", position: { x: 40, y: 220 } },
  { id: "enrich", title: "Enrich", detail: "nessa-embed-1", position: { x: 300, y: 140 } },
  { id: "notify", title: "Notify", detail: "slack", position: { x: 560, y: 140 } },
];

interface BoardEdge {
  id: string;
  source: string;
  target: string;
}

export function WorkflowCanvasDemo() {
  const [edges, setEdges] = React.useState<BoardEdge[]>([
    { id: "fetch-enrich", source: "fetch", target: "enrich" },
    { id: "listen-enrich", source: "listen", target: "enrich" },
    { id: "enrich-notify", source: "enrich", target: "notify" },
  ]);
  const [selectedEdgeId, setSelectedEdgeId] = React.useState<string | null>(null);

  return (
    <WorkflowCanvas
      aria-label="Automation workflow"
      className="h-96 w-full"
      onConnect={(connection) =>
        setEdges((current) => [
          ...current,
          {
            id: `${connection.source}-${connection.target}-${current.length}`,
            source: connection.source,
            target: connection.target,
          },
        ])
      }
    >
      <WorkflowCanvasGrid />
      <WorkflowCanvasSurface>
        <WorkflowCanvasEdges>
          {edges.map((edge) => (
            <WorkflowCanvasEdge
              key={edge.id}
              source={edge.source}
              target={edge.target}
              selected={selectedEdgeId === edge.id}
              aria-label={`Edge from ${edge.source} to ${edge.target}`}
              onClick={() =>
                setSelectedEdgeId((current) =>
                  current === edge.id ? null : edge.id
                )
              }
              onDelete={() =>
                setEdges((current) =>
                  current.filter((candidate) => candidate.id !== edge.id)
                )
              }
            />
          ))}
        </WorkflowCanvasEdges>

        {boardJobs.map((job) => (
          <WorkflowCanvasNode
            key={job.id}
            nodeId={job.id}
            defaultPosition={job.position}
            aria-label={`${job.title} job`}
          >
            <span className="block w-44 rounded-xl border border-border bg-card p-3 shadow-sm">
              <span className="block text-sm font-medium">{job.title}</span>
              <span className="block text-xs text-muted-foreground">
                {job.detail}
              </span>
            </span>
          </WorkflowCanvasNode>
        ))}
      </WorkflowCanvasSurface>
    </WorkflowCanvas>
  );
}
