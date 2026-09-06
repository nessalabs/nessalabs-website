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
  ["input", "Input", "Primitives", "input"],
  ["checkbox", "Checkbox", "Primitives", "checkbox"],
  ["badge", "Badge", "Primitives", "badge"],
  ["card", "Card", "Primitives", "card"],
  ["tabs", "Tabs", "Primitives", "tabs"],
  ["segmented-control", "SegmentedControl", "Primitives", "segmented-control"],
  ["pagination", "Pagination", "Primitives", "pagination"],
  ["dropdown-menu", "DropdownMenu", "Primitives", "dropdown-menu"],
  ["context-menu", "ContextMenu", "Primitives", "context-menu"],
  ["popover-surface", "PopoverSurface", "Primitives", "popover-surface"],
  ["searchable-listbox", "SearchableListbox", "Primitives", "searchable-listbox"],
  ["sectioned-listbox", "SectionedListbox", "Primitives", "sectioned-listbox"],
  ["random-avatar", "RandomAvatar", "Primitives", "random-avatar"],
  ["gradient-surface", "GradientSurface", "Primitives", "gradient-surface"],
  ["morphing-mesh-gradient", "MorphingMeshGradient", "Primitives", "morphing-mesh-gradient"],

  // Layout
  ["app-shell", "AppShell", "Layout", "app-shell"],
  ["sidebar", "Sidebar", "Layout", "sidebar"],
  ["split-view", "SplitView", "Layout", "split-view"],
  ["window-deck", "WindowDeck", "Layout", "window-deck"],
  ["drawer", "Drawer", "Layout", "drawer"],
  ["sheet", "Sheet", "Layout", "sheet"],
  ["virtual-list", "VirtualList", "Layout", "virtual-list"],

  // Data
  ["table", "Table", "Data", "table"],
  ["kanban", "KanbanBoard", "Data", "kanban"],
  ["event-calendar", "EventCalendar", "Data", "event-calendar"],
  ["page-outline", "PageOutline", "Data", "page-outline"],
  ["json-tree", "JsonTree", "Data", "json-tree"],

  // Charts
  ["pie-chart", "PieChart", "Charts", "pie-chart"],
  ["radar-chart", "RadarChart", "Charts", "radar-chart"],
  ["flow-chart", "FlowChart", "Charts", "flow-chart"],
  ["price-chart", "PriceChart", "Charts", "price-chart"],
  ["stock-quote", "StockQuote", "Charts", "stock-quote"],
  ["gantt-chart", "GanttChart", "Charts", "gantt-chart"],
  ["timeline-header", "TimelineHeader", "Charts", "timeline-header"],
  ["mermaid-diagram", "MermaidDiagram", "Charts", "mermaid-diagram"],

  // Files
  ["code-block", "CodeBlock", "Files", "code-block"],
  ["message-markdown", "MessageMarkdown", "Files", "message-markdown"],
  ["math-block", "MathBlock", "Files", "math-block"],
  ["file-preview", "FilePreview", "Files", "file-preview"],
  ["file-drop-zone", "FileDropZone", "Files", "file-drop-zone"],
  ["file-diff-list", "FileDiffCard", "Files", "file-diff-list"],

  // Conversation
  ["message", "Message", "Conversation", "message"],
  ["message-scroller", "MessageScroller", "Conversation", "message-scroller"],
  ["conversation-rail", "ConversationRail", "Conversation", "conversation-rail"],
  ["chat-composer", "ChatComposer", "Conversation", "chat-composer"],
  ["chat-composer-editor", "ChatComposerEditor", "Conversation", "chat-composer-editor"],
  ["composer-queue", "ComposerQueue", "Conversation", "composer-queue"],
  ["composer-access-mode", "ComposerAccessMode", "Conversation", "composer-access-mode"],
  ["model-picker", "ModelPicker", "Conversation", "model-picker"],
  ["model-capability-controls", "ModelThinkingControl", "Conversation", "model-capability-controls"],
  ["pill-composer", "PillComposer", "Conversation", "pill-composer"],
  ["chat-bubbles", "ChatBubbles", "Conversation", "chat-bubbles"],
  ["chat-tabs", "ChatTabs", "Conversation", "chat-tabs"],
  ["chat-tray", "ChatTray", "Conversation", "chat-tray"],
  ["chat-overlay", "ChatOverlay", "Conversation", "chat-overlay"],
  ["chat-annotations", "ChatAnnotations", "Conversation", "chat-annotations"],
  ["conversation-history", "ConversationHistory", "Conversation", "conversation-history"],
  ["questionnaire", "Questionnaire", "Conversation", "questionnaire"],
  ["reference", "Reference", "Conversation", "reference"],
  ["selection-tooltip", "SelectionTooltip", "Conversation", "selection-tooltip"],

  // Agent
  ["tool-call", "ToolCall", "Agent", "tool-call"],
  ["tool-approval", "ToolApproval", "Agent", "tool-approval"],
  ["task-list", "TaskList", "Agent", "task-list"],
  ["agent-activity", "AgentActivity", "Agent", "agent-activity"],
  ["agent-details", "AgentDetails", "Agent", "agent-details"],
  ["generating-surface", "GeneratingSurface", "Agent", "generating-surface"],
  ["transcript-divider", "TranscriptDivider", "Agent", "transcript-divider"],
  ["workflow-canvas", "WorkflowCanvas", "Agent", "workflow-canvas"],

  // Git
  ["git-history", "GitHistory", "Git", "git-history"],
  ["git-commit-details", "GitCommitDetails", "Git", "git-commit-details"],
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
