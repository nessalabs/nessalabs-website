import type { PropRow } from "@/components/nessa-ui/prop-table";

export const groups = [
  "Primitives",
  "Forms",
  "Data display",
  "Navigation",
  "Overlays",
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
  /** Worked examples; each id maps to a preview in registry/previews. */
  examples?: { id: string; title: string; code: string }[];
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
      "A board with native drag and drop between columns. Uncontrolled by default; pass onChange to own the state.",
    status: "beta",
    group: "Composites",
    usage: `import { Kanban } from "@/components/nessa-ui"

<Kanban
  columns={[
    { id: "todo", title: "Todo", cards: [{ id: "1", title: "Ship docs" }] },
    { id: "doing", title: "In progress", cards: [] },
  ]}
/>`,
    props: [
      { name: "columns", type: "KanbanColumn[]", description: "Required. id, title, cards." },
      { name: "onChange", type: "(columns: KanbanColumn[]) => void", description: "Makes the board controlled." },
    ],
  },
  {
    slug: "calendar",
    name: "Calendar",
    description:
      "A month grid with per-day events and overflow counts. Dates are ISO strings and `today` is passed in, so rendering stays pure.",
    status: "beta",
    group: "Composites",
    usage: `import { Calendar } from "@/components/nessa-ui"

<Calendar
  month="2026-08"
  today="2026-08-23"
  events={[{ date: "2026-08-24", title: "Eval sweep" }]}
  onSelect={(date) => console.log(date)}
/>`,
    props: [
      { name: "month", type: "string", description: "YYYY-MM. Defaults to the month of today." },
      { name: "today", type: "string", description: "YYYY-MM-DD, highlighted in the grid." },
      { name: "events", type: "CalendarEvent[]", description: "date and title." },
      { name: "onSelect", type: "(date: string) => void" },
    ],
  },
  {
    slug: "canvas",
    name: "Canvas",
    description:
      "A pan-and-zoom node canvas: drag the background to pan, drag nodes to move them, scroll to zoom. Edges are drawn as SVG curves between nodes.",
    status: "beta",
    group: "Composites",
    usage: `import { Canvas } from "@/components/nessa-ui"

<Canvas
  nodes={[
    { id: "a", x: 40, y: 40, title: "Ingest", subtitle: "source" },
    { id: "b", x: 260, y: 120, title: "Embed" },
  ]}
  edges={[{ from: "a", to: "b" }]}
/>`,
    props: [
      { name: "nodes", type: "CanvasNode[]", description: "Required. id, x, y, title, optional subtitle." },
      { name: "edges", type: "CanvasEdge[]", description: "from and to node ids." },
      { name: "onNodesChange", type: "(nodes: CanvasNode[]) => void", description: "Makes the canvas controlled." },
      { name: "grid", type: "boolean", default: "true" },
    ],
  },
];

export function getComponent(slug: string) {
  return registry.find((c) => c.slug === slug);
}
