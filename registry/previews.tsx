"use client";

import * as React from "react";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
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
} from "@/components/nessa-ui";

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

  kanban: (
    <Kanban
      className="w-full"
      columns={[
        {
          id: "backlog",
          title: "Backlog",
          cards: [
            { id: "k1", title: "Retrieval ablation", tag: "research" },
            { id: "k2", title: "Tool-use eval v3", tag: "eval" },
          ],
        },
        {
          id: "running",
          title: "Running",
          cards: [{ id: "k3", title: "Safety sweep", tag: "eval", meta: "started 12m ago" }],
        },
        {
          id: "done",
          title: "Done",
          cards: [{ id: "k4", title: "Checkpoint 4192", tag: "training" }],
        },
      ]}
    />
  ),

  calendar: (
    <Calendar
      className="w-full max-w-2xl"
      month="2026-08"
      today="2026-08-23"
      events={[
        { date: "2026-08-24", title: "Eval sweep" },
        { date: "2026-08-24", title: "Checkpoint" },
        { date: "2026-08-24", title: "Review" },
        { date: "2026-08-27", title: "Paper draft" },
        { date: "2026-08-31", title: "Retro" },
      ]}
    />
  ),

  canvas: (
    <Canvas
      className="w-full"
      nodes={[
        { id: "ingest", x: 32, y: 40, title: "Ingest", subtitle: "corpus" },
        { id: "embed", x: 260, y: 40, title: "Embed", subtitle: "nessa-embed-1" },
        { id: "index", x: 260, y: 168, title: "Index", subtitle: "vector store" },
        { id: "serve", x: 480, y: 104, title: "Serve", subtitle: "retrieval api" },
      ]}
      edges={[
        { from: "ingest", to: "embed" },
        { from: "embed", to: "serve" },
        { from: "index", to: "serve" },
      ]}
    />
  ),
};
