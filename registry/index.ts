import { catalog } from "./index.generated";

export const groups = [
  "Primitives",
  "Layout",
  "Data",
  "Charts",
  "Files",
  "Conversation",
  "Agent",
  "Git",
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
 * Website labels that differ from a spaced export name, so the nav matches
 * the word people look up rather than the identifier they import.
 */
const displayNames: Record<string, string> = {
  "random-avatar": "Avatar",
  "popover-surface": "Popover",
  "event-calendar": "Calendar",
  "gantt-chart": "Gantt chart",
  "message-markdown": "Markdown",
  "math-block": "Math",
  "mermaid-diagram": "Mermaid",
  "morphing-mesh-gradient": "Mesh gradient",
  "gradient-surface": "Gradient",
  "file-diff-list": "File diff",
  "file-drop-zone": "File drop",
  "model-capability-controls": "Thinking controls",
  "chat-composer-editor": "Composer editor",
  "composer-access-mode": "Access mode",
  "git-commit-details": "Commit details",
  kanban: "Kanban",
  "json-tree": "JSON tree",
  "searchable-listbox": "Listbox",
  "chat-composer": "Composer",
  "timeline-header": "Timeline",
};

/** Spaced sentence case from a PascalCase export, e.g. ChatTabs → Chat tabs. */
function sentenceName(pascal: string) {
  const spaced = pascal
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  const [first, ...rest] = spaced.split(" ");
  return [first, ...rest.map((word) => word.toLowerCase())]
    .join(" ")
    .replace(/\bJson\b/, "JSON");
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
    slug: "input",
    group: "Primitives",
    description: "A single-line text field.",
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
    slug: "tabs",
    group: "Primitives",
    description:
      "A tablist that swaps one panel for another, with roving focus and arrow-key movement.",
    examples: [{ id: "tabs-pill", title: "The pill strip, shared with SegmentedControl" }],
  },
  {
    slug: "segmented-control",
    group: "Primitives",
    description:
      "A row of mutually exclusive options. Arrow keys move between them.",
  },
  {
    slug: "pagination",
    group: "Primitives",
    description:
      "A nav of numbered page buttons between previous and next controls. The host computes the window and holds the page.",
  },
  {
    slug: "dropdown-menu",
    group: "Primitives",
    description:
      "A menu of actions anchored to a trigger, with checkbox and radio items, shortcut hints and submenus.",
  },
  {
    slug: "context-menu",
    group: "Primitives",
    description:
      "A right-click menu of actions, with checkbox and radio items, shortcut hints and submenus.",
  },
  {
    slug: "popover-surface",
    group: "Primitives",
    description:
      "A floating card surface that overlay chrome sits on, leaving positioning and dismissal to its host.",
    examples: [
      { id: "popover-surface-variants", title: "The radius and elevation pairs" },
    ],
  },
  {
    slug: "searchable-listbox",
    group: "Primitives",
    description:
      "A single-select list under a search field, where the host renders each row.",
  },
  {
    slug: "sectioned-listbox",
    group: "Primitives",
    description:
      "A single-select list grouped under sticky headers, where arrow keys move across the section boundaries.",
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
    slug: "morphing-mesh-gradient",
    group: "Primitives",
    description:
      "A mesh-gradient backdrop of blurred colour fields that circulate on closed-loop paths.",
    examples: [
      { id: "morphing-mesh-gradient-presets", title: "The named palettes" },
      { id: "morphing-mesh-gradient-types", title: "Mesh, aurora and orb" },
    ],
  },

  {
    slug: "app-shell",
    group: "Layout",
    description:
      "An application frame of header, docks and status bar around a workspace of panes that split, move and resize.",
  },
  {
    slug: "sidebar",
    group: "Layout",
    description:
      "A collapsible navigation rail beside the page, with grouped menus, submenus and tooltips once collapsed to icons.",
  },
  {
    slug: "split-view",
    group: "Layout",
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
    slug: "window-deck",
    group: "Layout",
    description:
      "A deck of windows that snaps one to the centre and opens an overview of tiles on Mod+G.",
    examples: [
      {
        id: "window-deck-photos",
        title: "Photographs with no chrome. Throw a tile off the overview to dismiss it",
      },
      {
        id: "window-deck-workspaces",
        title: "Each window holds a split workspace. Resizing a split does not throw the window",
      },
    ],
  },
  {
    slug: "drawer",
    group: "Layout",
    description:
      "A modal panel anchored to one edge of the viewport, sliding in on the motion tokens.",
    examples: [
      { id: "drawer-resizable", title: "A left drawer resized by drag or arrow keys" },
    ],
  },
  {
    slug: "sheet",
    group: "Layout",
    description:
      "A bottom sheet that rises over its nearest positioned ancestor and fills it when dragged up.",
    examples: [
      { id: "sheet-contained", title: "modal={false}, leaving the chrome around it reachable" },
    ],
  },
  {
    slug: "virtual-list",
    group: "Layout",
    description:
      "A fixed-height list that mounts only the rows in view. Offscreen rows unmount; durable state stays with the host.",
    examples: [
      { id: "virtual-list-all", title: "virtualize={false} mounts every row in the same viewport" },
    ],
  },

  {
    slug: "table",
    group: "Data",
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
    slug: "kanban",
    group: "Data",
    description:
      "A board of columns and draggable cards. Moves report through onCardMove.",
  },
  {
    slug: "event-calendar",
    group: "Data",
    description:
      "A day, week and month scheduler. Events are created, moved and resized by drag.",
  },
  {
    slug: "page-outline",
    group: "Data",
    description:
      "A section outline on a rail that jogs with heading depth, tracking the section being read.",
    examples: [
      {
        id: "page-outline-collapse",
        title: "collapse=\"auto\" folds every branch but the settled one",
      },
      { id: "page-outline-marker", title: "A host marker banking along the rail" },
    ],
  },
  {
    slug: "json-tree",
    group: "Data",
    description: "A structured view of a JSON value, with optional per-branch collapse.",
    examples: [{ id: "json-tree-collapsible", title: "Collapsible branches" }],
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
    slug: "gantt-chart",
    group: "Charts",
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
    slug: "timeline-header",
    group: "Charts",
    description:
      "A band for a horizontal scale, whose pixel-offset cells can pin their labels as the scroll passes them.",
  },
  {
    slug: "mermaid-diagram",
    group: "Charts",
    description:
      "A diagram rendered from Mermaid source, following the app's colour mode.",
  },

  {
    slug: "code-block",
    group: "Files",
    description:
      "A block of syntax-highlighted code with a copy button. CodeBlockProvider sets the theme.",
  },
  {
    slug: "message-markdown",
    group: "Files",
    description: "Markdown for message bodies, composing CodeBlock and MathBlock.",
  },
  {
    slug: "math-block",
    group: "Files",
    description:
      "A KaTeX formula that holds its last valid render while the TeX is still streaming.",
  },
  {
    slug: "file-preview",
    group: "Files",
    description:
      "A previewer that renders a file by its detected kind, through renderers the host can replace.",
    examples: [
      { id: "file-preview-fallback", title: "An unregistered kind, kept reachable by download" },
    ],
  },
  {
    slug: "file-drop-zone",
    group: "Files",
    description:
      "A wrapper that turns whatever it contains into a file drop target, reporting the files it accepts.",
    examples: [
      { id: "file-drop-zone-limits", title: "accept, maxSize and maxFiles, with every refusal reported" },
    ],
  },
  {
    slug: "file-diff-list",
    group: "Files",
    description:
      "A summary of changed files with per-file stats and a collapse toggle.",
    examples: [
      { id: "file-diff-scroll", title: "Fourteen files, collapsed and scrollable" },
    ],
  },

  {
    slug: "message",
    group: "Conversation",
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
    slug: "message-scroller",
    group: "Conversation",
    description:
      "A transcript viewport that follows the live edge until the reader scrolls away, with a control to return.",
  },
  {
    slug: "conversation-rail",
    group: "Conversation",
    description:
      "A navigator beside a transcript that marks every turn and previews one on hover or focus.",
  },
  {
    slug: "chat-composer",
    group: "Conversation",
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
    slug: "chat-composer-editor",
    group: "Conversation",
    description:
      "A message input where attachments are atomic inline chips that keep their place in the sentence.",
  },
  {
    slug: "composer-queue",
    group: "Conversation",
    description:
      "A queue of messages pending on a running turn. Entries can be reordered, steered and removed.",
  },
  {
    slug: "composer-access-mode",
    group: "Conversation",
    description:
      "A control beside the composer that picks the tool-approval policy a turn runs under.",
  },
  {
    slug: "model-picker",
    group: "Conversation",
    description: "A model chooser grouped by provider, with search.",
  },
  {
    slug: "model-capability-controls",
    group: "Conversation",
    description:
      "A thinking-level control and fast-mode toggle for the composer's model row.",
    examples: [
      { id: "model-thinking-slider", title: "The thinking slider on its own" },
    ],
  },
  {
    slug: "pill-composer",
    group: "Conversation",
    description:
      "A pill-shaped composer for small chat surfaces, with a light travelling its rim while the agent works.",
  },
  {
    slug: "chat-bubbles",
    group: "Conversation",
    description:
      "A bubble transcript built from message, quote, reaction, receipt and attachment parts.",
    examples: [
      { id: "chat-bubbles-typing", title: "The indicator that pulses while the agent answers" },
    ],
  },
  {
    slug: "chat-tabs",
    group: "Conversation",
    description:
      "A strip of pill tabs for a chat window, with busy dots, attention badges and close controls.",
  },
  {
    slug: "chat-tray",
    group: "Conversation",
    description:
      "A single row of everything attached to the message being written, collapsing its tail into a count.",
    examples: [
      { id: "chat-tray-collapse", title: "collapseAfter names three chips before the count" },
    ],
  },
  {
    slug: "chat-overlay",
    group: "Conversation",
    description:
      "A reading view that takes over a chat's transcript while the tab strip and composer stay in use.",
  },
  {
    slug: "chat-annotations",
    group: "Conversation",
    description:
      "Passages lifted from a document and the reader's comments on them, read as short conversations.",
    examples: [
      { id: "chat-annotations-sent", title: "A sent message compressing its whole set into one chip" },
    ],
  },
  {
    slug: "conversation-history",
    group: "Conversation",
    description:
      "A searchable roster of conversations, each row painted from the avatar of its project.",
  },
  {
    slug: "questionnaire",
    group: "Conversation",
    description:
      "A question flow of fieldsets, choices and free text, answered through a wrapping form.",
    examples: [
      {
        id: "questionnaire-mixed",
        title: "Multiple selection, a written answer and a progress bar",
      },
    ],
  },
  {
    slug: "reference",
    group: "Conversation",
    description: "An inline citation that opens its source card on hover or focus.",
  },
  {
    slug: "selection-tooltip",
    group: "Conversation",
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
    slug: "tool-call",
    group: "Agent",
    description:
      "A single tool invocation that expands into its input, output and touched files. The label shimmers while it runs.",
    examples: [
      { id: "tool-call-states", title: "Running, complete and error" },
    ],
  },
  {
    slug: "tool-approval",
    group: "Agent",
    description:
      "A permission request for a tool run. Setting a resolution makes the card inert.",
    examples: [
      { id: "tool-approval-flow", title: "Granting hands off to the running call" },
      { id: "tool-approval-notch", title: "Notch variant" },
      { id: "tool-approval-mobile", title: "Phone viewport" },
    ],
  },
  {
    slug: "task-list",
    group: "Agent",
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
    slug: "agent-activity",
    group: "Agent",
    description:
      "A collapsed cue for a stretch of agent work, opening its thinking and tool calls elsewhere.",
    examples: [
      { id: "agent-activity-card", title: "A live cue, and the card for a delegated run" },
    ],
  },
  {
    slug: "agent-details",
    group: "Agent",
    description:
      "A panel naming an agent conversation, with compact actions and a section of project fields.",
  },
  {
    slug: "generating-surface",
    group: "Agent",
    description:
      "A container that holds an ambient placeholder while content is generated, then morphs into it.",
  },
  {
    slug: "transcript-divider",
    group: "Agent",
    description:
      "A labelled hairline across a transcript, marking a day boundary, a model swap or a compaction.",
    examples: [
      { id: "transcript-divider-detail", title: "detail turns the label into a disclosure" },
    ],
  },
  {
    slug: "workflow-canvas",
    group: "Agent",
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

  {
    slug: "git-history",
    group: "Git",
    description:
      "A commit graph of host-supplied history. Rows virtualize by default; selection stays with the host.",
    examples: [
      {
        id: "git-history-branches",
        title: "An octopus merge, with a custom lane palette",
      },
    ],
  },
  {
    slug: "git-commit-details",
    group: "Git",
    description:
      "A sidebar for one commit: metadata, changed files and host-linked work. Passing null releases the space.",
    examples: [
      {
        id: "git-commit-details-history",
        title: "Selecting a row in Git history fills this panel",
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
      name: displayNames[slug] ?? sentenceName(entry.name),
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
