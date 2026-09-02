import { catalog } from "./index.generated";

export const groups = [
  "Primitives",
  "Content",
  "Charts",
  "Agent surfaces",
  "Chat surfaces",
  "Composites",
] as const;

export type Group = (typeof groups)[number];

export interface ComponentDoc {
  slug: string;
  name: string;
  /** One sentence: a noun phrase naming the thing, then how it behaves. */
  description: string;
  group: Group;
  /** Extra previews, keyed by preview id. */
  examples?: { id: string; title: string }[];
  /** Behaviours the library's own storybook demonstrates. */
  stories?: { name: string; note: string | null }[];
}

/**
 * Slugs the site documents, in sidebar order. Descriptions are written here
 * rather than lifted from the storybook, which writes at essay length.
 */
const documented: {
  slug: string;
  group: Group;
  description: string;
  examples?: { id: string; title: string }[];
}[] = [
  {
    slug: "button",
    group: "Primitives",
    description: "A button that triggers an action, in six variants and four sizes.",
  },
  {
    slug: "badge",
    group: "Primitives",
    description: "A compact label that marks status, in four variants.",
  },
  {
    slug: "card",
    group: "Primitives",
    description: "A bordered surface with header, content, footer and action slots.",
  },
  {
    slug: "input",
    group: "Primitives",
    description: "A single-line text field.",
  },
  {
    slug: "segmented-control",
    group: "Primitives",
    description:
      "A row of mutually exclusive options. Arrow keys move between them.",
  },
  {
    slug: "random-avatar",
    group: "Primitives",
    description:
      "An avatar painted from a seed, where the same identity always paints the same picture.",
    examples: [
      { id: "random-avatar-group", title: "Several seeds painting one group picture" },
      {
        id: "random-avatar-working",
        title: "The paint keeps flooding while busy is set",
      },
      {
        id: "random-avatar-tones",
        title: "Tone presets, and the ink ground for dark surfaces",
      },
    ],
  },
  {
    slug: "checkbox",
    group: "Primitives",
    description:
      "A checkbox built on a real input, with a mixed state for a set that is only partly selected.",
    examples: [
      { id: "checkbox-states", title: "Unchecked, checked, mixed and disabled" },
    ],
  },
  {
    slug: "dropdown-menu",
    group: "Primitives",
    description:
      "A menu of actions anchored to a trigger, with checkbox and radio items, shortcut hints and submenus.",
  },
  {
    slug: "pagination",
    group: "Primitives",
    description:
      "A nav of numbered page buttons between previous and next controls. The host computes the window and holds the page.",
  },
  {
    slug: "timeline-header",
    group: "Primitives",
    description:
      "A band for a horizontal scale, whose pixel-offset cells can pin their labels as the scroll passes them.",
  },
  {
    slug: "tabs",
    group: "Primitives",
    description:
      "A tablist that swaps one panel for another, with roving focus and arrow-key movement.",
    examples: [{ id: "tabs-pill", title: "The pill strip, shared with SegmentedControl" }],
  },
  {
    slug: "task-list",
    group: "Primitives",
    description:
      "A list of task rows, each carrying a todo, active, done or failed status.",
    examples: [
      {
        id: "task-list-checklist",
        title: "onStatusChange turns each row into a real checkbox",
      },
    ],
  },
  {
    slug: "drawer",
    group: "Primitives",
    description:
      "A modal panel anchored to one edge of the viewport, sliding in on the motion tokens.",
    examples: [
      { id: "drawer-resizable", title: "A left drawer resized by drag or arrow keys" },
    ],
  },
  {
    slug: "sheet",
    group: "Primitives",
    description:
      "A bottom sheet that rises over its nearest positioned ancestor and fills it when dragged up.",
    examples: [
      { id: "sheet-contained", title: "modal={false}, leaving the chrome around it reachable" },
    ],
  },
  {
    slug: "gradient-surface",
    group: "Primitives",
    description:
      "A gradient backdrop built from a palette, under an optional hairline pattern and a grain layer.",
    examples: [
      { id: "gradient-surface-palettes", title: "The six preset palettes" },
      { id: "gradient-surface-patterns", title: "Contours, waves, rings and none" },
    ],
  },

  {
    slug: "code-block",
    group: "Content",
    description:
      "A block of syntax-highlighted code with a copy button. CodeBlockProvider sets the theme.",
  },
  {
    slug: "json-tree",
    group: "Content",
    description: "A structured view of a JSON value, with optional per-branch collapse.",
    examples: [{ id: "json-tree-collapsible", title: "Collapsible branches" }],
  },
  {
    slug: "math-block",
    group: "Content",
    description:
      "A KaTeX formula that holds its last valid render while the TeX is still streaming.",
  },
  {
    slug: "mermaid-diagram",
    group: "Content",
    description:
      "A diagram rendered from Mermaid source, following the app's colour mode.",
  },
  {
    slug: "message-markdown",
    group: "Content",
    description: "Markdown for message bodies, composing CodeBlock and MathBlock.",
  },
  {
    slug: "reference",
    group: "Content",
    description: "An inline citation that opens its source card on hover or focus.",
  },
  {
    slug: "selection-tooltip",
    group: "Content",
    description:
      "A pill of actions for the current text selection. Overflow actions sit in a scrolling shelf.",
    examples: [
      {
        id: "selection-tooltip-shelf",
        title: "Twelve shelf actions. Expand, then scroll the shelf sideways",
      },
    ],
  },
  {
    slug: "file-diff-list",
    group: "Content",
    description:
      "A summary of changed files with per-file stats and a collapse toggle.",
    examples: [
      { id: "file-diff-scroll", title: "Twelve files, collapsed and scrollable" },
    ],
  },
  {
    slug: "file-preview",
    group: "Content",
    description:
      "A previewer that renders a file by its detected kind, through renderers the host can replace.",
    examples: [
      { id: "file-preview-fallback", title: "An unregistered kind, kept reachable by download" },
    ],
  },
  {
    slug: "file-drop-zone",
    group: "Content",
    description:
      "A wrapper that turns whatever it contains into a file drop target, reporting the files it accepts.",
    examples: [
      { id: "file-drop-zone-limits", title: "accept, maxSize and maxFiles, with every refusal reported" },
    ],
  },
  {
    slug: "page-outline",
    group: "Content",
    description:
      "A section outline on a rail that jogs with heading depth, tracking the section being read.",
  },

  {
    slug: "pie-chart",
    group: "Charts",
    description:
      "A pie or donut of one wedge per slice, where hovering isolates a wedge and clicking selects it.",
    examples: [
      { id: "pie-chart-donut", title: "A donut centre reading the total, then the engaged slice" },
      { id: "pie-chart-gauge", title: "A narrowed sweep, as a gauge" },
    ],
  },
  {
    slug: "radar-chart",
    group: "Charts",
    description:
      "A radar of values on spokes, one closed outline per series, with a probe along each axis.",
    examples: [
      {
        id: "radar-chart-per-axis",
        title: "Per-axis normalisation, straight edges and every dot drawn",
      },
    ],
  },
  {
    slug: "flow-chart",
    group: "Charts",
    description:
      "A flow diagram of node bars joined by ribbons whose thickness carries the flow.",
    examples: [
      { id: "flow-chart-vertical", title: "Vertical columns, with ribbons blending source into target" },
    ],
  },
  {
    slug: "price-chart",
    group: "Charts",
    description:
      "A price plot with a scrubbable cursor and price and time scales, drawn as a line or candles.",
    examples: [
      { id: "price-chart-candles", title: "Open, high, low and close on the same scale" },
      { id: "price-chart-sparklines", title: "Axes off, as a watchlist sparkline" },
    ],
  },
  {
    slug: "stock-quote",
    group: "Charts",
    description:
      "A quote panel of price, change, range controls and key figures around a scrubbable price chart.",
  },

  {
    slug: "conversation-rail",
    group: "Agent surfaces",
    description:
      "A navigator beside a transcript that marks every turn and previews one on hover or focus.",
  },
  {
    slug: "message-scroller",
    group: "Agent surfaces",
    description:
      "A transcript viewport that follows the live edge until the reader scrolls away, with a control to return.",
  },
  {
    slug: "message",
    group: "Agent surfaces",
    description:
      "A row in a transcript, with assistant and user sides built from avatar, bubble and footer parts.",
    examples: [
      { id: "message-streaming", title: "Streaming a long reply" },
      {
        id: "message-rich-streaming",
        title: "Streaming markdown, math, a citation and a diagram",
      },
    ],
  },
  {
    slug: "tool-call",
    group: "Agent surfaces",
    description:
      "A single tool invocation that expands into its input, output and touched files. The label shimmers while it runs.",
    examples: [
      { id: "tool-call-states", title: "Running, complete and error" },
    ],
  },
  {
    slug: "tool-approval",
    group: "Agent surfaces",
    description:
      "A permission request for a tool run. Setting a resolution makes the card inert.",
    examples: [
      { id: "tool-approval-flow", title: "Granting hands off to the running call" },
      { id: "tool-approval-notch", title: "Notch variant" },
      { id: "tool-approval-mobile", title: "Phone viewport" },
    ],
  },
  {
    slug: "chat-composer",
    group: "Agent surfaces",
    description:
      "A chat entry surface with an input, footer actions, attachments and submit.",
    examples: [
      {
        id: "chat-composer-full",
        title: "Attachments, / and @ menus, model and thinking controls",
      },
      {
        id: "chat-composer-inline",
        title: "Inline attachment chips, including a captured paste",
      },
    ],
  },
  {
    slug: "composer-queue",
    group: "Agent surfaces",
    description:
      "A queue of messages pending on a running turn. Entries can be reordered, steered and removed.",
  },
  {
    slug: "model-picker",
    group: "Agent surfaces",
    description: "A model chooser grouped by provider, with search.",
  },
  {
    slug: "agent-activity",
    group: "Agent surfaces",
    description:
      "A collapsed cue for a stretch of agent work, opening its thinking and tool calls elsewhere.",
    examples: [
      { id: "agent-activity-card", title: "A live cue, and the card for a delegated run" },
    ],
  },
  {
    slug: "agent-details",
    group: "Agent surfaces",
    description:
      "A panel naming an agent conversation, with compact actions and a section of project fields.",
  },
  {
    slug: "conversation-history",
    group: "Agent surfaces",
    description:
      "A searchable roster of conversations, each row painted from the avatar of its project.",
  },
  {
    slug: "transcript-divider",
    group: "Agent surfaces",
    description:
      "A labelled hairline across a transcript, marking a day boundary, a model swap or a compaction.",
    examples: [
      { id: "transcript-divider-detail", title: "detail turns the label into a disclosure" },
    ],
  },

  {
    slug: "pill-composer",
    group: "Chat surfaces",
    description:
      "A pill-shaped composer for small chat surfaces, with a light travelling its rim while the agent works.",
  },
  {
    slug: "chat-bubbles",
    group: "Chat surfaces",
    description:
      "A bubble transcript built from message, quote, reaction, receipt and attachment parts.",
    examples: [
      { id: "chat-bubbles-typing", title: "The indicator that pulses while the agent answers" },
    ],
  },
  {
    slug: "chat-tabs",
    group: "Chat surfaces",
    description:
      "A strip of pill tabs for a chat window, with busy dots, attention badges and close controls.",
  },
  {
    slug: "chat-tray",
    group: "Chat surfaces",
    description:
      "A single row of everything attached to the message being written, collapsing its tail into a count.",
    examples: [
      { id: "chat-tray-collapse", title: "collapseAfter names three chips before the count" },
    ],
  },
  {
    slug: "chat-overlay",
    group: "Chat surfaces",
    description:
      "A reading view that takes over a chat's transcript while the tab strip and composer stay in use.",
  },
  {
    slug: "chat-annotations",
    group: "Chat surfaces",
    description:
      "Passages lifted from a document and the reader's comments on them, read as short conversations.",
    examples: [
      { id: "chat-annotations-sent", title: "A sent message compressing its whole set into one chip" },
    ],
  },

  {
    slug: "event-calendar",
    group: "Composites",
    description:
      "A day, week and month scheduler. Events are created, moved and resized by drag.",
  },
  {
    slug: "gantt-chart",
    group: "Composites",
    description:
      "A project timeline of bars, milestones and typed dependency arrows. Tasks are drawn, linked and rescheduled by drag or keyboard.",
    examples: [
      {
        id: "gantt-chart-planning",
        title: "Date columns, the critical path, and a task drawn on an empty lane",
      },
    ],
  },
  {
    slug: "split-view",
    group: "Composites",
    description:
      "A pair of resizable panels around a draggable separator. Arrow keys resize it from the keyboard.",
    examples: [
      {
        id: "split-view-workspace",
        title: "Nested splits, with views dragged between panes",
      },
    ],
  },
  {
    slug: "kanban",
    group: "Composites",
    description:
      "A board of columns and draggable cards. Moves report through onCardMove.",
  },
  {
    slug: "table",
    group: "Composites",
    description:
      "A data table on a flat bordered shell, with the toolbar, sorting, column menu and pager as separate pieces.",
    examples: [
      {
        id: "table-workbench",
        title: "Search, a status facet, a column menu, a sortable column and row selection",
      },
      { id: "table-pagination", title: "The pager under a long result set" },
      { id: "table-empty", title: "The row shown instead of data" },
    ],
  },
  {
    slug: "workflow-canvas",
    group: "Composites",
    description:
      "A pan-and-zoom canvas of nodes and edges that can be dragged, connected and deleted.",
    examples: [
      { id: "workflow-canvas-nested", title: "A node hosting a subflow" },
      {
        id: "workflow-canvas-palette",
        title: "Drop a connection on empty canvas to add a node",
      },
    ],
  },
];

export const registry: ComponentDoc[] = documented.map(
  ({ slug, group, description, examples }) => {
    const entry = catalog.find((item) => item.slug === slug);
    if (!entry) throw new Error(`No catalog entry for ${slug}`);
    return {
      slug,
      name: entry.name,
      description,
      group,
      examples,
      stories: entry.stories,
    };
  }
);

export function getComponent(slug: string) {
  return registry.find((c) => c.slug === slug);
}
