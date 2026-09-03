"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  Bell,
  Columns2,
  Database,
  Filter,
  Rows2,
  SearchX,
  Shuffle,
  Sparkles,
  Webhook,
  X,
} from "lucide-react";
import {
  Badge,
  Button,
  Checkbox,
  EventCalendar,
  EventCalendarGrid,
  EventCalendarToolbar,
  GanttChart,
  GanttChartGrid,
  GanttChartToolbar,
  Input,
  PopoverSurface,
  ganttChartDateColumns,
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanColumnList,
  SplitView,
  SplitViewOrientation,
  SplitViewPanel,
  SplitViewSeparator,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmpty,
  TableFilterSelect,
  TableFooter,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
  TableSearchField,
  TableShell,
  TableSortButton,
  TableToolbar,
  TableViewOptions,
  WindowDeck,
  WindowDeckPane,
  WorkflowCanvas,
  WorkflowCanvasEdge,
  WorkflowCanvasEdges,
  WorkflowCanvasGrid,
  WorkflowCanvasNode,
  WorkflowCanvasNodeHandle,
  WorkflowCanvasSurface,
  applyKanbanMove,
  type EventCalendarEvent,
  type GanttChartQuickCreateContext,
  type GanttChartTask,
  type KanbanMove,
  type TableSortDirection,
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
      // Business hours only, so the grid stays compact.
      minHour={9}
      maxHour={17}
    >
      <EventCalendarToolbar />
      <EventCalendarGrid />
    </EventCalendar>
  );
}

/* ── GanttChart ────────────────────────────────────────────────────────── */

const ganttTasks: GanttChartTask[] = [
  { id: "design", name: "Design", start: day(7, 3), end: day(7, 29) },
  {
    id: "discovery",
    name: "Discovery & audit",
    start: day(7, 3),
    end: day(7, 16),
    progress: 1,
    parentId: "design",
  },
  {
    id: "visual-language",
    name: "Visual language",
    start: day(7, 16),
    end: day(7, 29),
    progress: 0.75,
    parentId: "design",
    dependsOn: ["discovery"],
  },
  {
    id: "design-review",
    name: "Design review",
    start: day(7, 29),
    end: day(7, 29),
    parentId: "design",
    dependsOn: ["visual-language"],
  },
  { id: "engineering", name: "Engineering", start: day(7, 30), end: day(8, 28) },
  {
    id: "primitives",
    name: "Primitives",
    start: day(7, 30),
    end: day(8, 12),
    progress: 0.6,
    parentId: "engineering",
    dependsOn: ["design-review"],
  },
  {
    id: "composites",
    name: "Composites",
    start: day(8, 12),
    end: day(8, 28),
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

/**
 * The card is the host's, and so is every pixel of it: the chart owns the
 * drag, the highlight, the placement and Escape, then hands the proposed
 * range over and waits for `createTask` or `cancel`.
 */
function QuickCreateCard({
  context,
}: {
  context: GanttChartQuickCreateContext;
}) {
  const [name, setName] = React.useState("");
  const format = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <PopoverSurface
      radius="lg"
      role="dialog"
      aria-label="Add task"
      className="flex w-60 flex-col gap-2 p-3"
    >
      <p className="text-xs text-muted-foreground">
        {format.format(context.range.start)} –{" "}
        {format.format(new Date(context.range.end.getTime() - 86_400_000))}
      </p>
      <Input
        autoFocus
        aria-label="Task name"
        placeholder="Task name"
        className="h-7"
        value={name}
        onChange={(changeEvent) => setName(changeEvent.target.value)}
        onKeyDown={(keyEvent) => {
          if (keyEvent.key === "Enter") {
            keyEvent.preventDefault();
            context.createTask(name ? { name } : undefined);
          }
        }}
      />
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="h-7"
          onClick={() => context.createTask(name ? { name } : undefined)}
        >
          Add task
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7"
          onClick={context.cancel}
        >
          Cancel
        </Button>
      </div>
    </PopoverSurface>
  );
}

export function GanttChartPlanningDemo() {
  return (
    <GanttChart
      className="w-full"
      now={NOW}
      defaultTasks={ganttTasks}
      defaultScale="day"
      columns={ganttChartDateColumns("en-US")}
      taskListWidth={420}
      defaultShowCriticalPath
      renderQuickCreate={(context) => <QuickCreateCard context={context} />}
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
      // Panning stays over the stretch of plane the nodes occupy.
      bounds={{ minX: -40, minY: -40, maxX: 840, maxY: 400 }}
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
              className="stroke-[3.5] stroke-muted-foreground/70"
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
    <WorkflowCanvas
      aria-label="Enrichment workflow"
      className="h-96 w-full"
      bounds={{ minX: -20, minY: -20, maxX: 700, maxY: 380 }}
    >
      <WorkflowCanvasGrid />
      <WorkflowCanvasSurface>
        <WorkflowCanvasEdges>
          <WorkflowCanvasEdge
            source="ingest"
            target="enrichment"
            className="stroke-[3.5] stroke-muted-foreground/70"
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
                    className="stroke-[3.5] stroke-muted-foreground/70"
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

const paletteOptions = [
  { id: "filter", title: "Filter", detail: "drop rows", tone: "transform" as const, icon: Filter },
  { id: "embed", title: "Embed", detail: "nessa-embed-1", tone: "model" as const, icon: Sparkles },
  { id: "notify", title: "Notify", detail: "slack", tone: "output" as const, icon: Bell },
];

/**
 * Drag from a node's handle and release over empty canvas: the drop point
 * comes back through onConnectEnd, and the host decides what happens. Here a
 * palette lands at the released end and wires the chosen node into place.
 */
export function WorkflowCanvasPaletteDemo() {
  const [nodes, setNodes] = React.useState<Job[]>([
    { id: "fetch", title: "Fetch corpus", detail: "every 15m", tone: "source", icon: Database, position: { x: 60, y: 120 } },
  ]);
  const [edges, setEdges] = React.useState<BoardEdge[]>([]);
  const [palette, setPalette] = React.useState<{
    source: string;
    point: { x: number; y: number };
  } | null>(null);

  function addNode(option: (typeof paletteOptions)[number]) {
    if (!palette) return;
    const id = `${option.id}-${nodes.length}`;
    setNodes((current) => [
      ...current,
      { ...option, id, position: palette.point },
    ]);
    setEdges((current) => [
      ...current,
      { id: `${palette.source}-${id}`, source: palette.source, target: id },
    ]);
    setPalette(null);
  }

  return (
    <div className="w-full space-y-3">
      <p className="text-sm text-muted-foreground">
        Drag from a handle on the edge of Fetch corpus and let go over empty
        space.
      </p>
      <WorkflowCanvas
        aria-label="Job builder"
        className="h-96 w-full"
        bounds={{ minX: -40, minY: -40, maxX: 760, maxY: 400 }}
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
        onConnectEnd={(end) =>
          setPalette({ source: end.source, point: end.point })
        }
        onDismiss={() => setPalette(null)}
      >
        <WorkflowCanvasGrid />
        <WorkflowCanvasSurface>
          <WorkflowCanvasEdges>
            {edges.map((edge) => (
              <WorkflowCanvasEdge
                key={edge.id}
                source={edge.source}
                target={edge.target}
                className="stroke-[3.5] stroke-muted-foreground/70"
                aria-label={`Edge from ${edge.source} to ${edge.target}`}
              />
            ))}
          </WorkflowCanvasEdges>

          {nodes.map((job) => (
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

          {palette ? (
            <WorkflowCanvasNode
              nodeId="palette"
              defaultPosition={palette.point}
              aria-label="Add a job"
            >
              <div className="w-56 rounded-2xl border border-dashed border-primary/60 bg-popover p-2 shadow-lg">
                <div className="flex items-center justify-between px-1 pb-1">
                  <span className="text-xs font-medium">Add a job</span>
                  <button
                    type="button"
                    aria-label="Dismiss"
                    onClick={() => setPalette(null)}
                    className="rounded px-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
                {paletteOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => addNode(option)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    <option.icon className="size-4 text-muted-foreground" aria-hidden />
                    {option.title}
                  </button>
                ))}
              </div>
            </WorkflowCanvasNode>
          ) : null}
        </WorkflowCanvasSurface>
      </WorkflowCanvas>
    </div>
  );
}

/** Two resizable panels either side of a draggable separator. */
export function SplitViewDemo() {
  return (
    <SplitView className="h-72 w-full overflow-hidden rounded-xl border border-border">
      <SplitViewPanel id="files" defaultSize={32} minSize={18}>
        <div className="h-full overflow-auto p-3">
          <div className="mb-2 text-xs font-medium text-muted-foreground">
            Files
          </div>
          {["ingest.ts", "embed.ts", "index.ts", "serve.ts"].map((file) => (
            <div
              key={file}
              className="rounded-md px-2 py-1 font-mono text-xs text-muted-foreground"
            >
              {file}
            </div>
          ))}
        </div>
      </SplitViewPanel>
      <SplitViewSeparator />
      <SplitViewPanel id="detail" minSize={30}>
        <div className="h-full overflow-auto p-3 text-sm text-muted-foreground">
          Drag the separator, or focus it and use the arrow keys.
        </div>
      </SplitViewPanel>
    </SplitView>
  );
}

/* ── SplitView workspace ───────────────────────────────────────────────── */

type WorkspaceNode =
  | { type: "pane"; id: string; view: string }
  | {
      type: "split";
      id: string;
      orientation: SplitViewOrientation;
      children: [WorkspaceNode, WorkspaceNode];
    };

const workspaceViews: Record<string, { label: string; body: string }> = {
  editor: { label: "encoder.ts", body: "export function encode(chunk: string) {" },
  terminal: { label: "Terminal", body: "$ pnpm test --filter retrieval" },
  preview: { label: "Preview", body: "Recall 92.1% over 4,812 queries" },
  notes: { label: "Notes", body: "Rerank above 0.4 only. Ask Ada." },
};

/** Replaces one pane with a split holding it and a copy of it. */
function splitNode(
  node: WorkspaceNode,
  paneId: string,
  orientation: SplitViewOrientation
): WorkspaceNode {
  if (node.type === "pane") {
    if (node.id !== paneId) return node;
    // Ids derive from the pane being split, so they stay unique without a
    // counter the render has to carry around.
    return {
      type: "split",
      id: `${node.id}-split`,
      orientation,
      children: [
        { type: "pane", id: `${node.id}-1`, view: node.view },
        { type: "pane", id: `${node.id}-2`, view: node.view },
      ],
    };
  }
  return {
    ...node,
    children: [
      splitNode(node.children[0], paneId, orientation),
      splitNode(node.children[1], paneId, orientation),
    ] as [WorkspaceNode, WorkspaceNode],
  };
}

/** Drops a pane and collapses the split that held it, the way editors do. */
function closeNode(node: WorkspaceNode, paneId: string): WorkspaceNode | null {
  if (node.type === "pane") return node.id === paneId ? null : node;
  const first = closeNode(node.children[0], paneId);
  const second = closeNode(node.children[1], paneId);
  if (!first) return second;
  if (!second) return first;
  return { ...node, children: [first, second] as [WorkspaceNode, WorkspaceNode] };
}

/** Swaps two panes' views, which is what a header drag between panes means. */
function swapViews(node: WorkspaceNode, a: string, b: string): WorkspaceNode {
  const find = (current: WorkspaceNode): string | null =>
    current.type === "pane"
      ? current.id === a || current.id === b
        ? current.view
        : null
      : find(current.children[0]) ?? find(current.children[1]);

  const viewOf = (id: string): string => {
    const walk = (current: WorkspaceNode): string | null =>
      current.type === "pane"
        ? current.id === id
          ? current.view
          : null
        : walk(current.children[0]) ?? walk(current.children[1]);
    return walk(node) ?? find(node) ?? "editor";
  };

  const viewA = viewOf(a);
  const viewB = viewOf(b);
  const apply = (current: WorkspaceNode): WorkspaceNode => {
    if (current.type === "pane") {
      if (current.id === a) return { ...current, view: viewB };
      if (current.id === b) return { ...current, view: viewA };
      return current;
    }
    return {
      ...current,
      children: [apply(current.children[0]), apply(current.children[1])] as [
        WorkspaceNode,
        WorkspaceNode,
      ],
    };
  };
  return apply(node);
}

/**
 * Splits nest, so a workspace is a tree of SplitViews. Each pane can split
 * again on either axis, close itself, and hand its view to another pane by
 * dragging its title bar. Only the tree is host state; sizing, keyboard
 * resize and the separators come from the component.
 */
export function SplitViewWorkspaceDemo() {
  const [root, setRoot] = React.useState<WorkspaceNode>(() => ({
    type: "split",
    id: "root",
    orientation: SplitViewOrientation.Horizontal,
    children: [
      { type: "pane", id: "pane-a", view: "editor" },
      {
        type: "split",
        id: "split-b",
        orientation: SplitViewOrientation.Vertical,
        children: [
          { type: "pane", id: "pane-b", view: "preview" },
          { type: "pane", id: "pane-c", view: "terminal" },
        ],
      },
    ],
  }));
  const dragThreshold = 4;
  const [drag, setDrag] = React.useState<{
    from: string;
    over: string | null;
  } | null>(null);
  const press = React.useRef<{
    pointerId: number;
    x: number;
    y: number;
    pane: string;
    started: boolean;
  } | null>(null);
  const ghost = React.useRef<HTMLDivElement | null>(null);

  /** Which pane the pointer is over, read from the DOM rather than tracked. */
  const paneAt = (x: number, y: number) =>
    document
      .elementFromPoint(x, y)
      ?.closest("[data-pane-id]")
      ?.getAttribute("data-pane-id") ?? null;

  /** A faded miniature of the pane, riding the cursor for the whole drag. */
  function liftGhost(pane: HTMLElement, x: number, y: number) {
    const bounds = pane.getBoundingClientRect();
    const node = pane.cloneNode(true) as HTMLElement;
    node.style.width = `${bounds.width}px`;
    node.style.height = `${bounds.height}px`;
    node.style.transform = "scale(0.6)";
    node.style.transformOrigin = "top left";
    const shell = document.createElement("div");
    shell.setAttribute("aria-hidden", "true");
    shell.className =
      "pointer-events-none fixed left-0 top-0 z-50 overflow-hidden rounded-md border border-border bg-background opacity-90 shadow-lg";
    shell.style.width = `${bounds.width * 0.6}px`;
    shell.style.height = `${bounds.height * 0.6}px`;
    shell.appendChild(node);
    document.body.appendChild(shell);
    ghost.current = shell;
    moveGhost(x, y);
  }

  function moveGhost(x: number, y: number) {
    if (ghost.current) {
      ghost.current.style.translate = `${x + 12}px ${y + 12}px`;
    }
  }

  const endDrag = React.useCallback((commitOver: string | null) => {
    const source = press.current;
    press.current = null;
    ghost.current?.remove();
    ghost.current = null;
    setDrag(null);
    if (!source?.started || !commitOver || commitOver === source.pane) return;
    setRoot((current) => swapViews(current, source.pane, commitOver));
  }, []);

  React.useEffect(() => () => ghost.current?.remove(), []);

  const paneCount = (node: WorkspaceNode): number =>
    node.type === "pane"
      ? 1
      : paneCount(node.children[0]) + paneCount(node.children[1]);

  function render(node: WorkspaceNode): React.ReactNode {
    if (node.type === "split") {
      return (
        <SplitView orientation={node.orientation} className="h-full w-full">
          <SplitViewPanel id={`${node.id}-1`} minSize={15}>
            {render(node.children[0])}
          </SplitViewPanel>
          <SplitViewSeparator />
          <SplitViewPanel id={`${node.id}-2`} minSize={15}>
            {render(node.children[1])}
          </SplitViewPanel>
        </SplitView>
      );
    }

    const view = workspaceViews[node.view];
    const isSource = drag?.from === node.id;
    const isTarget = drag !== null && drag.over === node.id && !isSource;
    return (
      <div
        data-pane-id={node.id}
        className={cn(
          "flex h-full min-h-0 flex-col transition-colors",
          isSource && "opacity-40",
          isTarget && "bg-accent/40 ring-2 ring-inset ring-ring",
          drag !== null && "select-none"
        )}
      >
        {/* Pointer-driven rather than HTML5 drag and drop: the whole pane
            lifts as a ghost, the pane under the cursor highlights, and
            Escape cancels, which is how the app shell moves panes. */}
        <div
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            // A drag is not a text selection: without this the title and the
            // pane body highlight as the pointer sweeps across them.
            event.preventDefault();
            const pane = event.currentTarget.closest(
              "[data-pane-id]"
            ) as HTMLElement | null;
            press.current = {
              pointerId: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              pane: node.id,
              started: false,
            };

            // The gesture lives on the window rather than the handle: the
            // pointer spends the whole drag over other panes, and Escape has
            // to reach it wherever focus happens to be.
            const detach = () => {
              window.removeEventListener("pointermove", onMove);
              window.removeEventListener("pointerup", onUp);
              window.removeEventListener("pointercancel", onCancel);
              window.removeEventListener("keydown", onKeyDown);
            };
            const onMove = (moveEvent: PointerEvent) => {
              const current = press.current;
              if (!current) return;
              if (!current.started) {
                const travelled =
                  Math.abs(moveEvent.clientX - current.x) +
                  Math.abs(moveEvent.clientY - current.y);
                if (travelled < dragThreshold) return;
                current.started = true;
                // Any selection made before the threshold was crossed would
                // otherwise keep extending under the ghost.
                document.getSelection()?.removeAllRanges();
                if (pane) liftGhost(pane, moveEvent.clientX, moveEvent.clientY);
                setDrag({ from: node.id, over: null });
              }
              moveGhost(moveEvent.clientX, moveEvent.clientY);
              const over = paneAt(moveEvent.clientX, moveEvent.clientY);
              setDrag((state) => (state ? { ...state, over } : state));
            };
            const onUp = (upEvent: PointerEvent) => {
              detach();
              endDrag(paneAt(upEvent.clientX, upEvent.clientY));
            };
            const onCancel = () => {
              detach();
              endDrag(null);
            };
            const onKeyDown = (keyEvent: KeyboardEvent) => {
              if (keyEvent.key !== "Escape") return;
              detach();
              endDrag(null);
            };

            window.addEventListener("pointermove", onMove);
            window.addEventListener("pointerup", onUp);
            window.addEventListener("pointercancel", onCancel);
            window.addEventListener("keydown", onKeyDown);
          }}
          className="flex h-8 shrink-0 cursor-grab touch-none select-none items-center gap-1 border-b border-border px-2 text-xs active:cursor-grabbing"
        >
          <span className="min-w-0 flex-1 truncate font-medium">
            {view.label}
          </span>
          <button
            type="button"
            aria-label="Split right"
            title="Split right"
            onClick={() =>
              setRoot((current) =>
                splitNode(current, node.id, SplitViewOrientation.Horizontal)
              )
            }
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Columns2 aria-hidden className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label="Split down"
            title="Split down"
            onClick={() =>
              setRoot((current) =>
                splitNode(current, node.id, SplitViewOrientation.Vertical)
              )
            }
            className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Rows2 aria-hidden className="size-3.5" />
          </button>
          {paneCount(root) > 1 ? (
            <button
              type="button"
              aria-label="Close pane"
              title="Close pane"
              onClick={() =>
                setRoot((current) => closeNode(current, node.id) ?? current)
              }
              className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X aria-hidden className="size-3.5" />
            </button>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-3 font-mono text-xs text-muted-foreground">
          {view.body}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "h-96 w-full overflow-hidden rounded-xl border border-border",
        drag !== null && "select-none"
      )}
    >
      {render(root)}
    </div>
  );
}

/* ── Table ─────────────────────────────────────────────────────────────── */

interface TraceRow {
  id: string;
  agent: string;
  kind: string;
  status: "Passed" | "Failed" | "Running";
  seconds: number;
  tokens: number;
}

const traces: TraceRow[] = [
  { id: "TR-4192", agent: "Research Desk", kind: "Retrieval", status: "Passed", seconds: 72, tokens: 18420 },
  { id: "TR-4193", agent: "Inbox Manager", kind: "Tool call", status: "Passed", seconds: 14, tokens: 2140 },
  { id: "TR-4194", agent: "Sales Outbound", kind: "Handoff", status: "Failed", seconds: 8, tokens: 960 },
  { id: "TR-4195", agent: "Talent Scout", kind: "Retrieval", status: "Running", seconds: 41, tokens: 7310 },
  { id: "TR-4196", agent: "Chief", kind: "Reflection", status: "Passed", seconds: 26, tokens: 5180 },
  { id: "TR-4197", agent: "Account Manager", kind: "Tool call", status: "Failed", seconds: 3, tokens: 480 },
  { id: "TR-4198", agent: "Research Desk", kind: "Handoff", status: "Passed", seconds: 55, tokens: 12030 },
  { id: "TR-4199", agent: "Inbox Manager", kind: "Retrieval", status: "Passed", seconds: 19, tokens: 3260 },
  { id: "TR-4200", agent: "Chief", kind: "Tool call", status: "Running", seconds: 11, tokens: 1740 },
];

const tokens = (value: number) => value.toLocaleString("en-GB");

/**
 * The core primitives alone: header, body and footer row groups on the flat
 * shell, with a caption under the rows.
 */
export function TableDemo() {
  const rows = traces.slice(0, 5);
  const total = rows.reduce((sum, row) => sum + row.tokens, 0);

  return (
    <TableShell className="w-2xl max-w-full">
      <Table containerLabel="Recent traces">
        <TableCaption>Token spend across the five most recent traces.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Trace</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Kind</TableHead>
            <TableHead className="text-right">Tokens</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-mono">{row.id}</TableCell>
              <TableCell>{row.agent}</TableCell>
              <TableCell>{row.kind}</TableCell>
              <TableCell className="text-right font-mono">
                {tokens(row.tokens)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right font-mono">{tokens(total)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableShell>
  );
}

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "Passed", label: "Passed" },
  { value: "Failed", label: "Failed" },
  { value: "Running", label: "Running" },
];

const traceColumns = [
  { id: "agent", label: "Agent" },
  { id: "kind", label: "Kind" },
  { id: "status", label: "Status" },
  { id: "tokens", label: "Tokens" },
];

/**
 * The separate pieces wired to one host's state: a search field and a status
 * facet in the toolbar, a column menu, a sortable header, and a selection
 * column. Selection is measured against the rows currently shown, so filtering
 * leaves the header box honest.
 */
export function TableWorkbenchDemo() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [visible, setVisible] = React.useState(["agent", "kind", "status", "tokens"]);
  const [direction, setDirection] = React.useState<TableSortDirection>("descending");
  const [selected, setSelected] = React.useState<string[]>([]);

  const rows = traces
    .filter(
      (row) =>
        (status === "all" || row.status === status) &&
        `${row.id} ${row.agent} ${row.kind}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
    )
    .sort((a, b) =>
      direction === "ascending" ? a.tokens - b.tokens : b.tokens - a.tokens
    );

  const shown = rows.map((row) => row.id);
  const allSelected = shown.length > 0 && shown.every((id) => selected.includes(id));
  const someSelected = shown.some((id) => selected.includes(id)) && !allSelected;

  return (
    <div className="flex w-2xl max-w-full flex-col gap-3">
      <TableToolbar>
        <TableSearchField
          aria-label="Search traces"
          placeholder="Search traces"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <TableFilterSelect
          label="Status"
          options={statusOptions}
          value={status}
          onValueChange={setStatus}
        />
        <TableViewOptions
          className="ml-auto"
          columns={traceColumns}
          value={visible}
          onValueChange={setVisible}
        />
      </TableToolbar>

      <TableShell>
        <Table containerLabel="Traces">
          <TableHeader>
            <TableRow>
              <TableHead className="w-9">
                <Checkbox
                  aria-label="Select every trace shown"
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={() => setSelected(allSelected ? [] : shown)}
                />
              </TableHead>
              <TableHead>Trace</TableHead>
              {visible.includes("agent") ? <TableHead>Agent</TableHead> : null}
              {visible.includes("kind") ? <TableHead>Kind</TableHead> : null}
              {visible.includes("status") ? <TableHead>Status</TableHead> : null}
              {visible.includes("tokens") ? (
                <TableHead className="text-right" aria-sort={direction}>
                  <TableSortButton
                    direction={direction}
                    onClick={() =>
                      setDirection(
                        direction === "ascending" ? "descending" : "ascending"
                      )
                    }
                  >
                    Tokens
                  </TableSortButton>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={selected.includes(row.id) ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${row.id}`}
                    checked={selected.includes(row.id)}
                    onChange={(event) =>
                      setSelected((current) =>
                        event.target.checked
                          ? [...current, row.id]
                          : current.filter((id) => id !== row.id)
                      )
                    }
                  />
                </TableCell>
                <TableCell className="font-mono">{row.id}</TableCell>
                {visible.includes("agent") ? <TableCell>{row.agent}</TableCell> : null}
                {visible.includes("kind") ? <TableCell>{row.kind}</TableCell> : null}
                {visible.includes("status") ? <TableCell>{row.status}</TableCell> : null}
                {visible.includes("tokens") ? (
                  <TableCell className="text-right font-mono">
                    {tokens(row.tokens)}
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
            {rows.length === 0 ? (
              <TableEmpty colSpan={visible.length + 2}>
                <SearchX aria-hidden="true" className="size-5" />
                <span className="text-sm font-medium text-foreground">No traces</span>
                <span className="text-xs">Clear the search or the status filter.</span>
              </TableEmpty>
            ) : null}
          </TableBody>
        </Table>
      </TableShell>
    </div>
  );
}

const PAGE_SIZE = 4;

/**
 * The pager under a long result set. `page` is the host's state, and the bar
 * clamps it into range for every control, so a page left behind by a shrinking
 * result set still marks a real page.
 */
export function TablePaginationDemo() {
  const [page, setPage] = React.useState(1);
  const pageCount = Math.ceil(traces.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const rows = traces.slice(start, start + PAGE_SIZE);

  return (
    <TableShell className="w-2xl max-w-full">
      <Table containerLabel="Traces">
        <TableHeader>
          <TableRow>
            <TableHead>Trace</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Tokens</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-mono">{row.id}</TableCell>
              <TableCell>{row.agent}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell className="text-right font-mono">
                {tokens(row.tokens)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
        summary={`Showing ${start + 1}–${start + rows.length} of ${traces.length} traces`}
      />
    </TableShell>
  );
}

/**
 * The row a table shows instead of data: one cell spanning every column, with
 * an icon, a title and a hint.
 */
export function TableEmptyDemo() {
  return (
    <TableShell className="w-2xl max-w-full">
      <Table containerLabel="Traces">
        <TableHeader>
          <TableRow>
            <TableHead>Trace</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Tokens</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableEmpty colSpan={4}>
            <SearchX aria-hidden="true" className="size-5" />
            <span className="text-sm font-medium text-foreground">No traces yet</span>
            <span className="text-xs">Runs appear here once an agent starts work.</span>
          </TableEmpty>
        </TableBody>
      </Table>
    </TableShell>
  );
}

/* ── WindowDeck ────────────────────────────────────────────────────────── */

const windowDeckPanes = [
  {
    id: "brief",
    label: "Brief",
    subtitle: "Today",
    body: "Three reviews before noon, then the token audit. Hold the afternoon for the registry check.",
  },
  {
    id: "notes",
    label: "Notes",
    subtitle: "Open",
    body: "The separator is a separator, not a tab stop. Keep the handle out of the tab order.",
  },
  {
    id: "studio",
    label: "Studio",
    subtitle: "In progress",
    body: "Widen the gap between chart 3 and chart 4. They read as one colour at this size.",
  },
  {
    id: "review",
    label: "Review",
    subtitle: "Queued",
    body: "Read the motion tokens against the overdamped spring. The discard should accelerate, not coast.",
  },
  {
    id: "log",
    label: "Log",
    subtitle: "This week",
    body: "Opened the overview, restored Calendar, dismissed Notes. The grid packed over the gap.",
  },
];

/**
 * Five generic windows. Scroll or swipe to move; Mod+G opens the overview.
 */
export function WindowDeckDemo() {
  return (
    <div className="h-[32rem] w-full overflow-hidden rounded-2xl border border-border bg-background">
      <WindowDeck defaultActivePane="studio">
        {windowDeckPanes.map((pane) => (
          <WindowDeckPane
            key={pane.id}
            id={pane.id}
            label={pane.label}
            header={
              <span className="flex min-w-0 flex-col">
                <strong className="nessa-text-3 truncate font-medium">
                  {pane.label}
                </strong>
                <small className="nessa-text-2 truncate text-muted-foreground">
                  {pane.subtitle}
                </small>
              </span>
            }
          >
            <p className="m-0 p-4 text-sm leading-6 text-muted-foreground">
              {pane.body}
            </p>
          </WindowDeckPane>
        ))}
      </WindowDeck>
    </div>
  );
}

/** Builds a gradient photograph as a data URI, so the demo needs no assets. */
function windowDeckPhoto(from: string, to: string) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='480' height='320'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/><stop offset='1' stop-color='${to}'/></linearGradient></defs><rect width='480' height='320' fill='url(#g)'/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const windowDeckShots = [
  { id: "accent", label: "Accent ramp", from: "#f59e0b", to: "#ec4899" },
  { id: "chart", label: "Chart ramp", from: "#22d3ee", to: "#0071e3" },
  { id: "success", label: "Success ramp", from: "#34d399", to: "#065f46" },
  { id: "focus", label: "Focus ramp", from: "#a78bfa", to: "#4c1d95" },
  { id: "destructive", label: "Destructive ramp", from: "#fda4af", to: "#7f1d1d" },
];

/**
 * The same deck carrying photographs: one frame at a time, the whole roll in
 * the overview, and a throw upward to discard one.
 */
export function WindowDeckPhotosDemo() {
  const [remaining, setRemaining] = React.useState(windowDeckShots);
  const [last, setLast] = React.useState("nothing yet");

  return (
    <div className="flex h-[32rem] w-full flex-col overflow-hidden rounded-2xl border border-border bg-background">
      <div className="flex items-center gap-3 border-b border-border px-4 py-2">
        <Badge variant="secondary">{remaining.length} studies</Badge>
        <span className="nessa-text-2 text-muted-foreground">{last}</span>
        <Button
          size="sm"
          variant="outline"
          className="ml-auto"
          onClick={() => {
            setRemaining(windowDeckShots);
            setLast("nothing yet");
          }}
        >
          Restore
        </Button>
      </div>
      <div className="min-h-0 flex-1">
        <WindowDeck paneWidth="min(620px, 76cqw)">
          {remaining.map((shot) => (
            <WindowDeckPane
              key={shot.id}
              id={shot.id}
              label={shot.label}
              chrome={false}
              scrollable={false}
              dismissDirections={["up", "down"]}
              onDismiss={(dismissal) => {
                setLast(
                  `${shot.label} — ${dismissal.direction}, by ${dismissal.reason}`
                );
                setRemaining((current) =>
                  current.filter((entry) => entry.id !== shot.id)
                );
              }}
            >
              <img
                src={windowDeckPhoto(shot.from, shot.to)}
                alt={shot.label}
                className="size-full rounded-xl object-cover"
              />
            </WindowDeckPane>
          ))}
        </WindowDeck>
      </div>
    </div>
  );
}
