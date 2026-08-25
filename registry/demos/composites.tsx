"use client";

import * as React from "react";
import { Bell, Database, Filter, Shuffle, Sparkles, Webhook } from "lucide-react";
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
  WorkflowCanvasNodeHandle,
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

const jobTones = {
  source: "bg-sky-500/15 text-sky-600 dark:text-sky-300",
  transform: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
  model: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  output: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
} as const;

interface Job {
  id: string;
  title: string;
  detail: string;
  tone: keyof typeof jobTones;
  icon: React.ComponentType<{ className?: string }>;
  position: { x: number; y: number };
}

const boardJobs: Job[] = [
  { id: "fetch", title: "Fetch corpus", detail: "every 15m", tone: "source", icon: Database, position: { x: 40, y: 60 } },
  { id: "listen", title: "Listen for events", detail: "webhook", tone: "source", icon: Webhook, position: { x: 40, y: 220 } },
  { id: "enrich", title: "Enrich", detail: "nessa-embed-1", tone: "model", icon: Sparkles, position: { x: 320, y: 140 } },
  { id: "notify", title: "Notify", detail: "slack", tone: "output", icon: Bell, position: { x: 600, y: 140 } },
];

/** Node bodies are host markup; the canvas owns drag, zoom and connections. */
function JobCard({ job }: { job: Job }) {
  const Icon = job.icon;
  return (
    <div className="flex w-52 items-start gap-3 rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm">
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${jobTones[job.tone]}`}
      >
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{job.title}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {job.detail}
        </span>
      </span>
    </div>
  );
}

function AllHandles() {
  return (
    <>
      <WorkflowCanvasNodeHandle side="top" />
      <WorkflowCanvasNodeHandle side="right" />
      <WorkflowCanvasNodeHandle side="bottom" />
      <WorkflowCanvasNodeHandle side="left" />
    </>
  );
}

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
            <JobCard job={job} />
            <AllHandles />
          </WorkflowCanvasNode>
        ))}
      </WorkflowCanvasSurface>
    </WorkflowCanvas>
  );
}

/** A node hosting its own canvas. Nesting stops at one level by design. */
export function WorkflowCanvasNestedDemo() {
  const subflow: Job[] = [
    { id: "dedupe", title: "Dedupe", detail: "by hash", tone: "transform", icon: Filter, position: { x: 24, y: 24 } },
    { id: "chunk", title: "Chunk", detail: "512 tokens", tone: "transform", icon: Shuffle, position: { x: 24, y: 132 } },
  ];

  return (
    <WorkflowCanvas aria-label="Enrichment workflow" className="h-96 w-full">
      <WorkflowCanvasGrid />
      <WorkflowCanvasSurface>
        <WorkflowCanvasEdges>
          <WorkflowCanvasEdge
            source="ingest"
            target="enrichment"
            aria-label="Edge from ingest to enrichment"
          />
        </WorkflowCanvasEdges>

        <WorkflowCanvasNode
          nodeId="ingest"
          defaultPosition={{ x: 32, y: 120 }}
          aria-label="Ingest job"
        >
          <JobCard
            job={{
              id: "ingest",
              title: "Ingest",
              detail: "1.2M docs",
              tone: "source",
              icon: Database,
              position: { x: 0, y: 0 },
            }}
          />
          <AllHandles />
        </WorkflowCanvasNode>

        <WorkflowCanvasNode
          nodeId="enrichment"
          defaultPosition={{ x: 320, y: 40 }}
          aria-label="Enrichment subflow"
        >
          <div className="w-80 rounded-2xl border border-border bg-card p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Enrichment</span>
              <span className="text-xs text-muted-foreground">2 steps</span>
            </div>
            <WorkflowCanvas
              aria-label="Enrichment steps"
              readOnly={false}
              className="h-52 rounded-xl border border-border"
            >
              <WorkflowCanvasGrid />
              <WorkflowCanvasSurface>
                <WorkflowCanvasEdges>
                  <WorkflowCanvasEdge
                    source="dedupe"
                    target="chunk"
                    aria-label="Edge from dedupe to chunk"
                  />
                </WorkflowCanvasEdges>
                {subflow.map((job) => (
                  <WorkflowCanvasNode
                    key={job.id}
                    nodeId={job.id}
                    defaultPosition={job.position}
                    aria-label={`${job.title} step`}
                  >
                    <JobCard job={job} />
                    <AllHandles />
                  </WorkflowCanvasNode>
                ))}
              </WorkflowCanvasSurface>
            </WorkflowCanvas>
          </div>
          <AllHandles />
        </WorkflowCanvasNode>
      </WorkflowCanvasSurface>
    </WorkflowCanvas>
  );
}
