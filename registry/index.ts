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
  /** One line. What it is, and the behaviour worth knowing. */
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
    description: "Action button. Six variants, four sizes, icon-aware spacing.",
  },
  {
    slug: "badge",
    group: "Primitives",
    description: "Compact status marker in four variants.",
  },
  {
    slug: "card",
    group: "Primitives",
    description: "Bordered surface with header, content, footer and action slots.",
  },
  {
    slug: "input",
    group: "Primitives",
    description: "Single-line text field.",
  },
  {
    slug: "segmented-control",
    group: "Primitives",
    description: "Exclusive option row. Arrow keys move between options.",
  },

  {
    slug: "code-block",
    group: "Content",
    description: "Syntax-highlighted code with copy. Themed through CodeBlockProvider.",
  },
  {
    slug: "json-tree",
    group: "Content",
    description: "Structured JSON view. Optional per-branch collapse.",
    examples: [{ id: "json-tree-collapsible", title: "Collapsible branches" }],
  },
  {
    slug: "math-block",
    group: "Content",
    description: "KaTeX formula. Holds the last valid render while TeX streams in.",
  },
  {
    slug: "mermaid-diagram",
    group: "Content",
    description: "Mermaid source rendered to a diagram. Follows the app's color mode.",
  },
  {
    slug: "message-markdown",
    group: "Content",
    description: "Markdown for message bodies. Composes CodeBlock and MathBlock.",
  },
  {
    slug: "reference",
    group: "Content",
    description: "Inline citation. Hover or focus opens the source card.",
  },
  {
    slug: "selection-tooltip",
    group: "Content",
    description: "Action pill for selected text. Overflow actions live in a scrolling shelf.",
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
    description: "Changed-file summary with per-file stats and a collapse toggle.",
    examples: [
      { id: "file-diff-scroll", title: "Twelve files, collapsed and scrollable" },
    ],
  },

  {
    slug: "conversation-rail",
    group: "Agent surfaces",
    description:
      "Turn navigator beside a transcript. Markers widen toward the pointer; hover or focus opens a preview.",
  },
  {
    slug: "message",
    group: "Agent surfaces",
    description: "Transcript row. Assistant and user sides, with avatar, bubble and footer parts.",
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
      "One tool invocation. Expands into input, output and touched files; the label shimmers while running.",
    examples: [
      { id: "tool-call-states", title: "Running, complete and error" },
    ],
  },
  {
    slug: "tool-approval",
    group: "Agent surfaces",
    description: "Permission request for a tool run. Setting `resolution` makes the card inert.",
    examples: [
      { id: "tool-approval-flow", title: "Granting hands off to the running call" },
      { id: "tool-approval-notch", title: "Notch variant" },
      { id: "tool-approval-mobile", title: "Phone viewport" },
    ],
  },
  {
    slug: "chat-composer",
    group: "Agent surfaces",
    description: "Chat entry surface. Input, footer actions, attachments, submit.",
    examples: [
      {
        id: "chat-composer-full",
        title: "Attachments, / and @ menus, model and thinking controls",
      },
    ],
  },
  {
    slug: "composer-queue",
    group: "Agent surfaces",
    description: "Pending messages for a running turn. Reorderable, steerable, removable.",
  },
  {
    slug: "model-picker",
    group: "Agent surfaces",
    description: "Provider-grouped model chooser with search.",
  },

  {
    slug: "event-calendar",
    group: "Composites",
    description:
      "Day, week and month scheduling. Drag to create, move and resize events.",
  },
  {
    slug: "gantt-chart",
    group: "Composites",
    description:
      "Project timeline with summary roll-ups, milestones and dependency arrows. Bars reschedule by drag or keyboard.",
  },
  {
    slug: "split-view",
    group: "Composites",
    description:
      "Resizable panels around a draggable separator. Arrow keys resize from the keyboard.",
  },
  {
    slug: "kanban",
    group: "Composites",
    description: "Board of columns and draggable cards. Moves report through onCardMove.",
  },
  {
    slug: "workflow-canvas",
    group: "Composites",
    description: "Pan-and-zoom node graph. Drag nodes, draw edges, delete with the keyboard.",
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
