import type { PropRow } from "@/components/nessa-ui/prop-table";

export const groups = [
  "Primitives",
  "Forms",
  "Data display",
  "Navigation",
  "Overlays",
  "Agent surfaces",
  "Composites",
] as const;

export type Group = (typeof groups)[number];

export interface ComponentDoc {
  slug: string;
  name: string;
  description: string;
  status: "stable" | "beta";
  group: Group;
  usage: string;
  props: PropRow[];
  /**
   * Worked examples. `id` maps to a preview in registry/previews, and the code
   * shown is extracted from that preview — `code` is only a fallback for an id
   * with no preview.
   */
  examples?: { id: string; title: string; code?: string }[];
}

export const registry: ComponentDoc[] = [
  // ── Primitives ────────────────────────────────────────────────────────────
  {
    slug: "button",
    name: "Button",
    description:
      "The default action. Four variants, three sizes, and a visible focus ring.",
    status: "stable",
    group: "Primitives",
    usage: `import { Button } from "@/components/nessa-ui"

<Button>Get started</Button>`,
    props: [
      {
        name: "variant",
        type: '"primary" | "secondary" | "outline" | "ghost"',
        default: '"primary"',
      },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
    ],
    examples: [
      {
        id: "button-variants",
        title: "Variants",
        code: `<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>`,
      },
      {
        id: "button-sizes",
        title: "Sizes",
        code: `<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`,
      },
      {
        id: "button-disabled",
        title: "Disabled",
        code: `<Button disabled>Unavailable</Button>`,
      },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    description: "A compact status marker in four tones.",
    status: "stable",
    group: "Primitives",
    usage: `import { Badge } from "@/components/nessa-ui"

<Badge tone="solid">Stable</Badge>`,
    props: [
      {
        name: "tone",
        type: '"neutral" | "solid" | "warn" | "outline"',
        default: '"neutral"',
      },
    ],
  },
  {
    slug: "avatar",
    name: "Avatar",
    description:
      "A user image that falls back to initials, with a group variant for stacked members.",
    status: "stable",
    group: "Primitives",
    usage: `import { Avatar, AvatarGroup } from "@/components/nessa-ui"

<Avatar name="Ada Lovelace" />`,
    props: [
      { name: "name", type: "string", description: "Required. Drives initials and the title." },
      { name: "src", type: "string", description: "Image URL; initials show if omitted." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
    ],
    examples: [
      {
        id: "avatar-group",
        title: "Group",
        code: `<AvatarGroup>
  <Avatar name="Ada Lovelace" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Alan Turing" />
</AvatarGroup>`,
      },
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description:
      "Hover and focus hint. Positioned in CSS, so it needs no measuring pass.",
    status: "stable",
    group: "Primitives",
    usage: `import { Tooltip } from "@/components/nessa-ui"

<Tooltip content="Runs the evaluation suite">
  <Button variant="outline">Evaluate</Button>
</Tooltip>`,
    props: [
      { name: "content", type: "ReactNode", description: "Required." },
      { name: "side", type: '"top" | "bottom"', default: '"top"' },
    ],
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    description: "A pulsing placeholder for content that has not loaded yet.",
    status: "stable",
    group: "Primitives",
    usage: `import { Skeleton } from "@/components/nessa-ui"

<Skeleton className="h-4 w-40" />`,
    props: [
      {
        name: "className",
        type: "string",
        description: "Size it with utilities; it has no intrinsic dimensions.",
      },
    ],
  },
  {
    slug: "theme-toggle",
    name: "ThemeToggle",
    description:
      "Switches between light and dark and remembers the choice. Ships with a boot script that applies the stored theme before first paint.",
    status: "stable",
    group: "Primitives",
    usage: `import { ThemeToggle, themeScript } from "@/components/nessa-ui"

// in <head>, so there is no flash of the wrong palette
<script dangerouslySetInnerHTML={{ __html: themeScript }} />

// anywhere in the UI
<ThemeToggle />`,
    props: [
      {
        name: "…",
        type: "ButtonHTMLAttributes",
        description: "Takes any button prop; the icon and behaviour are built in.",
      },
    ],
  },

  // ── Forms ─────────────────────────────────────────────────────────────────
  {
    slug: "input",
    name: "Input",
    description: "A single-line text field with an optional leading icon slot.",
    status: "stable",
    group: "Forms",
    usage: `import { Input } from "@/components/nessa-ui"

<Input placeholder="you@example.com" />`,
    props: [
      {
        name: "icon",
        type: "ReactNode",
        description: "Rendered inside the field, before the text.",
      },
    ],
    examples: [
      {
        id: "input-icon",
        title: "With icon",
        code: `<Input icon={<SearchIcon />} placeholder="Search runs…" />`,
      },
    ],
  },
  {
    slug: "textarea",
    name: "Textarea",
    description: "A multi-line field that matches Input's chrome.",
    status: "stable",
    group: "Forms",
    usage: `import { Textarea } from "@/components/nessa-ui"

<Textarea rows={4} placeholder="Describe the run…" />`,
    props: [
      {
        name: "…",
        type: "TextareaHTMLAttributes",
        description: "Takes any textarea prop, including rows and disabled.",
      },
    ],
  },
  {
    slug: "select",
    name: "Select",
    description:
      "A native select with our chrome and a custom chevron — keyboard and mobile behaviour stay native.",
    status: "stable",
    group: "Forms",
    usage: `import { Select } from "@/components/nessa-ui"

<Select
  options={[
    { value: "sonnet", label: "Sonnet" },
    { value: "opus", label: "Opus" },
  ]}
/>`,
    props: [
      { name: "options", type: "SelectOption[]", description: "Required." },
      { name: "placeholder", type: "string", description: "Rendered as a disabled first option." },
    ],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description: "A checkbox with an optional bound label.",
    status: "stable",
    group: "Forms",
    usage: `import { Checkbox } from "@/components/nessa-ui"

<Checkbox label="Stream tokens" defaultChecked />`,
    props: [
      { name: "label", type: "ReactNode", description: "Wired to the input with a generated id." },
    ],
  },
  {
    slug: "switch",
    name: "Switch",
    description:
      "A toggle for immediate settings. Works controlled or uncontrolled.",
    status: "stable",
    group: "Forms",
    usage: `import { Switch } from "@/components/nessa-ui"

<Switch label="Auto-retry failures" defaultChecked />`,
    props: [
      { name: "checked", type: "boolean", description: "Controlled value." },
      { name: "defaultChecked", type: "boolean", default: "false" },
      { name: "onCheckedChange", type: "(checked: boolean) => void" },
      { name: "label", type: "ReactNode" },
      { name: "disabled", type: "boolean" },
    ],
  },

  // ── Data display ──────────────────────────────────────────────────────────
  {
    slug: "card",
    name: "Card",
    description:
      "A bordered surface with optional header and footer regions.",
    status: "stable",
    group: "Data display",
    usage: `import { Card } from "@/components/nessa-ui"

<Card title="Run 4192" description="Completed in 1m 12s">
  All 128 evaluations passed.
</Card>`,
    props: [
      { name: "title", type: "ReactNode" },
      { name: "description", type: "ReactNode" },
      { name: "footer", type: "ReactNode" },
    ],
  },
  {
    slug: "table",
    name: "Table",
    description:
      "A presentational table driven by a column definition. Reach for DataTable when you need sorting, search, or paging.",
    status: "stable",
    group: "Data display",
    usage: `import { Table } from "@/components/nessa-ui"

<Table
  columns={[
    { key: "name", header: "Model" },
    { key: "score", header: "Score", align: "right" },
  ]}
  rows={rows}
  rowKey={(row) => row.name}
/>`,
    props: [
      { name: "columns", type: "Column<T>[]", description: "Required. key, header, optional render/align/width." },
      { name: "rows", type: "T[]", description: "Required." },
      { name: "rowKey", type: "(row: T, i: number) => string", description: "Required." },
      { name: "empty", type: "ReactNode", default: '"No results."' },
    ],
  },
  {
    slug: "code-block",
    name: "CodeBlock",
    description:
      "Syntax-highlighted code with copy-to-clipboard, an optional filename bar, and line numbers. Highlighting is a small built-in tokenizer — no grammar engine ships to the client.",
    status: "stable",
    group: "Data display",
    usage: `import { CodeBlock } from "@/components/nessa-ui"

<CodeBlock filename="run.ts" code={source} showLineNumbers />`,
    props: [
      { name: "code", type: "string", description: "Required." },
      { name: "lang", type: '"tsx" | "ts" | "bash"', default: '"tsx"' },
      { name: "filename", type: "string", description: "Shows the header bar when set." },
      { name: "showLineNumbers", type: "boolean", default: "false" },
      { name: "copyable", type: "boolean", default: "true" },
    ],
    examples: [
      {
        id: "code-block-bash",
        title: "Shell",
        code: `<CodeBlock lang="bash" code="npx nessa-ui@latest add data-table" />`,
      },
    ],
  },
  {
    slug: "prop-table",
    name: "PropTable",
    description:
      "The API reference table used throughout these docs: prop, type, default, and a description line.",
    status: "stable",
    group: "Data display",
    usage: `import { PropTable } from "@/components/nessa-ui"

<PropTable
  rows={[{ name: "size", type: '"sm" | "md"', default: '"md"' }]}
/>`,
    props: [{ name: "rows", type: "PropRow[]", description: "Required." }],
  },
  {
    slug: "progress",
    name: "Progress",
    description: "A determinate progress bar with an optional label row.",
    status: "stable",
    group: "Data display",
    usage: `import { Progress } from "@/components/nessa-ui"

<Progress value={62} label="Indexing" />`,
    props: [
      { name: "value", type: "number", description: "Required." },
      { name: "max", type: "number", default: "100" },
      { name: "label", type: "string", description: "Shows the label and percentage row." },
    ],
  },
  {
    slug: "alert",
    name: "Alert",
    description: "An inline message in four tones.",
    status: "stable",
    group: "Data display",
    usage: `import { Alert } from "@/components/nessa-ui"

<Alert tone="warn" title="Rate limited">
  Retrying in 30 seconds.
</Alert>`,
    props: [
      {
        name: "tone",
        type: '"info" | "success" | "warn" | "danger"',
        default: '"info"',
      },
      { name: "title", type: "string" },
    ],
    examples: [
      {
        id: "alert-tones",
        title: "Tones",
        code: `<Alert tone="info" title="Queued">…</Alert>
<Alert tone="success" title="Passed">…</Alert>
<Alert tone="warn" title="Rate limited">…</Alert>
<Alert tone="danger" title="Failed">…</Alert>`,
      },
    ],
  },

  // ── Navigation ────────────────────────────────────────────────────────────
  {
    slug: "tabs",
    name: "Tabs",
    description: "An underlined tab strip driven by a flat array of items.",
    status: "stable",
    group: "Navigation",
    usage: `import { Tabs } from "@/components/nessa-ui"

<Tabs
  items={[
    { value: "preview", label: "Preview", content: <Demo /> },
    { value: "code", label: "Code", content: <CodeBlock code={src} /> },
  ]}
/>`,
    props: [
      { name: "items", type: "TabItem[]", description: "Required. value, label, content." },
      { name: "defaultValue", type: "string", description: "Falls back to the first item." },
    ],
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    description: "A trail of ancestor links; the last item renders as text.",
    status: "stable",
    group: "Navigation",
    usage: `import { Breadcrumb } from "@/components/nessa-ui"

<Breadcrumb
  items={[
    { label: "Runs", href: "/runs" },
    { label: "4192" },
  ]}
/>`,
    props: [{ name: "items", type: "Crumb[]", description: "Required. label and optional href." }],
  },
  {
    slug: "pagination",
    name: "Pagination",
    description:
      "Page controls that collapse long ranges to an ellipsis around the current page.",
    status: "stable",
    group: "Navigation",
    usage: `import { Pagination } from "@/components/nessa-ui"

<Pagination page={page} pageCount={12} onPageChange={setPage} />`,
    props: [
      { name: "page", type: "number", description: "Required. 1-indexed." },
      { name: "pageCount", type: "number", description: "Required." },
      { name: "onPageChange", type: "(page: number) => void" },
    ],
  },

  // ── Overlays ──────────────────────────────────────────────────────────────
  {
    slug: "dialog",
    name: "Dialog",
    description:
      "A modal with header, body, and footer regions. Closes on Escape and on backdrop click.",
    status: "stable",
    group: "Overlays",
    usage: `import { Dialog } from "@/components/nessa-ui"

<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete run"
  footer={<Button variant="outline">Cancel</Button>}
>
  This cannot be undone.
</Dialog>`,
    props: [
      { name: "open", type: "boolean", description: "Required." },
      { name: "onClose", type: "() => void", description: "Required." },
      { name: "title", type: "ReactNode" },
      { name: "description", type: "ReactNode" },
      { name: "footer", type: "ReactNode" },
    ],
  },
  {
    slug: "dropdown-menu",
    name: "DropdownMenu",
    description:
      "A menu anchored to any trigger. Closes on outside click and Escape.",
    status: "stable",
    group: "Overlays",
    usage: `import { DropdownMenu } from "@/components/nessa-ui"

<DropdownMenu
  trigger={<Button variant="outline">Actions</Button>}
  items={[
    { label: "Duplicate" },
    { label: "Delete", danger: true },
  ]}
/>`,
    props: [
      { name: "trigger", type: "ReactNode", description: "Required." },
      { name: "items", type: "MenuItem[]", description: "Required. label, onSelect, danger, disabled." },
      { name: "align", type: '"start" | "end"', default: '"start"' },
    ],
  },

  // ── Composites ────────────────────────────────────────────────────────────
  {
    slug: "tool-call",
    name: "ToolCall",
    description:
      "One tool invocation in an agent transcript: a disclosure row naming the tool, with input and output panes and the files it touched. Status is exposed as data-status for host styling.",
    status: "stable",
    group: "Agent surfaces",
    usage: `import { ToolCall } from "@/components/nessa-ui"

<ToolCall
  name="search_runs"
  status="complete"
  summary="suite=retrieval"
  input={<JsonTree value={{ suite: "retrieval" }} />}
  output="12 matches"
/>`,
    props: [
      { name: "name", type: "string", description: "Required." },
      { name: "status", type: '"pending" | "running" | "complete" | "error"', default: '"complete"' },
      { name: "summary", type: "ReactNode", description: "Shown on the trigger row." },
      { name: "icon", type: "ReactNode" },
      { name: "input / output", type: "ReactNode", description: "Rendered as tabs when both are present." },
      { name: "files", type: "string[]", description: "Chips for the files the call touched." },
      { name: "open / defaultOpen / onOpenChange", type: "boolean · (open) => void", description: "Controlled or uncontrolled expansion." },
    ],
    examples: [
      {
        id: "tool-call-states",
        title: "Lifecycle states",
        code: `<ToolCall name="read_file" status="pending" summary="queued" />
<ToolCall name="eval-suite" status="running" summary="3 cases" />
<ToolCall name="search_runs" status="complete" output="12 matches" />
<ToolCall name="write_file" status="error" summary="permission denied" />`,
      },
    ],
  },
  {
    slug: "tool-approval",
    name: "ToolApproval",
    description:
      "A tool-permission request: the agent wants to run something and the person decides. Once resolved the card goes inert and states the decision, so a settled request never looks live.",
    status: "stable",
    group: "Agent surfaces",
    usage: `import { ToolApproval } from "@/components/nessa-ui"

<ToolApproval
  title="Run a shell command"
  description="The agent wants to run the eval harness."
  command="npx nessa eval --suite retrieval"
  resolution={resolution}
  onResolve={setResolution}
/>`,
    props: [
      { name: "title", type: "string", description: "Required." },
      { name: "description", type: "ReactNode" },
      { name: "command", type: "ReactNode", description: "The payload being approved." },
      { name: "variant", type: '"docked" | "floating"', default: '"docked"' },
      { name: "resolution", type: '"allow" | "allow-always" | "deny" | null', default: "null" },
      { name: "onResolve", type: "(resolution) => void" },
    ],
  },
  {
    slug: "json-tree",
    name: "JsonTree",
    description:
      "A structured JSON renderer: keys tint muted so values carry emphasis, containers indent with real punctuation, and the text stays selectable. Circular references render as [Circular] instead of recursing.",
    status: "stable",
    group: "Agent surfaces",
    usage: `import { JsonTree } from "@/components/nessa-ui"

<JsonTree value={payload} collapsible defaultExpandedDepth={1} />`,
    props: [
      { name: "value", type: "unknown", description: "Required. Already parsed — a string renders as a string leaf." },
      { name: "collapsible", type: "boolean", default: "false", description: "Adds a disclosure toggle to every container." },
      { name: "defaultExpandedDepth", type: "number", description: "Containers at this depth or deeper start folded." },
    ],
    examples: [
      {
        id: "json-tree-collapsible",
        title: "Collapsible, folded below the top level",
        code: `<JsonTree value={payload} collapsible defaultExpandedDepth={1} />`,
      },
    ],
  },
  {
    slug: "file-diff-list",
    name: "FileDiffList",
    description:
      "The change summary an agent produces: files touched with per-file add and delete counts, folded to the first few until expanded.",
    status: "stable",
    group: "Agent surfaces",
    usage: `import { FileDiffList } from "@/components/nessa-ui"

<FileDiffList
  files={[
    { path: "src/index.ts", additions: 24, deletions: 3, status: "modified" },
  ]}
/>`,
    props: [
      { name: "files", type: "FileDiff[]", description: "Required. path, additions, deletions, optional status." },
      { name: "title", type: "ReactNode", default: '"Changes"' },
      { name: "collapsedCount", type: "number", default: "3" },
      { name: "expanded / defaultExpanded / onExpandedChange", type: "boolean · (expanded) => void" },
      { name: "onFileClick", type: "(file: FileDiff) => void" },
    ],
  },
  {
    slug: "model-picker",
    name: "ModelPicker",
    description:
      "A grouped, searchable model list in a popover. Type to filter, ↑/↓ to move, Enter to choose, Escape to dismiss — filtering and selecting are the same gesture.",
    status: "stable",
    group: "Agent surfaces",
    usage: `import { ModelPicker } from "@/components/nessa-ui"

<ModelPicker
  groups={[
    {
      label: "Nessa",
      models: [
        { id: "large", name: "nessa-1-large", meta: "200k", description: "Best for reasoning" },
      ],
    },
  ]}
  defaultValue="large"
/>`,
    props: [
      { name: "groups", type: "ModelGroup[]", description: "Required. label and models." },
      { name: "value / defaultValue / onValueChange", type: "string · (value) => void" },
      { name: "open / defaultOpen / onOpenChange", type: "boolean · (open) => void" },
      { name: "placeholder / searchPlaceholder / emptyMessage", type: "string" },
      { name: "disabled", type: "boolean" },
    ],
  },
  {
    slug: "gantt-chart",
    name: "GanttChart",
    description:
      "A plan on a timeline. Summaries roll their span and progress up from their children, a task whose start equals its end renders as a milestone diamond, and dependencies draw as finish-to-start arrows. Bars drag to reschedule and their edges drag to resize — nothing reschedules itself behind your back.",
    status: "beta",
    group: "Composites",
    usage: `import { GanttChart } from "@/components/nessa-ui"

<GanttChart
  defaultScale="week"
  tasks={[
    { id: "plan", name: "Retrieval v2" },
    { id: "index", name: "Rebuild index", start: "2026-08-24", end: "2026-08-28", parentId: "plan", progress: 0.6 },
    { id: "ship", name: "Ship", start: "2026-09-02", end: "2026-09-02", dependsOn: ["index"] },
  ]}
  onTasksChange={setTasks}
/>`,
    props: [
      { name: "tasks", type: "GanttTask[]", description: "Required. id, name, start, end, optional progress, tone, dependsOn, parentId." },
      { name: "onTasksChange", type: "(tasks: GanttTask[]) => void", description: "Makes the chart controlled; fires after a drag commits." },
      { name: "scale / defaultScale / onScaleChange", type: '"day" | "week" | "month"', default: '"week"' },
      { name: "today", type: "string", description: "Defaults to the viewer's current date; pass it to pin the chart." },
      { name: "selectedTaskId / onSelectTask", type: "string | null · (id) => void" },
      { name: "editable", type: "boolean", default: "true", description: "Drag bars to reschedule, edges to resize." },
      { name: "cascadeDependents", type: "boolean", default: "true", description: "Moving a task's finish shifts everything that transitively depends on it." },
      { name: "rowHeight / taskListWidth", type: "number", default: "36 / 208" },
      { name: "shortcuts", type: "boolean", default: "true", description: "H/L scroll, T today, D/W/M scale." },
      { name: "renderTask", type: "(task, span) => ReactNode", description: "Own the bar interior." },
      { name: "classNames", type: "{ root, row, bar, list }" },
    ],
    examples: [
      {
        id: "gantt-scales",
        title: "Month scale — the whole plan at a glance",
        code: `<GanttChart defaultScale="month" tasks={tasks} />`,
      },
      {
        id: "gantt-cascade",
        title: "Dependents follow — push and pull through the graph",
        code: `// Drag "Rebuild index" and everything downstream of it moves with it.
// Turn it off to move one task in isolation.
<GanttChart cascadeDependents tasks={tasks} onTasksChange={setTasks} />`,
      },
      {
        id: "gantt-readonly",
        title: "Read-only",
        code: `<GanttChart editable={false} shortcuts={false} tasks={tasks} />`,
      },
    ],
  },
  {
    slug: "app-shell",
    name: "AppShell",
    description:
      "The application frame: a collapsible sidebar with grouped navigation, a sticky top bar for actions, and a scrolling content well.",
    status: "stable",
    group: "Composites",
    usage: `import { AppShell } from "@/components/nessa-ui"

<AppShell
  brand="Nessa"
  title="Runs"
  actions={<Button size="sm">New run</Button>}
  sections={[
    {
      title: "Workspace",
      items: [
        { label: "Runs", active: true },
        { label: "Datasets", badge: 12 },
      ],
    },
  ]}
>
  {children}
</AppShell>`,
    props: [
      { name: "brand", type: "ReactNode", description: "Required." },
      { name: "sections", type: "AppShellSection[]", description: "Required. Grouped nav items." },
      { name: "title", type: "ReactNode", description: "Top bar heading." },
      { name: "actions", type: "ReactNode", description: "Top bar, right side." },
      { name: "footer", type: "ReactNode", description: "Sidebar footer; hidden when collapsed." },
      { name: "defaultCollapsed", type: "boolean", default: "false" },
      { name: "resizable", type: "boolean", default: "true", description: "Drag the sidebar edge; arrow keys work when focused." },
      { name: "defaultSidebarWidth", type: "number", default: "224" },
      { name: "minSidebarWidth / maxSidebarWidth", type: "number", default: "180 / 400" },
      { name: "inspector", type: "ReactNode", description: "Right-hand panel: resizable and toggled from the top bar." },
      { name: "inspectorTitle", type: "ReactNode", default: '"Details"' },
    ],
    examples: [
      {
        id: "app-shell-inspector",
        title: "Resizable sidebar and inspector panel",
        code: `<AppShell
  resizable
  brand="Nessa"
  title="Run 4192"
  inspector={<RunDetails />}
  sections={sections}
>
  <SplitPane direction="vertical" defaultSize={180}>
    <Trace />
    <Console />
  </SplitPane>
</AppShell>`,
      },
    ],
  },
  {
    slug: "data-table",
    name: "DataTable",
    description:
      "Table with client-side search, sortable columns, and pagination. State lives inside, so it is drop-in for a fixed dataset.",
    status: "stable",
    group: "Composites",
    usage: `import { DataTable } from "@/components/nessa-ui"

<DataTable
  columns={[
    { key: "model", header: "Model", sortable: true },
    { key: "score", header: "Score", align: "right", sortable: true },
  ]}
  rows={rows}
  rowKey={(row) => row.id}
  searchKeys={["model"]}
  pageSize={8}
/>`,
    props: [
      { name: "columns", type: "DataColumn<T>[]", description: "Required. Add sortable to enable header sorting." },
      { name: "rows", type: "T[]", description: "Required." },
      { name: "rowKey", type: "(row: T, i: number) => string", description: "Required." },
      { name: "searchKeys", type: "string[]", description: "Columns the filter box searches. Omit to hide it." },
      { name: "pageSize", type: "number", default: "8" },
      { name: "toolbar", type: "ReactNode", description: "Rendered opposite the search box." },
      { name: "onRowClick", type: "(row: T) => void" },
    ],
  },
  {
    slug: "kanban",
    name: "Kanban",
    description:
      "A board with drag and drop for cards and columns. While dragging, a dashed drop slot appears at the exact insertion index, so the target is never ambiguous. Columns carry WIP limits and reorder as workflow stages.",
    status: "stable",
    group: "Composites",
    usage: `import { Kanban } from "@/components/nessa-ui"

<Kanban
  columns={[
    { id: "todo", title: "Todo", cards: [{ id: "1", title: "Ship docs" }] },
    { id: "doing", title: "In progress", limit: 2, cards: [] },
  ]}
  onChange={setBoard}
/>`,
    props: [
      { name: "columns", type: "KanbanColumn[]", description: "Required. id, title, cards, optional limit and accent." },
      { name: "onChange", type: "(columns: KanbanColumn[]) => void", description: "Makes the board controlled." },
      { name: "reorderColumns", type: "boolean", default: "true", description: "Drag column headers to reorder stages." },
      { name: "onCardClick", type: "(card, column) => void" },
      { name: "renderCard", type: "(card, column) => ReactNode", description: "Full control of card appearance; drag behaviour stays." },
    ],
    examples: [
      {
        id: "kanban-workflow",
        title: "Workflow stages — WIP limits and column reordering",
        code: `<Kanban
  reorderColumns
  columns={[
    { id: "triage", title: "Triage", accent: "neutral", cards: [...] },
    { id: "running", title: "Running", accent: "warn", limit: 2, cards: [...] },
    { id: "review", title: "Review", accent: "success", cards: [...] },
  ]}
/>`,
      },
      {
        id: "kanban-custom",
        title: "Custom cards — renderCard owns the look, the board owns the drag",
        code: `<Kanban
  columns={columns}
  renderCard={(card) => (
    <div className="rounded-lg border border-line bg-ink p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-fg">{card.title}</span>
        <Avatar size="sm" name={String(card.data?.owner)} />
      </div>
      <Progress className="mt-3" value={Number(card.data?.progress)} />
    </div>
  )}
/>`,
      },
    ],
  },
  {
    slug: "calendar",
    name: "Calendar",
    description:
      "One event set across day, week, month and year views. Events drag to reschedule — between days in month view, and across days and time slots on the time grid, snapping to a configurable minute grid. Dates are ISO strings and today is passed in, so rendering stays pure.",
    status: "stable",
    group: "Composites",
    usage: `import { Calendar } from "@/components/nessa-ui"

<Calendar
  defaultView="month"
  events={[
    { date: "2026-08-24", title: "Eval sweep", start: "09:30", end: "11:00" },
    { date: "2026-08-24", title: "Checkpoint", tone: "success" },
  ]}
  onSelect={(date) => console.log(date)}
/>`,
    props: [
      { name: "view", type: '"day" | "week" | "month" | "year"', description: "Controlled view." },
      { name: "defaultView", type: "CalendarView", default: '"month"' },
      { name: "onViewChange", type: "(view: CalendarView) => void" },
      { name: "date", type: "string", description: "Controlled anchor date (YYYY-MM-DD)." },
      { name: "defaultDate", type: "string", description: "Falls back to today." },
      { name: "onDateChange", type: "(date: string) => void" },
      { name: "events", type: "CalendarEvent[]", description: "date, title, optional start/end (HH:MM) and tone." },
      { name: "today", type: "string", description: "Defaults to the viewer's current date; pass it to pin the calendar." },
      { name: "onSelect", type: "(date: string) => void" },
      { name: "onEventClick", type: "(event: CalendarEvent) => void" },
      { name: "editable", type: "boolean", default: "false", description: "Drag events to reschedule them." },
      { name: "onEventsChange", type: "(events: CalendarEvent[]) => void", description: "Makes the event list controlled." },
      { name: "snapMinutes", type: "number", default: "15", description: "Grid a dragged event snaps to." },
      { name: "shortcuts", type: "boolean", default: "true", description: "← → move, T today, D/W/M/Y switch view." },
    ],
    examples: [
      {
        id: "calendar-reschedule",
        title: "Drag to reschedule — across days, and across time slots",
        code: `<Calendar
  editable
  defaultView="week"
  snapMinutes={15}
  events={events}
  onEventsChange={setEvents}
/>`,
      },
      {
        id: "calendar-shortcuts",
        title: "Keyboard navigation",
        code: `// Focus the calendar, then:
//   ← →   previous / next (day, week, month or year depending on the view)
//   T     jump to today
//   D W M Y   switch view
<Calendar shortcuts events={events} />`,
      },
    ],
  },
  {
    slug: "canvas",
    name: "Canvas",
    description:
      "A pan-and-zoom node canvas: drag the background to pan, drag nodes to move them, scroll or use the controls to zoom, click to select. It owns the interaction model — dragging, zooming, selection, edge routing, snapping — while renderNode decides what a node looks like.",
    status: "stable",
    group: "Composites",
    usage: `import { Canvas } from "@/components/nessa-ui"

<Canvas
  snap={8}
  nodes={[
    { id: "a", x: 40, y: 40, title: "Ingest", subtitle: "corpus" },
    { id: "b", x: 260, y: 120, title: "Embed" },
  ]}
  edges={[{ from: "a", to: "b", label: "batch" }]}
/>`,
    props: [
      { name: "nodes", type: "CanvasNode[]", description: "Required. id, x, y, title, optional subtitle, data, width, height." },
      { name: "edges", type: "CanvasEdge[]", description: "from, to, optional label and dashed." },
      { name: "onNodesChange", type: "(nodes: CanvasNode[]) => void", description: "Makes the canvas controlled." },
      { name: "onSelect", type: "(id: string | null) => void" },
      { name: "renderNode", type: "(node, { selected, dragging }) => ReactNode", description: "Full control of node appearance." },
      { name: "snap", type: "number", default: "0", description: "Snap dragged nodes to this pixel grid." },
      { name: "grid", type: "boolean", default: "true" },
      { name: "minZoom / maxZoom", type: "number", default: "0.4 / 2" },
      { name: "classNames", type: "{ root, node, edge, controls }", description: "Style the parts without forking the component." },
    ],
    examples: [
      {
        id: "canvas-workflow",
        title: "Workflow nodes — renderNode with status, ports and metrics",
        code: `<Canvas
  snap={8}
  nodes={nodes}
  edges={edges}
  renderNode={(node, { selected }) => (
    <div className={cn(
      "h-full rounded-xl border bg-ink shadow-lg",
      selected ? "border-fg" : "border-line"
    )}>
      <div className="flex items-center gap-2 border-b border-line px-3 py-2">
        <StatusDot status={node.data.status} />
        <span className="text-sm font-medium text-fg">{node.title}</span>
        <Badge tone="outline">{node.data.kind}</Badge>
      </div>
      <div className="px-3 py-2 text-xs text-dim">{node.data.metric}</div>
    </div>
  )}
/>`,
      },
    ],
  },
  {
    slug: "split-pane",
    name: "SplitPane",
    description:
      "Two panes with a draggable divider. Drag to resize, double-click to reset, or focus the handle and use the arrow keys.",
    status: "stable",
    group: "Composites",
    usage: `import { SplitPane } from "@/components/nessa-ui"

<SplitPane defaultSize={280} min={180} max={520}>
  <FileTree />
  <Editor />
</SplitPane>`,
    props: [
      { name: "children", type: "[ReactNode, ReactNode]", description: "Required. Exactly two panes." },
      { name: "direction", type: '"horizontal" | "vertical"', default: '"horizontal"' },
      { name: "defaultSize", type: "number", default: "260", description: "First pane size in pixels." },
      { name: "min / max", type: "number", default: "140 / 640" },
      { name: "onResize", type: "(size: number) => void" },
      { name: "resetSize", type: "number", description: "Size restored on double-click." },
    ],
    examples: [
      {
        id: "split-pane-vertical",
        title: "Vertical split",
        code: `<SplitPane direction="vertical" defaultSize={140} min={80} max={260}>
  <Preview />
  <Console />
</SplitPane>`,
      },
    ],
  },
  {
    slug: "chat",
    name: "Chat",
    description:
      "A message thread with token streaming, tool and skill calls, and attachments. Streaming is presentational: mark a message streaming and it reveals progressively, so the same component renders a live turn or a finished transcript.",
    status: "stable",
    group: "Composites",
    usage: `import { Chat, Composer } from "@/components/nessa-ui"

<Chat
  messages={messages}
  footer={<Composer onSend={send} running={running} onStop={stop} />}
/>`,
    props: [
      { name: "messages", type: "ChatMessage[]", description: "Required. role, content, optional attachments, toolCalls, streaming." },
      { name: "streamSpeed", type: "number", default: "2", description: "Characters per frame; 0 renders instantly." },
      { name: "footer", type: "ReactNode", description: "Usually a Composer." },
      { name: "renderMessage", type: "(message) => ReactNode", description: "Full control of message appearance." },
      { name: "emptyState", type: "ReactNode" },
    ],
    examples: [
      {
        id: "chat-tools",
        title: "Tool and skill calls with expandable output",
        code: `<Chat
  messages={[
    {
      id: "1",
      role: "assistant",
      content: "Found three regressions.",
      toolCalls: [
        { id: "t1", name: "search_runs", status: "done", output: "12 matches" },
        { id: "t2", name: "eval-suite", kind: "skill", status: "running" },
      ],
    },
  ]}
/>`,
      },
    ],
  },
  {
    slug: "composer",
    name: "Composer",
    description:
      "The AI input surface. Typing \"/\" opens skills and commands, \"@\" opens mentions, and either inserts a real inline chip that flows with the text. Plus attachments, model selection, and queue steering — follow-ups typed while a turn is running are queued, and can be edited, reordered, promoted or dropped before they reach the model.",
    status: "stable",
    group: "Composites",
    usage: `import { Composer } from "@/components/nessa-ui"

<Composer
  running={running}
  onSend={({ text, attachments, skills }) => send(text, attachments, skills)}
  onStop={stop}
  skills={[{ id: "eval", name: "Eval suite", description: "Run the harness" }]}
  models={[{ value: "large", label: "nessa-1-large" }]}
/>`,
    props: [
      { name: "onSend", type: "(payload: ComposerSubmit) => void", description: "text, attachments and active skills." },
      { name: "running", type: "boolean", default: "false", description: "Send becomes Stop; new input is queued." },
      { name: "onStop", type: "() => void", description: "Also bound to Escape." },
      { name: "attachments", type: "ChatAttachment[]", description: "Controlled attachments; uncontrolled otherwise." },
      { name: "skills", type: "ComposerSkill[]", description: "Offered in the skill picker." },
      { name: "activeSkills", type: "string[]", description: "Controlled selection." },
      { name: "queue", type: "string[]", description: "Controlled queue for steering mid-turn." },
      { name: "onQueueChange", type: "(queue: string[]) => void" },
      { name: "models", type: "{ value, label }[]", description: "Shows the model selector." },
      { name: "commands", type: "ComposerSuggestion[]", description: 'Offered after "/". Defaults to `skills`.' },
      { name: "mentions", type: "ComposerSuggestion[]", description: 'Offered after "@" — files, runs, people.' },
      { name: "maxRows", type: "number", default: "8" },
    ],
    examples: [
      {
        id: "composer-queue",
        title: "Queue steering — a turn is running, follow-ups wait and stay editable",
        code: `<Composer
  running
  queue={queue}
  onQueueChange={setQueue}
  onStop={stop}
/>`,
      },
      {
        id: "composer-inline",
        title: 'Inline chips — type "/" for skills, "@" to mention',
        code: `<Composer
  commands={[
    { id: "eval", label: "Eval suite", description: "Run the harness" },
    { id: "trace", label: "Trace reader", description: "Inspect a run" },
  ]}
  mentions={[
    { id: "run-4192", label: "run-4192", description: "retrieval · passed" },
    { id: "ada", label: "Ada Lovelace", description: "owner" },
  ]}
  onSend={({ text, chips }) => send(text, chips)}
/>`,
      },
      {
        id: "composer-skills",
        title: "Attachments and skills",
        code: `<Composer
  skills={[
    { id: "eval", name: "Eval suite", description: "Run the harness" },
    { id: "trace", name: "Trace reader", description: "Inspect a run" },
  ]}
  attachments={[{ id: "1", name: "run-4192.json", kind: "code", size: "18 KB" }]}
/>`,
      },
    ],
  },
];

export function getComponent(slug: string) {
  return registry.find((c) => c.slug === slug);
}
