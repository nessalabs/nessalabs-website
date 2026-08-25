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
  description: string;
  group: Group;
  /** Extra previews, keyed by preview id. */
  examples?: { id: string; title: string }[];
  /** Behaviours the library's own storybook demonstrates. */
  stories?: { name: string; note: string | null }[];
}

/** Slugs the site currently documents, in sidebar order. */
const documented: { slug: string; group: Group; examples?: { id: string; title: string }[] }[] = [
  { slug: "button", group: "Primitives" },
  { slug: "badge", group: "Primitives" },
  { slug: "card", group: "Primitives" },
  { slug: "input", group: "Primitives" },
  { slug: "segmented-control", group: "Primitives" },

  { slug: "code-block", group: "Content" },
  {
    slug: "json-tree",
    group: "Content",
    examples: [{ id: "json-tree-collapsible", title: "Collapsible branches" }],
  },
  { slug: "math-block", group: "Content" },
  { slug: "message-markdown", group: "Content" },
  { slug: "reference", group: "Content" },
  { slug: "file-diff-list", group: "Content" },

  { slug: "message", group: "Agent surfaces" },
  {
    slug: "tool-call",
    group: "Agent surfaces",
    examples: [
      { id: "tool-call-states", title: "Running, complete and error" },
    ],
  },
  { slug: "tool-approval", group: "Agent surfaces" },
  { slug: "chat-composer", group: "Agent surfaces" },
  { slug: "composer-queue", group: "Agent surfaces" },
  { slug: "model-picker", group: "Agent surfaces" },

  {
    slug: "event-calendar",
    group: "Composites",
    examples: [
      { id: "event-calendar-day", title: "Day view" },
      { id: "event-calendar-month", title: "Month view" },
    ],
  },
  {
    slug: "gantt-chart",
    group: "Composites",
    examples: [
      { id: "gantt-chart-day", title: "Day scale" },
      { id: "gantt-chart-month", title: "Month scale" },
    ],
  },
  { slug: "kanban", group: "Composites" },
  { slug: "workflow-canvas", group: "Composites" },
];

export const registry: ComponentDoc[] = documented.map(
  ({ slug, group, examples }) => {
    const entry = catalog.find((item) => item.slug === slug);
    if (!entry) throw new Error(`No catalog entry for ${slug}`);
    return {
      slug,
      name: entry.name,
      description: entry.description,
      group,
      examples,
      stories: entry.stories,
    };
  }
);

export function getComponent(slug: string) {
  return registry.find((c) => c.slug === slug);
}
