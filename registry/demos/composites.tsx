"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import {
  Bell,
  Columns2,
  Database,
  Filter,
  Rows2,
  Shuffle,
  Sparkles,
  Webhook,
  X,
} from "lucide-react";
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
  SplitView,
  SplitViewOrientation,
  SplitViewPanel,
  SplitViewSeparator,
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

let workspaceIds = 0;
const nextWorkspaceId = () => `node-${(workspaceIds += 1)}`;

/** Replaces one pane with a split holding it and a copy of it. */
function splitNode(
  node: WorkspaceNode,
  paneId: string,
  orientation: SplitViewOrientation
): WorkspaceNode {
  if (node.type === "pane") {
    if (node.id !== paneId) return node;
    return {
      type: "split",
      id: nextWorkspaceId(),
      orientation,
      children: [
        { type: "pane", id: nextWorkspaceId(), view: node.view },
        { type: "pane", id: nextWorkspaceId(), view: node.view },
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
  const [dragging, setDragging] = React.useState<string | null>(null);
  // The drop handler runs in the same gesture that started the drag, so it
  // reads the ref rather than state that may not have committed yet.
  const draggingRef = React.useRef<string | null>(null);

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
    return (
      <div
        className="flex h-full min-h-0 flex-col"
        onDragOver={(event) => {
          const source = draggingRef.current;
          if (source && source !== node.id) event.preventDefault();
        }}
        onDrop={() => {
          const source = draggingRef.current;
          if (!source || source === node.id) return;
          setRoot((current) => swapViews(current, source, node.id));
          draggingRef.current = null;
          setDragging(null);
        }}
      >
        <div
          draggable
          onDragStart={(event) => {
            draggingRef.current = node.id;
            event.dataTransfer.setData("text/plain", node.id);
            event.dataTransfer.effectAllowed = "move";
            setDragging(node.id);
          }}
          onDragEnd={() => {
            draggingRef.current = null;
            setDragging(null);
          }}
          className={cn(
            "flex h-8 shrink-0 cursor-grab items-center gap-1 border-b border-border px-2 text-xs",
            dragging === node.id && "opacity-50"
          )}
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
    <div className="h-96 w-full overflow-hidden rounded-xl border border-border">
      {render(root)}
    </div>
  );
}
