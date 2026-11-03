---
id: inventory
title: Component inventory
kind: guide
status: implemented
summary: "An exhaustive route and example inventory separates site composition from upstream behavior."
parent: website
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks: {}
sources:
  - registry/index.ts
  - registry/previews.tsx
  - registry/index.generated.ts
---

# Map every published component route

All 71 registered component routes at the frozen source checkpoint are listed below. This is an ownership/route inventory, not a claim that every upstream interaction was re-tested. The website descriptions and examples are authored in registry/index.ts, live previews in registry/previews.tsx, and family demos under registry/demos.

| Family       | Component route                                                | Example IDs                                                           |
| ------------ | -------------------------------------------------------------- | --------------------------------------------------------------------- |
| Primitives   | `/ui/components/button` (Button)                               |                                                                       |
| Primitives   | `/ui/components/input` (Input)                                 |                                                                       |
| Primitives   | `/ui/components/checkbox` (Checkbox)                           | `checkbox-states`                                                     |
| Primitives   | `/ui/components/badge` (Badge)                                 |                                                                       |
| Primitives   | `/ui/components/card` (Card)                                   |                                                                       |
| Primitives   | `/ui/components/tabs` (Tabs)                                   | `tabs-pill`                                                           |
| Primitives   | `/ui/components/segmented-control` (Segmented control)         |                                                                       |
| Primitives   | `/ui/components/pagination` (Pagination)                       |                                                                       |
| Primitives   | `/ui/components/dropdown-menu` (Dropdown menu)                 |                                                                       |
| Primitives   | `/ui/components/context-menu` (Context menu)                   |                                                                       |
| Primitives   | `/ui/components/popover-surface` (Popover)                     | `popover-surface-variants`                                            |
| Primitives   | `/ui/components/searchable-listbox` (Listbox)                  |                                                                       |
| Primitives   | `/ui/components/sectioned-listbox` (Sectioned listbox)         |                                                                       |
| Primitives   | `/ui/components/random-avatar` (Avatar)                        | `random-avatar-group`, `random-avatar-working`, `random-avatar-tones` |
| Primitives   | `/ui/components/gradient-surface` (Gradient)                   | `gradient-surface-palettes`, `gradient-surface-patterns`              |
| Primitives   | `/ui/components/morphing-mesh-gradient` (Mesh gradient)        | `morphing-mesh-gradient-presets`, `morphing-mesh-gradient-types`      |
| Layout       | `/ui/components/app-shell` (App shell)                         |                                                                       |
| Layout       | `/ui/components/sidebar` (Sidebar)                             |                                                                       |
| Layout       | `/ui/components/split-view` (Split view)                       | `split-view-workspace`                                                |
| Layout       | `/ui/components/window-deck` (Window deck)                     | `window-deck-photos`, `window-deck-workspaces`                        |
| Layout       | `/ui/components/drawer` (Drawer)                               | `drawer-resizable`                                                    |
| Layout       | `/ui/components/sheet` (Sheet)                                 | `sheet-contained`                                                     |
| Layout       | `/ui/components/virtual-list` (Virtual list)                   | `virtual-list-all`                                                    |
| Data         | `/ui/components/table` (Table)                                 | `table-workbench`, `table-pagination`, `table-empty`                  |
| Data         | `/ui/components/kanban` (Kanban)                               |                                                                       |
| Data         | `/ui/components/event-calendar` (Calendar)                     |                                                                       |
| Data         | `/ui/components/page-outline` (Page outline)                   | `page-outline-collapse`, `page-outline-marker`                        |
| Data         | `/ui/components/json-tree` (JSON tree)                         | `json-tree-collapsible`                                               |
| Charts       | `/ui/components/pie-chart` (Pie chart)                         | `pie-chart-donut`, `pie-chart-gauge`                                  |
| Charts       | `/ui/components/radar-chart` (Radar chart)                     | `radar-chart-per-axis`                                                |
| Charts       | `/ui/components/flow-chart` (Flow chart)                       | `flow-chart-vertical`                                                 |
| Charts       | `/ui/components/price-chart` (Price chart)                     | `price-chart-candles`, `price-chart-sparklines`                       |
| Charts       | `/ui/components/stock-quote` (Stock quote)                     |                                                                       |
| Charts       | `/ui/components/gantt-chart` (Gantt chart)                     | `gantt-chart-planning`                                                |
| Charts       | `/ui/components/timeline-header` (Timeline)                    |                                                                       |
| Charts       | `/ui/components/mermaid-diagram` (Mermaid)                     |                                                                       |
| Files        | `/ui/components/code-block` (Code block)                       |                                                                       |
| Files        | `/ui/components/message-markdown` (Markdown)                   |                                                                       |
| Files        | `/ui/components/math-block` (Math)                             |                                                                       |
| Files        | `/ui/components/file-preview` (File preview)                   | `file-preview-fallback`                                               |
| Files        | `/ui/components/file-drop-zone` (File drop)                    | `file-drop-zone-limits`                                               |
| Files        | `/ui/components/file-diff-list` (File diff)                    | `file-diff-scroll`                                                    |
| Conversation | `/ui/components/message` (Message)                             | `message-streaming`, `message-rich-streaming`                         |
| Conversation | `/ui/components/message-scroller` (Message scroller)           |                                                                       |
| Conversation | `/ui/components/conversation-rail` (Conversation rail)         |                                                                       |
| Conversation | `/ui/components/chat-composer` (Composer)                      | `chat-composer-full`, `chat-composer-inline`                          |
| Conversation | `/ui/components/chat-composer-editor` (Composer editor)        |                                                                       |
| Conversation | `/ui/components/composer-queue` (Composer queue)               |                                                                       |
| Conversation | `/ui/components/composer-access-mode` (Access mode)            |                                                                       |
| Conversation | `/ui/components/model-picker` (Model picker)                   |                                                                       |
| Conversation | `/ui/components/model-capability-controls` (Thinking controls) | `model-thinking-slider`                                               |
| Conversation | `/ui/components/pill-composer` (Pill composer)                 |                                                                       |
| Conversation | `/ui/components/chat-bubbles` (Chat bubbles)                   | `chat-bubbles-typing`                                                 |
| Conversation | `/ui/components/chat-tabs` (Chat tabs)                         |                                                                       |
| Conversation | `/ui/components/chat-tray` (Chat tray)                         | `chat-tray-collapse`                                                  |
| Conversation | `/ui/components/chat-overlay` (Chat overlay)                   |                                                                       |
| Conversation | `/ui/components/chat-annotations` (Chat annotations)           | `chat-annotations-sent`                                               |
| Conversation | `/ui/components/conversation-history` (Conversation history)   |                                                                       |
| Conversation | `/ui/components/questionnaire` (Questionnaire)                 | `questionnaire-mixed`                                                 |
| Conversation | `/ui/components/reference` (Reference)                         |                                                                       |
| Conversation | `/ui/components/selection-tooltip` (Selection tooltip)         | `selection-tooltip-shelf`                                             |
| Agent        | `/ui/components/tool-call` (Tool call)                         | `tool-call-states`                                                    |
| Agent        | `/ui/components/tool-approval` (Tool approval)                 | `tool-approval-flow`, `tool-approval-notch`, `tool-approval-mobile`   |
| Agent        | `/ui/components/task-list` (Task list)                         | `task-list-checklist`                                                 |
| Agent        | `/ui/components/agent-activity` (Agent activity)               | `agent-activity-card`                                                 |
| Agent        | `/ui/components/agent-details` (Agent details)                 |                                                                       |
| Agent        | `/ui/components/generating-surface` (Generating surface)       |                                                                       |
| Agent        | `/ui/components/transcript-divider` (Transcript divider)       | `transcript-divider-detail`                                           |
| Agent        | `/ui/components/workflow-canvas` (Workflow canvas)             | `workflow-canvas-nested`, `workflow-canvas-palette`                   |
| Git          | `/ui/components/git-history` (Git history)                     | `git-history-branches`                                                |
| Git          | `/ui/components/git-commit-details` (Commit details)           | `git-commit-details-history`                                          |

## Other owners

app owns all routes and the one pricing API. components/site owns navigation, theme, source surfaces and pricing/harness presentation. lib owns pricing/query/money/date/highlight helpers. registry owns catalogue metadata, examples, fixture assets and generated snippets. nessa-ui and agent-stream are vendored upstream. public contains static icons, not an installable component registry. scripts owns sync/extraction/generation. No authenticated database, provider execution, account persistence or background agent service is implemented by this website.
