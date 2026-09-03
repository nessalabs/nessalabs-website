/**
 * Builds registry/index.generated.ts from the vendored library and the
 * storybook descriptions, so the docs list what @nessa-ui/react actually
 * exports and describe it in the library's own words.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const storyDocs = JSON.parse(
  readFileSync(join(root, "registry/story-docs.generated.json"), "utf8")
);

/** slug → { name, group, story, parts } — the docs' spine. */
const catalog = [
  // Primitives
  ["button", "Button", "Primitives", "button"],
  ["badge", "Badge", "Primitives", "badge"],
  ["card", "Card", "Primitives", "card"],
  ["input", "Input", "Primitives", "input"],
  ["segmented-control", "SegmentedControl", "Primitives", "segmented-control"],
  ["random-avatar", "RandomAvatar", "Primitives", "random-avatar"],
  ["checkbox", "Checkbox", "Primitives", "checkbox"],
  ["pagination", "Pagination", "Primitives", "pagination"],
  ["timeline-header", "TimelineHeader", "Primitives", "timeline-header"],
  ["popover-surface", "PopoverSurface", "Primitives", "popover-surface"],
  ["tabs", "Tabs", "Primitives", "tabs"],
  ["task-list", "TaskList", "Primitives", "task-list"],
  ["gradient-surface", "GradientSurface", "Primitives", "gradient-surface"],

  // Listboxes & menus
  ["searchable-listbox", "SearchableListbox", "Navigation", "searchable-listbox"],
  ["sectioned-listbox", "SectionedListbox", "Navigation", "sectioned-listbox"],
  ["context-menu", "ContextMenu", "Navigation", "context-menu"],
  ["dropdown-menu", "DropdownMenu", "Navigation", "dropdown-menu"],
  ["conversation-rail", "ConversationRail", "Navigation", "conversation-rail"],
  ["sidebar", "Sidebar", "Navigation", "sidebar"],
  ["page-outline", "PageOutline", "Navigation", "page-outline"],
  ["drawer", "Drawer", "Navigation", "drawer"],
  ["sheet", "Sheet", "Navigation", "sheet"],

  // Content
  ["code-block", "CodeBlock", "Content", "code-block"],
  ["json-tree", "JsonTree", "Content", "json-tree"],
  ["math-block", "MathBlock", "Content", "math-block"],
  ["mermaid-diagram", "MermaidDiagram", "Content", "mermaid-diagram"],
  ["message-markdown", "MessageMarkdown", "Content", "message-markdown"],
  ["reference", "Reference", "Content", "reference"],
  ["selection-tooltip", "SelectionTooltip", "Content", "selection-tooltip"],
  ["file-diff-list", "FileDiffCard", "Content", "file-diff-list"],
  ["file-preview", "FilePreview", "Content", "file-preview"],
  ["file-drop-zone", "FileDropZone", "Content", "file-drop-zone"],

  // Charts
  ["pie-chart", "PieChart", "Charts", "pie-chart"],
  ["radar-chart", "RadarChart", "Charts", "radar-chart"],
  ["flow-chart", "FlowChart", "Charts", "flow-chart"],
  ["price-chart", "PriceChart", "Charts", "price-chart"],
  ["stock-quote", "StockQuote", "Charts", "stock-quote"],

  // Agent surfaces
  ["message", "Message", "Agent surfaces", "message"],
  ["message-scroller", "MessageScroller", "Agent surfaces", "message-scroller"],
  ["tool-call", "ToolCall", "Agent surfaces", "tool-call"],
  ["tool-approval", "ToolApproval", "Agent surfaces", "tool-approval"],
  ["chat-composer", "ChatComposer", "Agent surfaces", "chat-composer"],
  ["chat-composer-editor", "ChatComposerEditor", "Agent surfaces", "chat-composer-editor"],
  ["composer-queue", "ComposerQueue", "Agent surfaces", "composer-queue"],
  ["composer-access-mode", "ComposerAccessMode", "Agent surfaces", "composer-access-mode"],
  ["model-picker", "ModelPicker", "Agent surfaces", "model-picker"],
  ["model-capability-controls", "ModelThinkingControl", "Agent surfaces", "model-capability-controls"],
  ["generating-surface", "GeneratingSurface", "Agent surfaces", "generating-surface"],
  ["questionnaire", "Questionnaire", "Agent surfaces", "questionnaire"],
  ["agent-activity", "AgentActivity", "Agent surfaces", "agent-activity"],
  ["agent-details", "AgentDetails", "Agent surfaces", "agent-details"],
  ["conversation-history", "ConversationHistory", "Agent surfaces", "conversation-history"],
  ["transcript-divider", "TranscriptDivider", "Agent surfaces", "transcript-divider"],

  // Chat surfaces
  ["pill-composer", "PillComposer", "Chat surfaces", "pill-composer"],
  ["chat-bubbles", "ChatBubbles", "Chat surfaces", "chat-bubbles"],
  ["chat-tabs", "ChatTabs", "Chat surfaces", "chat-tabs"],
  ["chat-tray", "ChatTray", "Chat surfaces", "chat-tray"],
  ["chat-overlay", "ChatOverlay", "Chat surfaces", "chat-overlay"],
  ["chat-annotations", "ChatAnnotations", "Chat surfaces", "chat-annotations"],

  // Composites
  ["app-shell", "AppShell", "Composites", "app-shell"],
  ["split-view", "SplitView", "Composites", "split-view"],
  ["event-calendar", "EventCalendar", "Composites", "event-calendar"],
  ["gantt-chart", "GanttChart", "Composites", "gantt-chart"],
  ["kanban", "KanbanBoard", "Composites", "kanban"],
  ["table", "Table", "Composites", "table"],
  ["workflow-canvas", "WorkflowCanvas", "Composites", "workflow-canvas"],
];

const entries = catalog.map(([slug, name, group, story]) => {
  const docs = storyDocs[story] ?? {};
  return {
    slug,
    name,
    group,
    description: docs.description ?? "",
    /** Story names carry the behaviours worth showing. */
    stories: (docs.stories ?? []).map((s) => ({ name: s.name, note: s.note })),
  };
});

const file = `// Generated by scripts/build-registry.mjs. Do not edit.
// Descriptions come from the nessa-ui storybook, so the docs use the library's
// own words. Examples and props live in registry/index.ts.

export interface StoryNote {
  name: string;
  note: string | null;
}

export interface CatalogEntry {
  slug: string;
  name: string;
  group: string;
  description: string;
  stories: StoryNote[];
}

export const catalog: CatalogEntry[] = ${JSON.stringify(entries, null, 2)};
`;

writeFileSync(join(root, "registry/index.generated.ts"), file);
console.log(`built catalog of ${entries.length} components`);
