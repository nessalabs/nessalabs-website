import { catalog } from "./index.generated";

export const groups = [
  "Primitives",
  "Content",
  "Agent surfaces",
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
    slug: "event-calendar",
    group: "Composites",
    description:
      "A day, week and month scheduler. Events are created, moved and resized by drag.",
  },
  {
    slug: "gantt-chart",
    group: "Composites",
    description:
      "A project timeline with summary roll-ups, milestones and dependency arrows. Bars reschedule by drag or keyboard.",
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
