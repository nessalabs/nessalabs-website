"use client";

import * as React from "react";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  Canvas,
  Card,
  Checkbox,
  CodeBlock,
  DataTable,
  Dialog,
  DropdownMenu,
  Input,
  Kanban,
  Pagination,
  Progress,
  PropTable,
  Select,
  Skeleton,
  Switch,
  Table,
  Tabs,
  Textarea,
  ThemeToggle,
  Tooltip,
  AppShell,
  Calendar,
  Chat,
  Composer,
  SplitPane,
  FileDiffList,
  GanttChart,
  JsonTree,
  ModelPicker,
  ToolApproval,
  ToolCall,
  type ChatMessage,
  type GanttTask,
  type ToolApprovalResolution,
  type KanbanColumn,
  type CanvasNode,
} from "@/components/nessa-ui";
import { cn } from "@/lib/cn";

interface Run extends Record<string, unknown> {
  id: string;
  model: string;
  suite: string;
  score: number;
  status: "passed" | "failed" | "queued";
}

const RUNS: Run[] = [
  { id: "4192", model: "nessa-1-large", suite: "reasoning", score: 94.2, status: "passed" },
  { id: "4191", model: "nessa-1-base", suite: "reasoning", score: 88.7, status: "passed" },
  { id: "4190", model: "nessa-1-large", suite: "retrieval", score: 91.4, status: "passed" },
  { id: "4189", model: "nessa-1-mini", suite: "retrieval", score: 72.9, status: "failed" },
  { id: "4188", model: "nessa-1-base", suite: "tools", score: 84.1, status: "passed" },
  { id: "4187", model: "nessa-1-mini", suite: "tools", score: 69.3, status: "failed" },
  { id: "4186", model: "nessa-1-large", suite: "safety", score: 97.8, status: "passed" },
  { id: "4185", model: "nessa-1-base", suite: "safety", score: 95.1, status: "passed" },
  { id: "4184", model: "nessa-1-mini", suite: "reasoning", score: 61.5, status: "queued" },
  { id: "4183", model: "nessa-1-large", suite: "tools", score: 90.0, status: "passed" },
];

function StatusBadge({ status }: { status: Run["status"] }) {
  return (
    <Badge tone={status === "passed" ? "neutral" : status === "failed" ? "warn" : "outline"}>
      {status}
    </Badge>
  );
}

function DialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Delete run 4192"
        description="This removes the run and its artifacts."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">This cannot be undone.</p>
      </Dialog>
    </>
  );
}

function PaginationDemo() {
  const [page, setPage] = React.useState(4);
  return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function DotIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="7" />
    </svg>
  );
}

/* ── demo data ─────────────────────────────────────────────────────────── */

const CALENDAR_EVENTS = [
  { id: "c1", date: "2026-08-24", title: "Eval sweep", start: "09:30", end: "11:00" },
  { id: "c2", date: "2026-08-24", title: "Checkpoint", tone: "success" as const },
  { id: "c3", date: "2026-08-24", title: "Review", start: "15:00", end: "16:00" },
  { id: "c4", date: "2026-08-25", title: "Training run", start: "13:00", end: "16:30", tone: "warn" as const },
  { id: "c5", date: "2026-08-26", title: "Offsite", tone: "success" as const },
  { id: "c6", date: "2026-08-27", title: "Paper draft", start: "10:00", end: "12:00" },
  { id: "c7", date: "2026-08-31", title: "Retro", start: "16:00", end: "17:00", tone: "danger" as const },
  { id: "c8", date: "2026-09-02", title: "Release", tone: "success" as const },
];

const PIPELINE_NODES: CanvasNode[] = [
  { id: "ingest", x: 32, y: 48, title: "Ingest", subtitle: "corpus" },
  { id: "embed", x: 264, y: 48, title: "Embed", subtitle: "nessa-embed-1" },
  { id: "index", x: 264, y: 176, title: "Index", subtitle: "vector store" },
  { id: "serve", x: 496, y: 112, title: "Serve", subtitle: "retrieval api" },
];

const GANTT_TASKS: GanttTask[] = [
  { id: "plan", name: "Retrieval v2", start: "2026-08-20", end: "2026-09-04" },
  { id: "spec", name: "Spec", start: "2026-08-20", end: "2026-08-22", parentId: "plan", progress: 1, tone: "success" },
  { id: "index", name: "Rebuild index", start: "2026-08-24", end: "2026-08-28", parentId: "plan", progress: 0.6, dependsOn: ["spec"] },
  { id: "eval", name: "Eval sweep", start: "2026-08-27", end: "2026-09-01", parentId: "plan", progress: 0.2, tone: "warn", dependsOn: ["index"] },
  { id: "review", name: "Review", start: "2026-09-01", end: "2026-09-03", parentId: "plan", progress: 0 },
  { id: "ship", name: "Ship v2", start: "2026-09-04", end: "2026-09-04", tone: "accent", dependsOn: ["review"] },
];

const DIFF_FILES = [
  { path: "packages/react/src/retrieval/index.ts", additions: 84, deletions: 12, status: "modified" as const },
  { path: "packages/react/src/retrieval/encoder.ts", additions: 31, deletions: 0, status: "added" as const },
  { path: "packages/react/src/retrieval/legacy.ts", additions: 0, deletions: 96, status: "deleted" as const },
  { path: "apps/api/routes/search.ts", additions: 12, deletions: 4, status: "modified" as const },
  { path: "docs/retrieval.md", additions: 27, deletions: 3, status: "modified" as const },
];

const MODEL_GROUPS = [
  {
    label: "Nessa",
    models: [
      { id: "large", name: "nessa-1-large", meta: "200k", description: "Best for reasoning and long context" },
      { id: "base", name: "nessa-1-base", meta: "128k", description: "Balanced cost and quality" },
      { id: "mini", name: "nessa-1-mini", meta: "64k", description: "Fastest, for classification" },
    ],
  },
  {
    label: "Embedding",
    models: [
      { id: "embed", name: "nessa-embed-1", meta: "8k", description: "Retrieval and clustering" },
      { id: "rerank", name: "nessa-rerank-1", meta: "8k", description: "Cross-encoder reranking", disabled: true },
    ],
  },
];

const TOOL_PAYLOAD = {
  suite: "retrieval",
  filters: { status: ["failed", "queued"], since: "2026-08-22" },
  limit: 12,
  options: { includeTraces: true, sample: null },
};

const SKILLS = [
  { id: "eval", name: "Eval suite", description: "Run the scoring harness" },
  { id: "trace", name: "Trace reader", description: "Inspect a run's steps" },
  { id: "sql", name: "Warehouse SQL", description: "Query run metrics" },
];

const MODELS = [
  { value: "large", label: "nessa-1-large" },
  { value: "base", label: "nessa-1-base" },
  { value: "mini", label: "nessa-1-mini" },
];

const TOOL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "Why did the retrieval suite regress last night?",
    attachments: [{ id: "a1", name: "run-4189.json", kind: "code", size: "18 KB" }],
  },
  {
    id: "m2",
    role: "assistant",
    content:
      "Three of the twelve retrieval cases regressed. All of them changed after the index rebuild at 02:14 — the embedding model was pinned to the previous checkpoint, so the vectors no longer match the query encoder.",
    toolCalls: [
      { id: "t1", name: "search_runs", status: "done", detail: "suite=retrieval", output: "12 matches\n4189 failed · 4190 passed · 4186 passed" },
      { id: "t2", name: "trace-reader", kind: "skill", status: "done", detail: "run 4189", output: "step 7: index.rebuild(checkpoint=4188)\nstep 8: encoder=4189  ← mismatch" },
      { id: "t3", name: "eval-suite", kind: "skill", status: "running", detail: "re-running 3 cases" },
    ],
  },
];

export const previews: Record<string, React.ReactNode> = {
  // primitives
  button: <Button>Get started</Button>,
  "button-variants": (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  "button-sizes": (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  "button-disabled": <Button disabled>Unavailable</Button>,

  badge: (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Neutral</Badge>
      <Badge tone="solid">Stable</Badge>
      <Badge tone="warn">Beta</Badge>
      <Badge tone="outline">Outline</Badge>
    </div>
  ),

  avatar: <Avatar name="Ada Lovelace" />,
  "avatar-group": (
    <AvatarGroup>
      <Avatar name="Ada Lovelace" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Alan Turing" />
    </AvatarGroup>
  ),

  tooltip: (
    <Tooltip content="Runs the evaluation suite">
      <Button variant="outline">Evaluate</Button>
    </Tooltip>
  ),

  skeleton: (
    <div className="w-full max-w-sm space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  ),

  "theme-toggle": <ThemeToggle />,

  // forms
  input: (
    <Input className="w-full max-w-sm" placeholder="you@example.com" aria-label="Email" />
  ),
  "input-icon": (
    <Input
      className="w-full max-w-sm"
      icon={<SearchIcon />}
      placeholder="Search runs…"
      aria-label="Search runs"
    />
  ),

  textarea: (
    <Textarea className="max-w-sm" rows={4} placeholder="Describe the run…" aria-label="Description" />
  ),

  select: (
    <Select
      className="w-full max-w-xs"
      aria-label="Model"
      defaultValue="large"
      options={[
        { value: "large", label: "nessa-1-large" },
        { value: "base", label: "nessa-1-base" },
        { value: "mini", label: "nessa-1-mini" },
      ]}
    />
  ),

  checkbox: (
    <div className="space-y-3">
      <Checkbox label="Stream tokens" defaultChecked />
      <Checkbox label="Persist artifacts" />
      <Checkbox label="Unavailable" disabled />
    </div>
  ),

  switch: (
    <div className="space-y-3">
      <Switch label="Auto-retry failures" defaultChecked />
      <Switch label="Notify on completion" />
    </div>
  ),

  // data display
  card: (
    <Card
      className="w-full max-w-sm"
      title="Run 4192"
      description="Completed in 1m 12s"
      footer={
        <div className="flex justify-end">
          <Button size="sm" variant="outline">
            View
          </Button>
        </div>
      }
    >
      <p className="text-sm text-muted">All 128 evaluations passed.</p>
    </Card>
  ),

  table: (
    <Table<Run>
      className="w-full"
      columns={[
        { key: "id", header: "Run", width: "20%" },
        { key: "model", header: "Model" },
        { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "score", header: "Score", align: "right" },
      ]}
      rows={RUNS.slice(0, 4)}
      rowKey={(row) => row.id}
    />
  ),

  "code-block": (
    <CodeBlock
      className="w-full max-w-xl"
      filename="run.ts"
      showLineNumbers
      code={`import { evaluate } from "@nessa/sdk"

// score a suite against the latest checkpoint
export async function run(suite: string) {
  const result = await evaluate({ suite, model: "nessa-1-large" })
  return result.score > 90 ? "passed" : "failed"
}`}
    />
  ),
  "code-block-bash": (
    <CodeBlock
      className="w-full max-w-xl"
      lang="bash"
      code={`npx nessa-ui@latest add data-table`}
    />
  ),

  "prop-table": (
    <PropTable
      className="w-full"
      rows={[
        { name: "value", type: "number", description: "Required." },
        { name: "max", type: "number", default: "100" },
      ]}
    />
  ),

  progress: (
    <div className="w-full max-w-sm space-y-5">
      <Progress value={62} label="Indexing" />
      <Progress value={100} label="Embedding" />
    </div>
  ),

  alert: (
    <Alert className="w-full max-w-md" tone="warn" title="Rate limited">
      Retrying in 30 seconds.
    </Alert>
  ),
  "alert-tones": (
    <div className="w-full max-w-md space-y-3">
      <Alert tone="info" title="Queued">Waiting for a worker.</Alert>
      <Alert tone="success" title="Passed">All 128 evaluations passed.</Alert>
      <Alert tone="warn" title="Rate limited">Retrying in 30 seconds.</Alert>
      <Alert tone="danger" title="Failed">The suite exited with code 1.</Alert>
    </div>
  ),

  // navigation
  tabs: (
    <Tabs
      className="w-full max-w-xl"
      items={[
        { value: "overview", label: "Overview", content: <p className="text-sm text-muted">10 runs in the last hour.</p> },
        { value: "logs", label: "Logs", content: <p className="text-sm text-muted">No warnings.</p> },
        { value: "settings", label: "Settings", content: <Switch label="Auto-retry" defaultChecked /> },
      ]}
    />
  ),

  breadcrumb: (
    <Breadcrumb
      items={[
        { label: "Workspace", href: "#" },
        { label: "Runs", href: "#" },
        { label: "4192" },
      ]}
    />
  ),

  pagination: <PaginationDemo />,

  // overlays
  dialog: <DialogDemo />,

  "dropdown-menu": (
    <DropdownMenu
      trigger={<Button variant="outline">Actions</Button>}
      items={[
        { label: "Duplicate run" },
        { label: "Export artifacts" },
        { label: "Delete", danger: true },
      ]}
    />
  ),

  // composites
  "app-shell": (
    <AppShell
      className="h-96 w-full"
      brand="Nessa"
      title="Runs"
      actions={
        <>
          <ThemeToggle />
          <Button size="sm">New run</Button>
        </>
      }
      footer={
        <div className="flex items-center gap-2">
          <Avatar size="sm" name="Ada Lovelace" />
          <span className="text-xs text-muted">Ada Lovelace</span>
        </div>
      }
      sections={[
        {
          title: "Workspace",
          items: [
            { label: "Runs", icon: <DotIcon />, active: true },
            { label: "Datasets", icon: <DotIcon />, badge: 12 },
            { label: "Models", icon: <DotIcon /> },
          ],
        },
        {
          title: "Lab",
          items: [
            { label: "Experiments", icon: <DotIcon /> },
            { label: "Settings", icon: <DotIcon /> },
          ],
        },
      ]}
    >
      <div className="space-y-4">
        <Alert tone="info" title="3 runs queued">
          Workers scale up automatically.
        </Alert>
        <Table<Run>
          columns={[
            { key: "id", header: "Run" },
            { key: "suite", header: "Suite" },
            { key: "score", header: "Score", align: "right" },
          ]}
          rows={RUNS.slice(0, 3)}
          rowKey={(row) => row.id}
        />
      </div>
    </AppShell>
  ),

  "data-table": (
    <DataTable<Run>
      className="w-full"
      columns={[
        { key: "id", header: "Run", sortable: true },
        { key: "model", header: "Model", sortable: true },
        { key: "suite", header: "Suite", sortable: true },
        { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
        { key: "score", header: "Score", align: "right", sortable: true },
      ]}
      rows={RUNS}
      rowKey={(row) => row.id}
      searchKeys={["model", "suite", "id"]}
      pageSize={5}
      toolbar={
        <DropdownMenu
          align="end"
          trigger={<Button size="sm" variant="outline">Export</Button>}
          items={[{ label: "Download CSV" }, { label: "Copy as JSON" }]}
        />
      }
    />
  ),


  calendar: (
    <Calendar className="w-full" today="2026-08-23" events={CALENDAR_EVENTS} />
  ),
  "calendar-week": (
    <Calendar
      className="w-full"
      defaultView="week"
      today="2026-08-23"
      events={CALENDAR_EVENTS}
    />
  ),
  "calendar-day": (
    <Calendar
      className="w-full"
      defaultView="day"
      defaultDate="2026-08-24"
      today="2026-08-23"
      events={CALENDAR_EVENTS}
    />
  ),
  "calendar-year": (
    <Calendar
      className="w-full"
      defaultView="year"
      today="2026-08-23"
      events={CALENDAR_EVENTS}
    />
  ),
  "calendar-shortcuts": (
    <div className="w-full space-y-3">
      <p className="text-sm text-muted">
        Click the calendar, then press{" "}
        <Kbd>←</Kbd> <Kbd>→</Kbd> to move, <Kbd>T</Kbd> for today, and{" "}
        <Kbd>D</Kbd> <Kbd>W</Kbd> <Kbd>M</Kbd> <Kbd>Y</Kbd> to switch views.
      </p>
      <Calendar className="w-full" today="2026-08-23" events={CALENDAR_EVENTS} />
    </div>
  ),

  kanban: <KanbanDemo />,
  "kanban-workflow": <KanbanWorkflowDemo />,
  "kanban-custom": <KanbanCustomDemo />,

  canvas: (
    <Canvas
      className="w-full"
      snap={8}
      nodes={PIPELINE_NODES}
      edges={[
        { from: "ingest", to: "embed", label: "batch" },
        { from: "embed", to: "serve" },
        { from: "index", to: "serve", dashed: true },
      ]}
    />
  ),
  "canvas-workflow": <WorkflowCanvasDemo />,

  "split-pane": (
    <SplitPane
      className="h-72 w-full overflow-hidden rounded-xl border border-line bg-surface"
      defaultSize={220}
      min={140}
      max={420}
    >
      <div className="h-full p-3">
        <div className="mb-2 text-xs font-medium text-dim">Files</div>
        <div className="space-y-1 text-sm text-muted">
          {["ingest.ts", "embed.ts", "index.ts", "serve.ts"].map((file) => (
            <div key={file} className="rounded-md px-2 py-1 hover:bg-raised">
              {file}
            </div>
          ))}
        </div>
      </div>
      <div className="h-full p-3">
        <div className="mb-2 text-xs font-medium text-dim">
          Drag the divider — or focus it and use the arrow keys
        </div>
        <CodeBlock
          code={`export async function embed(batch: string[]) {\n  return client.embed({ model: "nessa-embed-1", batch })\n}`}
        />
      </div>
    </SplitPane>
  ),
  "split-pane-vertical": (
    <SplitPane
      className="h-72 w-full overflow-hidden rounded-xl border border-line bg-surface"
      direction="vertical"
      defaultSize={130}
      min={80}
      max={220}
    >
      <div className="p-3 text-sm text-muted">Preview pane</div>
      <div className="p-3">
        <div className="mb-2 text-xs font-medium text-dim">Console</div>
        <pre className="text-xs leading-5 text-muted">
          {`› build ok — 412ms\n› 128 evaluations queued\n› worker-3 attached`}
        </pre>
      </div>
    </SplitPane>
  ),

  chat: <ChatDemo />,
  "chat-tools": (
    <Chat
      className="h-[26rem] w-full"
      messages={TOOL_MESSAGES}
      streamSpeed={0}
    />
  ),

  composer: <ComposerDemo />,
  "composer-queue": <ComposerQueueDemo />,
  "composer-skills": (
    <Composer
      className="w-full"
      skills={SKILLS}
      activeSkills={["eval"]}
      attachments={[
        { id: "1", name: "run-4192.json", kind: "code", size: "18 KB" },
        { id: "2", name: "loss-curve.png", kind: "image", size: "240 KB" },
      ]}
      models={MODELS}
      model="large"
      placeholder="Ask about this run…"
    />
  ),

  "app-shell-inspector": <AppShellInspectorDemo />,

  // agent surfaces
  "tool-call": (
    <div className="w-full max-w-xl">
      <ToolCall
        name="search_runs"
        defaultOpen
        summary="suite=retrieval · 12 matches"
        input={<JsonTree value={TOOL_PAYLOAD} className="border-0 bg-transparent p-0" />}
        output={`4189  failed   72.9\n4190  passed   91.4\n4186  passed   97.8`}
        files={["runs/4189.json", "runs/4190.json"]}
      />
    </div>
  ),
  "tool-call-states": (
    <div className="w-full max-w-xl space-y-2">
      <ToolCall name="read_file" status="pending" summary="queued" />
      <ToolCall name="eval-suite" status="running" summary="re-running 3 cases" />
      <ToolCall name="search_runs" status="complete" summary="12 matches" output="4189 · 4190 · 4186" />
      <ToolCall name="write_file" status="error" summary="permission denied" output="EACCES: /etc/hosts" />
    </div>
  ),

  "tool-approval": <ToolApprovalDemo />,

  "json-tree": <JsonTree className="w-full max-w-xl" value={TOOL_PAYLOAD} />,
  "json-tree-collapsible": (
    <JsonTree
      className="w-full max-w-xl"
      value={TOOL_PAYLOAD}
      collapsible
      defaultExpandedDepth={1}
    />
  ),

  "file-diff-list": (
    <FileDiffList className="w-full max-w-xl" files={DIFF_FILES} />
  ),

  "model-picker": (
    <ModelPicker groups={MODEL_GROUPS} defaultValue="large" />
  ),

  // gantt
  "gantt-chart": <GanttDemo />,
  "gantt-scales": (
    <GanttChart
      className="w-full"
      defaultScale="month"
      today="2026-08-23"
      tasks={GANTT_TASKS}
    />
  ),
  "gantt-readonly": (
    <GanttChart
      className="w-full"
      editable={false}
      shortcuts={false}
      today="2026-08-23"
      tasks={GANTT_TASKS}
    />
  ),
};

/* ── demos ─────────────────────────────────────────────────────────────── */

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-[10px] text-muted">
      {children}
    </kbd>
  );
}

function KanbanDemo() {
  const [board, setBoard] = React.useState<KanbanColumn[]>([
    {
      id: "backlog",
      title: "Backlog",
      cards: [
        { id: "k1", title: "Retrieval ablation", tag: "research", description: "Compare dense vs hybrid on the long-tail set." },
        { id: "k2", title: "Tool-use eval v3", tag: "eval" },
      ],
    },
    {
      id: "running",
      title: "Running",
      cards: [{ id: "k3", title: "Safety sweep", tag: "eval", meta: "12m" }],
    },
    { id: "done", title: "Done", cards: [{ id: "k4", title: "Checkpoint 4192", tag: "training" }] },
  ]);

  return (
    <div className="w-full space-y-3">
      <p className="text-sm text-muted">
        Drag a card — a dashed slot marks exactly where it will land.
      </p>
      <Kanban className="w-full" columns={board} onChange={setBoard} />
    </div>
  );
}

function KanbanWorkflowDemo() {
  const [board, setBoard] = React.useState<KanbanColumn[]>([
    {
      id: "triage",
      title: "Triage",
      cards: [
        { id: "w1", title: "Long-context regression", tag: "bug", assignee: <Avatar size="sm" name="Ada Lovelace" /> },
        { id: "w2", title: "Add tool-call traces", tag: "feature" },
      ],
    },
    {
      id: "running",
      title: "Running",
      accent: "warn",
      limit: 2,
      cards: [
        { id: "w3", title: "Sweep 4192", tag: "eval", meta: "12m", assignee: <Avatar size="sm" name="Grace Hopper" /> },
        { id: "w4", title: "Index rebuild", tag: "infra", meta: "4m" },
        { id: "w5", title: "Safety pass", tag: "eval" },
      ],
    },
    {
      id: "review",
      title: "Review",
      accent: "success",
      cards: [{ id: "w6", title: "Checkpoint 4188", tag: "training", assignee: <Avatar size="sm" name="Alan Turing" /> }],
    },
  ]);

  return (
    <div className="w-full space-y-3">
      <p className="text-sm text-muted">
        Drag the <span className="text-fg">⠿</span> header to reorder stages.
        Running is over its WIP limit of 2, so its count is flagged.
      </p>
      <Kanban className="w-full" columns={board} onChange={setBoard} reorderColumns />
    </div>
  );
}

function KanbanCustomDemo() {
  const [board, setBoard] = React.useState<KanbanColumn[]>([
    {
      id: "queued",
      title: "Queued",
      cards: [
        { id: "c1", title: "reasoning-v4", data: { owner: "Ada Lovelace", progress: 0, suite: "reasoning" } },
        { id: "c2", title: "retrieval-hybrid", data: { owner: "Alan Turing", progress: 0, suite: "retrieval" } },
      ],
    },
    {
      id: "active",
      title: "Active",
      cards: [{ id: "c3", title: "safety-sweep", data: { owner: "Grace Hopper", progress: 64, suite: "safety" } }],
    },
  ]);

  return (
    <Kanban
      className="w-full"
      columns={board}
      onChange={setBoard}
      renderCard={(card) => (
        <div className="rounded-lg border border-line bg-ink p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-xs text-fg">{card.title}</span>
            <Avatar size="sm" name={String(card.data?.owner ?? "")} />
          </div>
          <div className="mt-1 text-xs text-dim">suite: {String(card.data?.suite)}</div>
          <Progress className="mt-3" value={Number(card.data?.progress ?? 0)} />
        </div>
      )}
    />
  );
}

function WorkflowCanvasDemo() {
  const [nodes, setNodes] = React.useState<CanvasNode[]>([
    { id: "source", x: 24, y: 40, width: 200, height: 88, title: "Corpus", data: { kind: "source", status: "done", metric: "1.2M docs" } },
    { id: "chunk", x: 268, y: 40, width: 200, height: 88, title: "Chunk", data: { kind: "transform", status: "done", metric: "512 tokens · 64 overlap" } },
    { id: "embed", x: 268, y: 176, width: 200, height: 88, title: "Embed", data: { kind: "model", status: "running", metric: "nessa-embed-1 · 84%" } },
    { id: "serve", x: 512, y: 108, width: 200, height: 88, title: "Serve", data: { kind: "endpoint", status: "idle", metric: "p50 41ms" } },
  ]);

  return (
    <div className="w-full space-y-3">
      <p className="text-sm text-muted">
        Same canvas, different nodes: <code className="text-fg">renderNode</code>{" "}
        owns the look while the component keeps drag, zoom, selection and edge
        routing. Nodes snap to an 8px grid.
      </p>
      <Canvas
        className="w-full"
        snap={8}
        nodes={nodes}
        onNodesChange={setNodes}
        edges={[
          { from: "source", to: "chunk" },
          { from: "chunk", to: "embed", label: "batch 512" },
          { from: "embed", to: "serve", dashed: true },
        ]}
        renderNode={(node, { selected }) => {
          const status = String(node.data?.status);
          return (
            <div
              className={cn(
                "h-full rounded-xl border bg-ink shadow-lg transition-colors",
                selected ? "border-fg" : "border-line"
              )}
            >
              <div className="flex items-center gap-2 border-b border-line px-3 py-2">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    status === "running" && "animate-pulse bg-warn",
                    status === "done" && "bg-success",
                    status === "idle" && "bg-dim"
                  )}
                />
                <span className="flex-1 truncate text-sm font-medium text-fg">
                  {node.title}
                </span>
                <Badge tone="outline">{String(node.data?.kind)}</Badge>
              </div>
              <div className="px-3 py-2 text-xs text-dim">
                {String(node.data?.metric)}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

const CHAT_REPLY =
  "The regression traces back to the index rebuild at 02:14. The encoder checkpoint moved to 4189 while the stored vectors were still written by 4188, so nearest-neighbour lookups drifted on long-tail queries. Re-running the three failing cases against a matched index now.";

function ChatDemo() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: "1", role: "user", content: "Why did retrieval regress last night?" },
    { id: "2", role: "assistant", content: CHAT_REPLY, streaming: true },
  ]);
  const [running, setRunning] = React.useState(true);
  const [queue, setQueue] = React.useState<string[]>([]);

  return (
    <div className="w-full">
      <Chat
        className="h-[30rem] w-full"
        messages={messages}
        footer={
          <Composer
            running={running}
            queue={queue}
            onQueueChange={setQueue}
            skills={SKILLS}
            models={MODELS}
            model="large"
            onStop={() => {
              setRunning(false);
              setMessages((m) =>
                m.map((msg) => ({ ...msg, streaming: false }))
              );
            }}
            onSend={({ text, attachments, skills }) => {
              setMessages((m) => [
                ...m,
                {
                  id: String(m.length + 1),
                  role: "user",
                  content: text,
                  attachments,
                },
                {
                  id: String(m.length + 2),
                  role: "assistant",
                  content:
                    skills.length
                      ? `Running ${skills.join(", ")} against run 4192.`
                      : "Queued against run 4192.",
                  streaming: true,
                },
              ]);
              setRunning(true);
            }}
          />
        }
      />
    </div>
  );
}

function ComposerDemo() {
  const [sent, setSent] = React.useState<string | null>(null);
  return (
    <div className="w-full space-y-3">
      <Composer
        className="w-full"
        skills={SKILLS}
        models={MODELS}
        model="large"
        onSend={({ text, skills }) =>
          setSent(skills.length ? `${text}  ·  skills: ${skills.join(", ")}` : text)
        }
      />
      {sent ? (
        <p className="text-sm text-dim">
          Sent: <span className="text-fg">{sent}</span>
        </p>
      ) : (
        <p className="text-sm text-dim">
          Attach a file, pick a skill, then press ⏎.
        </p>
      )}
    </div>
  );
}

function ComposerQueueDemo() {
  const [queue, setQueue] = React.useState<string[]>([
    "Also compare against checkpoint 4188",
    "Then open a PR with the fix",
  ]);
  const [running, setRunning] = React.useState(true);

  return (
    <div className="w-full space-y-3">
      <p className="text-sm text-muted">
        A turn is running, so new input joins the queue. Click a queued item to
        edit it, reorder with ↑, promote with ⏎, or drop it with ×.
      </p>
      <Composer
        className="w-full"
        running={running}
        queue={queue}
        onQueueChange={setQueue}
        onStop={() => setRunning(false)}
        onSend={() => setRunning(true)}
        skills={SKILLS}
      />
      {running ? null : (
        <p className="text-sm text-dim">
          Stopped — the next send will run immediately.
        </p>
      )}
    </div>
  );
}

function AppShellInspectorDemo() {
  return (
    <AppShell
      className="h-[30rem] w-full"
      brand="Nessa"
      title="Run 4192"
      resizable
      actions={<Button size="sm">New run</Button>}
      inspector={
        <div className="space-y-4">
          <div>
            <div className="text-xs text-dim">Model</div>
            <div className="text-sm text-fg">nessa-1-large</div>
          </div>
          <div>
            <div className="text-xs text-dim">Suite</div>
            <div className="text-sm text-fg">retrieval</div>
          </div>
          <Progress value={64} label="Progress" />
          <Alert tone="success" title="128 passed">
            3 cases pending re-run.
          </Alert>
        </div>
      }
      sections={[
        {
          title: "Workspace",
          items: [
            { label: "Runs", icon: <DotIcon />, active: true },
            { label: "Datasets", icon: <DotIcon />, badge: 12 },
            { label: "Models", icon: <DotIcon /> },
          ],
        },
      ]}
    >
      <SplitPane
        className="h-full overflow-hidden rounded-lg border border-line"
        direction="vertical"
        defaultSize={150}
        min={80}
        max={280}
      >
        <div className="p-3">
          <div className="mb-2 text-xs font-medium text-dim">Trace</div>
          <Table<Run>
            columns={[
              { key: "id", header: "Run" },
              { key: "suite", header: "Suite" },
              { key: "score", header: "Score", align: "right" },
            ]}
            rows={RUNS.slice(0, 3)}
            rowKey={(row) => row.id}
          />
        </div>
        <div className="p-3">
          <div className="mb-2 text-xs font-medium text-dim">Console</div>
          <pre className="text-xs leading-5 text-muted">
            {`› worker-3 attached\n› 128/131 evaluations complete\n› re-running 3 cases`}
          </pre>
        </div>
      </SplitPane>
    </AppShell>
  );
}

function ToolApprovalDemo() {
  const [resolution, setResolution] =
    React.useState<ToolApprovalResolution | null>(null);

  return (
    <div className="w-full max-w-xl space-y-3">
      <ToolApproval
        title="Run a shell command"
        description="The agent wants to run the eval harness against run 4192."
        command="npx nessa eval --suite retrieval --run 4192"
        resolution={resolution}
        onResolve={setResolution}
      />
      {resolution ? (
        <button
          type="button"
          onClick={() => setResolution(null)}
          className="text-sm text-dim underline-offset-4 hover:text-fg hover:underline"
        >
          Reset
        </button>
      ) : null}
    </div>
  );
}

function GanttDemo() {
  const [tasks, setTasks] = React.useState<GanttTask[]>(GANTT_TASKS);

  return (
    <div className="w-full space-y-3">
      <p className="text-sm text-muted">
        Drag a bar to reschedule it, or its edges to resize. Collapse{" "}
        <span className="text-fg">Retrieval v2</span> to roll its children up,
        and note that <span className="text-fg">Ship v2</span> is a milestone.
      </p>
      <GanttChart
        className="w-full"
        today="2026-08-23"
        tasks={tasks}
        onTasksChange={setTasks}
      />
    </div>
  );
}
