"use client";

import * as React from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  Columns2,
  Copy,
  Database,
  FileCode,
  FileJson,
  FileSearch,
  FileText,
  KanbanSquare,
  LogOut,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Rows2,
  Mic,
  Pencil,
  Rocket,
  RotateCcw,
  Settings,
  Sparkles,
  Terminal as TerminalIcon,
  Workflow,
  X,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/cn";
import { SourceBlock } from "@/components/site/source-block";
import { ThinkingIcon } from "../story-support/icons/nucleo";
import {
  AppShell,
  AppShellBody,
  AppShellDock,
  AppShellDockSide,
  AppShellMain,
  AppShellPaneDragHandle,
  AppShellWorkspace,
  Button,
  ChatComposer,
  ChatComposerAction,
  ChatComposerActions,
  ChatComposerAttachment,
  ChatComposerAttachments,
  ChatComposerEditor,
  ChatComposerFooter,
  ChatComposerSubmit,
  ChatComposerTrigger,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
  ComposerAccessMode,
  DiffStat,
  FileDiffCard,
  FileDiffCardHeader,
  FileDiffCardHeading,
  FileDiffCardTitle,
  FileDiffList,
  FileDiffListItem,
  FileDiffListToggle,
  FileDiffPath,
  MathBlock,
  MermaidDiagram,
  MessageMarkdown,
  Reference,
  ReferenceCard,
  ReferenceContent,
  ReferenceTrigger,
  ConversationRail,
  ConversationRailItem,
  ConversationRailMarker,
  ConversationRailPreview,
  ConversationRailTrigger,
  EventCalendar,
  EventCalendarGrid,
  EventCalendarToolbar,
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  KanbanColumnHandle,
  KanbanColumnList,
  Message,
  MessageAction,
  MessageActions,
  MessageBubble,
  MessageContent,
  MessageFooter,
  MessageStreamText,
  ModelPicker,
  ModelThinkingControl,
  PaneSplitDirection,
  SectionedListbox,
  SegmentedControl,
  SegmentedControlOption,
  WorkflowCanvas,
  WorkflowCanvasEdge,
  WorkflowCanvasEdges,
  WorkflowCanvasGrid,
  WorkflowCanvasNode,
  WorkflowCanvasNodeHandle,
  WorkflowCanvasSurface,
  applyKanbanMove,
  ToolCall,
  ToolCallContent,
  ToolCallTabs,
  ToolCallTrigger,
  createAppShellLayout,
  useAppShell,
  type ChatComposerEditorHandle,
  type ComposerAccessModeValue,
  type ModelPickerGroup,
  type ModelPickerValue,
  type AppShellLayout,
  type EventCalendarEvent,
  type PaneNode,
  type SectionedListboxSection,
} from "@nessa-ui/react";

/* ── data ──────────────────────────────────────────────────────────────── */

/**
 * Rich reply content. An assistant turn is either plain prose or a sequence of
 * these, so one thread can show markdown, code, diagrams, formulas, citations
 * and diffs without a bespoke renderer per thread.
 */
type Block =
  | { kind: "markdown"; value: string }
  | { kind: "code"; lang: string; value: string }
  | { kind: "mermaid"; value: string }
  | { kind: "math"; value: string }
  | { kind: "diff"; files: { path: string; additions: number; deletions: number }[] }
  | {
      kind: "reference";
      before: string;
      after: string;
      source: { title: string; excerpt: string; meta: string };
    };

interface Turn {
  role: "user" | "assistant" | "tool";
  blocks?: Block[];
  text?: string;
  name?: string;
  meta?: string;
  status?: "complete" | "running" | "error";
  output?: string;
  streaming?: boolean;
}

interface Thread {
  id: string;
  title: string;
  turns: Turn[];
}

const threads: Thread[] = [
  {
    id: "chat:tour",
    title: "What nessa-ui covers",
    turns: [
      {
        role: "user",
        text: "Give me the tour. What does @nessa-ui/react actually cover, and what am I still expected to write myself?",
      },
      {
        role: "assistant",
        blocks: [
          {
            kind: "markdown",
            value: [
              "Three layers, and only the first two are ours.",
              "",
              "| Layer | Ships in the package | You own |",
              "| --- | --- | --- |",
              "| Primitives | Button, Input, Badge, Card, SegmentedControl | palette, radius, density |",
              "| Agent surfaces | Message, ToolCall, ToolApproval, ChatComposer, ConversationRail | copy, model list, policy |",
              "| Workspaces | AppShell, SplitView, Kanban, EventCalendar, WorkflowCanvas | data, persistence |",
              "",
              "Every surface is a compound component with `data-slot` attributes, so",
              "restyling is a class away and nothing is locked behind a variant prop.",
            ].join("\n"),
          },
        ],
      },
      {
        role: "user",
        text: "Show me the smallest chat surface I can ship.",
      },
      {
        role: "tool",
        name: "read_file",
        meta: "path=packages/react/src/components/message.tsx",
        status: "complete",
        output:
          "export function Message({ from, ...props })\nexport function MessageContent(props)\nexport function MessageBubble({ variant, streaming, ...props })\nexport function MessageFooter(props)\nexport function MessageActions(props)",
      },
      {
        role: "assistant",
        blocks: [
          { kind: "markdown", value: "Five components, no provider, no context:" },
          {
            kind: "code",
            lang: "tsx",
            value: [
              'import { Message, MessageBubble, MessageContent } from "@nessa-ui/react";',
              "",
              "export function Transcript({ turns }: { turns: Turn[] }) {",
              "  return (",
              '    <div role="log" className="flex flex-col gap-3">',
              "      {turns.map((turn, i) => (",
              "        <Message key={i} from={turn.role}>",
              "          <MessageContent>",
              '            <MessageBubble variant={turn.role === "user" ? "primary" : "plain"}>',
              "              {turn.text}",
              "            </MessageBubble>",
              "          </MessageContent>",
              "        </Message>",
              "      ))}",
              "    </div>",
              "  );",
              "}",
            ].join("\n"),
          },
          {
            kind: "markdown",
            value:
              "Alignment, bubble shape, hover actions and the streaming fade come from the slots. Swap `variant` and it is still your palette.",
          },
        ],
      },
      {
        role: "user",
        text: "How does streaming text land? Does the whole transcript re-render per token?",
      },
      {
        role: "assistant",
        blocks: [
          {
            kind: "markdown",
            value:
              "No. New text mounts inside per-word spans that fade from transparent; already-painted words keep their DOM nodes, so the work per token is proportional to the tail, not the transcript:",
          },
          {
            kind: "math",
            value: String.raw`\text{work}(t) \;=\; O\!\left(w_{\text{new}}(t)\right) \quad\text{not}\quad O\!\left(\sum_{i=1}^{n} w_i\right)`,
          },
          {
            kind: "markdown",
            value:
              "Code, math and diagram nodes are excluded from the fade wrapper, so a half-parsed fence never animates character by character.",
          },
        ],
      },
      {
        role: "user",
        text: "Draw me the render pipeline for a streamed markdown reply.",
      },
      {
        role: "assistant",
        blocks: [
          {
            kind: "mermaid",
            value: [
              "flowchart LR",
              "  A[Token stream] --> B[MessageMarkdown]",
              "  B --> C{Node type}",
              "  C -- prose --> D[Word spans fade in]",
              "  C -- fence --> E[CodeBlock]",
              "  C -- $$ --> F[MathBlock]",
              "  C -- mermaid --> G[MermaidDiagram]",
              "  D --> H[MessageBubble]",
              "  E --> H",
              "  F --> H",
              "  G --> H",
            ].join("\n"),
          },
          {
            kind: "markdown",
            value:
              "`MathBlock` holds the last valid render while intermediate TeX is unparseable, which is why formulas grow instead of flashing an error.",
          },
        ],
      },
      {
        role: "user",
        text: "Our retrieval answers cite sources. Can the transcript carry citations and the scoring maths together?",
      },
      {
        role: "assistant",
        blocks: [
          {
            kind: "reference",
            before: "Ranking is plain cosine similarity over normalised embeddings",
            after: "so a citation is just a hover target inside the sentence it supports.",
            source: {
              title: "retrieval/rerank.ts",
              excerpt: "score = dot(q, d) / (norm(q) * norm(d)) // cross-encoder applied above 0.4",
              meta: "lines 41-58",
            },
          },
          {
            kind: "math",
            value: String.raw`\text{sim}(q, d) = \frac{q \cdot d}{\lVert q \rVert \, \lVert d \rVert}, \qquad p_i = \frac{e^{s_i / \tau}}{\sum_j e^{s_j / \tau}}`,
          },
        ],
      },
      {
        role: "user",
        text: "Show me what landed in the last release.",
      },
      {
        role: "tool",
        name: "git_diff",
        meta: "range=v0.8.2..v0.9.0",
        status: "complete",
        output:
          "9 files changed\n+284 -137\nconversation-rail.tsx (new)\nworkflow-canvas/node.tsx\nevent-calendar.tsx",
      },
      {
        role: "assistant",
        blocks: [
          {
            kind: "diff",
            files: [
              { path: "packages/react/src/components/conversation-rail.tsx", additions: 148, deletions: 0 },
              { path: "packages/react/src/components/workflow-canvas/node.tsx", additions: 62, deletions: 41 },
              { path: "packages/react/src/components/event-calendar.tsx", additions: 34, deletions: 58 },
              { path: "packages/react/src/components/message.tsx", additions: 21, deletions: 12 },
              { path: "packages/react/src/index.ts", additions: 6, deletions: 1 },
              { path: "docs/agent-surfaces.md", additions: 13, deletions: 25 },
            ],
          },
          {
            kind: "markdown",
            value:
              "`ConversationRail` is the headline: turn markers beside the transcript that widen toward the pointer and preview on hover. It is in this pane, to the left, once the pane is wide enough for it.",
          },
        ],
      },
      {
        role: "user",
        text: "So what is left for me to build?",
      },
      {
        role: "assistant",
        streaming: true,
        blocks: [
          {
            kind: "markdown",
            value: [
              "Your product. We hand you interaction and state:",
              "",
              "- keyboard and focus behaviour, including roving focus in lists and canvases",
              "- drag, drop and resize with commit semantics you can veto",
              "- streaming, queueing and cancellation in the composer",
              "- layout persistence for panes, docks and splits",
              "",
              "What we deliberately do not hand you is opinion. There is no brand colour,",
              "no mandated font, no copy. Tokens sit on `--nessa-*` variables, and every",
              "themed surface in this harness, including the eleven presets in Settings,",
              "is a variable swap rather than a fork.",
            ].join("\n"),
          },
        ],
      },
    ],
  },
  {
    "id": "chat:retrieval",
    "title": "Retrieval recall drop",
    "turns": [
      {
        "role": "user",
        "text": "Why did retrieval recall drop from 92% to 87% in the last eval run?"
      },
      {
        "role": "tool",
        "name": "search_runs",
        "meta": "suite=retrieval, last=5",
        "status": "complete",
        "output": "Run 4189: 92.1% recall (2026-08-20)\nRun 4190: 90.8% recall (2026-08-21)\nRun 4191: 87.3% recall (2026-08-22)\nRun 4192: 86.9% recall (2026-08-23)"
      },
      {
        "role": "tool",
        "name": "query_warehouse",
        "meta": "table=run_metadata, runs=4189-4193",
        "status": "complete",
        "output": "4189: embed_model=v2.1, chunk_size=512\n4190: embed_model=v2.1, chunk_size=512\n4191: embed_model=v2.2, chunk_size=256\n4192: embed_model=v2.2, chunk_size=256"
      },
      {
        "role": "tool",
        "name": "read_file",
        "meta": "path=config/v2.2.yaml",
        "status": "complete",
        "output": "chunk_strategy: semantic_split\nmax_chunk_tokens: 256\nembedding_model: v2.2-ada\nrerank_threshold: 0.65"
      },
      {
        "role": "assistant",
        "text": "The drop tracks the v2.2 embedding model and 256 chunk size that landed in run 4191. The semantic_split strategy with tighter chunking cut context density. Worth testing chunk_size 512 against v2.2 to separate the model change from the chunking change."
      }
    ]
  },
  {
    "id": "chat:release",
    "title": "Release freeze window",
    "turns": [
      {
        "role": "user",
        "text": "When can we merge the new eval harness if a freeze is coming up?"
      },
      {
        "role": "tool",
        "name": "read_file",
        "meta": "path=RELEASE_SCHEDULE.md",
        "status": "complete",
        "output": "Release v1.8: 2026-08-25 (code freeze 2026-08-24)\nRelease v1.9: 2026-09-15 (code freeze 2026-09-01)\nHotfix window: 2026-08-26 to 2026-08-31"
      },
      {
        "role": "tool",
        "name": "git_diff",
        "meta": "branch=eval-harness, base=main",
        "status": "complete",
        "output": "173 files changed, 4521 insertions(+), 892 deletions(-)\nevaluation/harness.py, tests/eval_*.py, config/evals.yaml"
      },
      {
        "role": "assistant",
        "text": "The v1.8 freeze is tomorrow and this branch touches 173 files, so merging now carries real risk. Either land it before 2026-08-24 23:59 UTC or target v1.9, whose window opens 2026-09-01. Between those, 08-26 to 08-31 is hotfix only."
      },
      {
        "role": "user",
        "text": "What if we cherry-pick the core changes and defer the refactor?"
      },
      {
        "role": "tool",
        "name": "run_eval",
        "meta": "suite=core_harness, baseline=4182",
        "status": "running",
        "output": "Evaluating 12 checkpoints\n2 of 12 complete, ETA 8 min"
      },
      {
        "role": "assistant",
        "text": "Running the core harness against baseline 4182 now. If the next eight minutes come back clean, cherry-picking the evaluation core alone is safe for v1.8."
      }
    ]
  },
  {
    "id": "chat:flaky",
    "title": "Test suite flakiness",
    "turns": [
      {
        "role": "user",
        "text": "Integration tests keep failing intermittently. What is causing the flakes?"
      },
      {
        "role": "tool",
        "name": "tail_logs",
        "meta": "tests/integration, pattern=FAIL",
        "status": "complete",
        "output": "14:32:45 test_retrieval_timeout: expected 150ms, got 280ms\n14:28:12 test_cache_consistency: assertion mismatch\n14:22:31 test_retrieval_timeout: expected 150ms, got 310ms"
      },
      {
        "role": "tool",
        "name": "read_file",
        "meta": "path=tests/integration/test_retrieval.py",
        "status": "error",
        "output": "Error: no such file\nDid you mean tests/integration/retrieval_timeout.py?"
      },
      {
        "role": "tool",
        "name": "read_file",
        "meta": "path=tests/integration/retrieval_timeout.py",
        "status": "complete",
        "output": "def test_retrieval_timeout():\n    assert elapsed_ms < 150  # hardcoded threshold\n# note: warehouse latency varies 140-320ms"
      },
      {
        "role": "assistant",
        "text": "The 150ms threshold sits inside the warehouse latency range of 140 to 320ms, so the test fails whenever the warehouse is slow. Raise it to 350ms, or assert a percentile instead of an absolute bound."
      },
      {
        "role": "user",
        "text": "Is the cache consistency failure separate?"
      },
      {
        "role": "tool",
        "name": "run_eval",
        "meta": "suite=integration, runs=100, seed=42",
        "status": "complete",
        "output": "retrieval_timeout: 18 of 100 failed\ncache_consistency: 3 of 100 failed"
      },
      {
        "role": "assistant",
        "text": "Separate, and much rarer: 3% against 18%. Fix the timeout threshold first, then look at cache consistency on its own."
      }
    ]
  },
  {
    "id": "chat:latency",
    "title": "Inference endpoint cost",
    "turns": [
      {
        "role": "user",
        "text": "The inference endpoint is running hot. What is driving the cost?"
      },
      {
        "role": "tool",
        "name": "profile_endpoint",
        "meta": "inference-prod-v2, window=1h",
        "status": "complete",
        "output": "p50 latency 287ms\np99 latency 840ms\n14,200 requests/hour\nCPU 78%, GPU 92%"
      },
      {
        "role": "tool",
        "name": "query_warehouse",
        "meta": "table=endpoint_costs",
        "status": "complete",
        "output": "2026-08-20: $0.042 / 1k tokens\n2026-08-21: $0.041 / 1k tokens\n2026-08-22: $0.045 / 1k tokens\n2026-08-23: $0.048 / 1k tokens"
      },
      {
        "role": "tool",
        "name": "read_file",
        "meta": "path=config/inference-prod.yaml",
        "status": "complete",
        "output": "batch_size: 32\ncontext_window: 32k\ncache_ttl: 300s"
      },
      {
        "role": "assistant",
        "text": "GPU sits at 92% and cost per thousand tokens rose 14% in three days, from $0.042 to $0.048. A 32k context at batch size 32 maximises throughput but holds expensive GPU memory. Dropping to batch 16, or an 8k context, should bring cost per request down."
      },
      {
        "role": "user",
        "text": "How much would 8k context actually save?"
      },
      {
        "role": "tool",
        "name": "profile_endpoint",
        "meta": "inference-staging-8k, window=1h",
        "status": "running",
        "output": "Sampling requests against context_window=8k\n~3 min remaining"
      },
      {
        "role": "assistant",
        "text": "Profiling the 8k variant now. Cutting the context window usually takes 30 to 40% off memory cost and returns 8 to 15% on latency from fewer GPU operations."
      }
    ]
  }
];

const replies = [
  "Running a full regression pass to confirm this does not cascade into the other suites.",
  "Checking the deploy log to see whether config changed alongside that run.",
  "Pulling the failure-rate trend for the last week so we can prioritise.",
  "Worth an alert on latency percentiles so this surfaces sooner next time.",
  "That baseline holds. Comparing it against the previous checkpoint now.",
  "I will model the cost and latency tradeoff once profiling finishes."
];

interface SlashItem {
  id: string;
  kind: "skill" | "plugin";
  label: string;
  description: string;
  icon: React.ReactNode;
}

const slashSections: SectionedListboxSection<SlashItem>[] = [
  {
    id: "skills",
    label: "Skills",
    items: [
      { id: "eval", kind: "skill", label: "Eval suite", description: "run the harness", icon: <Sparkles /> },
      { id: "trace", kind: "skill", label: "Trace reader", description: "inspect a run", icon: <FileSearch /> },
    ],
  },
  {
    id: "plugins",
    label: "Plugins",
    items: [
      { id: "sql", kind: "plugin", label: "Warehouse SQL", description: "query metrics", icon: <Database /> },
      { id: "deploy", kind: "plugin", label: "Deploy", description: "ship a build", icon: <Rocket /> },
    ],
  },
];

const fileIcons: Record<string, React.ReactNode> = {
  ts: <FileCode className="text-sky-500" />,
  tsx: <FileCode className="text-sky-500" />,
  md: <FileText className="text-muted-foreground" />,
  json: <FileJson className="text-amber-500" />,
};

function fileIcon(path: string) {
  return fileIcons[path.split(".").pop() ?? ""] ?? <FileText />;
}

function matches(query: string, values: string[]) {
  const q = query.trim().toLowerCase();
  return !q || values.some((value) => value.toLowerCase().includes(q));
}

const thinkingLevels = [
  { value: "off", label: "Off" },
  { value: "light", label: "Light" },
  { value: "standard", label: "Standard" },
  { value: "deep", label: "Deep" },
];

function ModelAsset({ name, invert = false }: { name: string; invert?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/model-icons/${name}.svg`}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={invert ? "size-4 dark:invert" : "size-4"}
    />
  );
}

const harnessModels: ModelPickerGroup[] = [
  {
    id: "anthropic",
    label: "Anthropic",
    shortLabel: "Claude",
    icon: <ModelAsset name="claude-color" />,
    models: [
      { id: "opus", label: "Opus 5", description: "Deep reasoning", icon: <ModelAsset name="claude-color" /> },
      { id: "sonnet", label: "Sonnet 5", description: "Everyday work", icon: <ModelAsset name="claude-color" /> },
    ],
  },
  {
    id: "openai",
    label: "OpenAI",
    shortLabel: "GPT",
    icon: <ModelAsset name="openai" invert />,
    models: [
      { id: "codex", label: "Codex", description: "Agentic implementation", icon: <ModelAsset name="openai" invert /> },
    ],
  },
];
const files = [
  "packages/react/src/retrieval/index.ts",
  "packages/react/src/retrieval/encoder.ts",
  "apps/api/routes/search.ts",
  "docs/retrieval.md",
];


const views: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }> | null;
}[] = [
  ...threads.map((thread) => ({
    id: thread.id,
    label: thread.title,
    icon: null,
  })),
  { id: "view:board", label: "Board", icon: KanbanSquare },
  { id: "view:calendar", label: "Calendar", icon: Calendar },
  { id: "view:workflow", label: "Workflow", icon: Workflow },
];

/**
 * The edit field takes the shape of the message it replaces: full column width,
 * and tall enough for the text without scrolling.
 */
function AutosizeTextarea({
  value,
  onValueChange,
  onSubmit,
  onCancel,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.focus();
    // Caret at the end, so editing continues from where the sentence stopped.
    element.setSelectionRange(element.value.length, element.value.length);
  }, []);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Escape") onCancel();
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onSubmit();
        }
      }}
      aria-label="Edit message"
      rows={1}
      className="max-h-64 w-full resize-none overflow-y-auto rounded-2xl border border-border bg-background px-3.5 py-2.5 text-sm leading-6 outline-none focus:border-ring"
    />
  );
}

/** Copy swaps to a check for a moment, the way copy controls usually do. */
function CopyAction({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <MessageAction
      aria-label={copied ? "Copied" : "Copy message"}
      title={copied ? "Copied" : "Copy"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? (
        <Check aria-hidden className="size-3.5" />
      ) : (
        <Copy aria-hidden className="size-3.5" />
      )}
    </MessageAction>
  );
}

/* ── chat pane ─────────────────────────────────────────────────────────── */

/**
 * Rich reply content.
 *
 * Markdown, math and diagrams come straight from the library. Fenced code is
 * the one exception: nessa-ui's CodeBlock renders through Pierre's worker
 * engine, which does not paint inside this app yet, so the docs' own
 * highlighter stands in until it does.
 */
function TurnBlocks({
  blocks,
  streaming,
}: {
  blocks: Block[];
  streaming?: boolean;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "markdown":
            return (
              <MessageMarkdown key={index} streaming={streaming}>
                {block.value}
              </MessageMarkdown>
            );
          case "code":
            return (
              <SourceBlock
                key={index}
                code={block.value}
                lang={block.lang}
                className="bg-background"
              />
            );
          case "mermaid":
            return <MermaidDiagram key={index} chart={block.value} />;
          case "math":
            return <MathBlock key={index} tex={block.value} />;
          case "reference":
            return (
              <p key={index} className="text-sm leading-6">
                {block.before}{" "}
                <Reference>
                  <ReferenceTrigger>1</ReferenceTrigger>
                  <ReferenceContent>
                    <ReferenceCard sources={[block.source]} />
                  </ReferenceContent>
                </Reference>{" "}
                {block.after}
              </p>
            );
          case "diff":
            return (
              <FileDiffCard key={index} itemCount={block.files.length}>
                <FileDiffCardHeader>
                  <FileDiffCardHeading>
                    <FileDiffCardTitle>Changes</FileDiffCardTitle>
                  </FileDiffCardHeading>
                  <DiffStat
                    additions={block.files.reduce((n, f) => n + f.additions, 0)}
                    deletions={block.files.reduce((n, f) => n + f.deletions, 0)}
                  />
                  <FileDiffListToggle />
                </FileDiffCardHeader>
                <FileDiffList>
                  {block.files.map((file) => (
                    <FileDiffListItem key={file.path}>
                      <FileDiffPath path={file.path} />
                      <DiffStat
                        additions={file.additions}
                        deletions={file.deletions}
                      />
                    </FileDiffListItem>
                  ))}
                </FileDiffList>
              </FileDiffCard>
            );
        }
      })}
    </div>
  );
}

function ChatPane({ viewId }: { viewId: string }) {
  const thread = threads.find((entry) => entry.id === viewId) ?? threads[0];
  const [turns, setTurns] = React.useState<Turn[]>(thread.turns);
  const [draft, setDraft] = React.useState("");
  const [attachments, setAttachments] = React.useState<
    { id: string; name: string; kind: "file" | "skill" | "mention" }[]
  >([{ id: "a1", name: "run-4192.json", kind: "file" }]);
  const [model, setModel] = React.useState<ModelPickerValue>({
    providerId: "anthropic",
    modelId: "opus",
  });
  const [thinking, setThinking] = React.useState("standard");
  const [accessMode, setAccessMode] =
    React.useState<ComposerAccessModeValue>("ask-approval");
  const editorRef = React.useRef<ChatComposerEditorHandle>(null);
  const [editing, setEditing] = React.useState<number | null>(null);
  const [editDraft, setEditDraft] = React.useState("");
  const [activeTurn, setActiveTurn] = React.useState(0);
  const turnRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  React.useEffect(() => setTurns(thread.turns), [thread]);

  /** Editing a sent message drops everything after it and answers again. */
  function resend(index: number) {
    const text = editDraft.trim();
    if (!text) return;
    setTurns((current) => [
      ...current.slice(0, index),
      { role: "user", text },
      {
        role: "assistant",
        text: replies[index % replies.length],
        streaming: true,
      },
    ]);
    setEditing(null);
  }

  function send() {
    const text = draft.trim();
    if (!text) return;
    const reply = replies[turns.length % replies.length];
    setTurns((current) => [
      ...current,
      { role: "user", text },
      { role: "assistant", text: reply, streaming: true },
    ]);
    setDraft("");
    editorRef.current?.clear();
  }

  return (
    <>
      {/* A size container: the rail appears only when the pane is wide enough
          for it, and the transcript stops stretching past a comfortable
          measure instead of running the full width of a maximised pane. */}
      <div className="@container relative flex min-h-0 flex-1">
        <ConversationRail className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 @[34rem]:flex">
          {turns
            .map((turn, index) => ({ turn, index }))
            .filter(({ turn }) => turn.role === "user")
            .map(({ turn, index }) => (
              <ConversationRailItem key={index} active={index === activeTurn}>
                <ConversationRailTrigger
                  aria-label={turn.text ?? `Turn ${index + 1}`}
                  onClick={() => {
                    setActiveTurn(index);
                    turnRefs.current[index]?.scrollIntoView({
                      block: "center",
                      behavior: "smooth",
                    });
                  }}
                >
                  <ConversationRailMarker />
                </ConversationRailTrigger>
                <ConversationRailPreview>
                  <p className="m-0 line-clamp-2 text-muted-foreground">
                    {turn.text}
                  </p>
                </ConversationRailPreview>
              </ConversationRailItem>
            ))}
        </ConversationRail>

      <div
        role="log"
        aria-label={thread.title}
        tabIndex={0}
        className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-3 overflow-auto p-3 outline-none @[34rem]:ps-10"
      >
        {turns.map((turn, index) => {
          if (turn.role === "tool") {
            return (
              <ToolCall key={index} status={turn.status}>
                <ToolCallTrigger meta={turn.meta}>{turn.name}</ToolCallTrigger>
                {turn.output ? (
                  <ToolCallContent>
                    <ToolCallTabs output={turn.output} />
                  </ToolCallContent>
                ) : null}
              </ToolCall>
            );
          }

          if (turn.role === "assistant") {
            return (
              <Message key={index} from="assistant">
                <MessageContent>
                  <MessageBubble
                    variant="plain"
                    streaming={turn.streaming}
                    className={turn.blocks ? "w-full" : undefined}
                  >
                    {turn.blocks ? (
                      <TurnBlocks blocks={turn.blocks} streaming={turn.streaming} />
                    ) : turn.streaming ? (
                      <MessageStreamText text={turn.text ?? ""} />
                    ) : (
                      turn.text
                    )}
                  </MessageBubble>
                  {/* Actions stay hidden until the row is hovered or focused. */}
                  <MessageFooter>
                    <MessageActions>
                      <CopyAction text={turn.text ?? ""} />
                      <MessageAction aria-label="Retry" title="Retry">
                        <RotateCcw aria-hidden className="size-3.5" />
                      </MessageAction>
                      <span className="ms-1">
                        {TIMESTAMPS[index % TIMESTAMPS.length]}
                      </span>
                    </MessageActions>
                  </MessageFooter>
                </MessageContent>
              </Message>
            );
          }

          if (editing === index) {
            return (
              <Message key={index} from="user">
                <MessageContent>
                  <form
                    // MessageContent is items-end, so a child only fills the
                    // column when it asks for the width.
                    className="flex w-[32rem] max-w-full flex-col gap-2 self-stretch"
                    onSubmit={(event) => {
                      event.preventDefault();
                      resend(index);
                    }}
                  >
                    <AutosizeTextarea
                      value={editDraft}
                      onValueChange={setEditDraft}
                      onSubmit={() => resend(index)}
                      onCancel={() => setEditing(null)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        type="button"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" type="submit">
                        Send
                      </Button>
                    </div>
                  </form>
                </MessageContent>
              </Message>
            );
          }

          return (
            <Message
              key={index}
              from="user"
              ref={(element: HTMLDivElement | null) => {
                turnRefs.current[index] = element;
              }}
            >
              <MessageContent>
                <MessageBubble variant="primary">{turn.text}</MessageBubble>
                <MessageFooter className="justify-end">
                  <MessageActions>
                    <MessageAction
                      aria-label="Edit message"
                      title="Edit"
                      onClick={() => {
                        setEditing(index);
                        setEditDraft(turn.text ?? "");
                      }}
                    >
                      <Pencil aria-hidden className="size-3.5" />
                    </MessageAction>
                    <CopyAction text={turn.text ?? ""} />
                    <span className="ms-1">
                      {TIMESTAMPS[index % TIMESTAMPS.length]}
                    </span>
                  </MessageActions>
                </MessageFooter>
              </MessageContent>
            </Message>
          );
        })}
        </div>
      </div>

      <div className="mx-auto w-full max-w-3xl p-2">
        <ChatComposer
          size="compact"
          onSubmit={(event) => {
            event.preventDefault();
            send();
          }}
        >
          {attachments.length ? (
            <ChatComposerAttachments>
              {attachments.map((file) => (
                <ChatComposerAttachment
                  key={file.id}
                  itemLabel={file.name}
                  kind={file.kind}
                  onRemove={() =>
                    setAttachments((current) =>
                      current.filter((item) => item.id !== file.id)
                    )
                  }
                >
                  {file.name}
                </ChatComposerAttachment>
              ))}
            </ChatComposerAttachments>
          ) : null}

          {/* The editor, not the plain input: a chosen skill or file lands as
              an atomic inline chip instead of raw text. */}
          <ChatComposerEditor
            ref={editorRef}
            placeholder="Type / for skills, @ for files"
            onContentChange={(content) => setDraft(content.text)}
          />

          <ChatComposerTrigger trigger="/" label="Skills and plugins">
            {({ query, clearTrigger }) => (
              <SectionedListbox
                listLabel="Skills and plugins"
                sections={slashSections.map((section) => ({
                  ...section,
                  items: section.items.filter((item) =>
                    matches(query, [item.label, item.description])
                  ),
                }))}
                getItemId={(item) => item.id}
                emptyMessage="Nothing matches."
                onValueChange={(_value, item) => {
                  clearTrigger();
                  editorRef.current?.insertChip({
                    id: item.id,
                    label: item.label,
                    kind: item.kind,
                    // Without this the chip falls back to the kind's default
                    // glyph and stops matching the row that was chosen.
                    icon: item.icon,
                  });
                }}
                renderItem={(item) => (
                  <span className="grid min-h-11 w-full grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-2.5 px-2">
                    <span
                      aria-hidden="true"
                      className="flex size-6 items-center justify-center text-muted-foreground [&_svg]:size-4"
                    >
                      {item.icon}
                    </span>
                    <span className="min-w-0 truncate text-sm">
                      <span className="font-medium text-foreground">
                        {item.label}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        {item.description}
                      </span>
                    </span>
                  </span>
                )}
              />
            )}
          </ChatComposerTrigger>

          <ChatComposerTrigger trigger="@" label="Files">
            {({ query, clearTrigger }) => (
              <SectionedListbox
                listLabel="Files"
                sections={[
                  {
                    id: "files",
                    label: "Files",
                    items: files.filter((file) => matches(query, [file])),
                  },
                ]}
                getItemId={(file) => file}
                emptyMessage="No files match."
                onValueChange={(_value, file) => {
                  clearTrigger();
                  editorRef.current?.insertChip({
                    id: file,
                    label: file.split("/").pop() ?? file,
                    kind: "mention",
                    textValue: file,
                    icon: fileIcon(file),
                  });
                }}
                renderItem={(file) => (
                  <span className="grid min-h-10 w-full grid-cols-[1.75rem_minmax(0,1fr)] items-center gap-2.5 px-2">
                    <span
                      aria-hidden="true"
                      className="flex size-6 items-center justify-center [&_svg]:size-4"
                    >
                      {fileIcon(file)}
                    </span>
                    <span className="min-w-0 truncate font-mono text-xs">
                      <span className="text-foreground">
                        {file.split("/").pop()}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        {file.split("/").slice(0, -1).join("/")}
                      </span>
                    </span>
                  </span>
                )}
              />
            )}
          </ChatComposerTrigger>

          <ChatComposerFooter>
            <ChatComposerActions>
              <ChatComposerAction
                aria-label="Attach a file"
                title="Attach a file"
                onClick={() =>
                  setAttachments((current) => [
                    ...current,
                    {
                      id: `a${current.length + 1}`,
                      name: `trace-${current.length + 1}.log`,
                      kind: "file",
                    },
                  ])
                }
              >
                <Plus aria-hidden="true" />
              </ChatComposerAction>
              <ComposerAccessMode
                value={accessMode}
                onValueChange={setAccessMode}
              />
            </ChatComposerActions>

            <ChatComposerActions className="justify-end">
              <ModelPicker
                groups={harnessModels}
                value={model}
                onValueChange={setModel}
              />
              <ModelThinkingControl
                icon={<ThinkingIcon className="size-[18px]" />}
                levels={thinkingLevels}
                value={thinking}
                onValueChange={setThinking}
              />
              <ChatComposerAction aria-label="Start voice input" title="Start voice input">
                <Mic aria-hidden="true" />
              </ChatComposerAction>
              <ChatComposerSubmit disabled={!draft.trim()} />
            </ChatComposerActions>
          </ChatComposerFooter>
        </ChatComposer>
      </div>
    </>
  );
}

/* ── panes ─────────────────────────────────────────────────────────────── */

/* ── views ─────────────────────────────────────────────────────────────── */

const boardColumns = [
  { id: "triage", title: "Triage" },
  { id: "running", title: "Running" },
  { id: "review", title: "Review" },
  { id: "done", title: "Done" },
];

const boardCards: Record<string, { title: string; meta: string; owner: string }> = {
  "long-context": { title: "Long-context regression", meta: "bug", owner: "AL" },
  "tool-traces": { title: "Add tool-call traces", meta: "feature", owner: "GH" },
  "sweep-4192": { title: "Sweep 4192", meta: "eval · 12m", owner: "AT" },
  "index-rebuild": { title: "Rebuild retrieval index", meta: "infra · 4m", owner: "AL" },
  "safety-pass": { title: "Safety pass", meta: "eval", owner: "GH" },
  "checkpoint-4188": { title: "Checkpoint 4188", meta: "training", owner: "AT" },
  "docs-sprint": { title: "Docs sprint", meta: "docs", owner: "AL" },
};

const initialBoard: Record<string, readonly string[]> = {
  triage: ["long-context", "tool-traces"],
  running: ["sweep-4192", "index-rebuild"],
  review: ["safety-pass"],
  done: ["checkpoint-4188", "docs-sprint"],
};

function BoardView() {
  const [columns, setColumns] = React.useState(initialBoard);
  const [order, setOrder] = React.useState(boardColumns.map((c) => c.id));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
        <span>Sprint 24</span>
        <span>
          {Object.values(columns).reduce((n, cards) => n + cards.length, 0)} cards
        </span>
      </div>

      <KanbanBoard
        className="flex min-h-0 flex-1 gap-3 overflow-x-auto px-3 pb-3"
        onCardMove={(move) =>
          setColumns((current) => applyKanbanMove(current, move))
        }
        onColumnMove={(move) =>
          setOrder((current) => {
            const next = current.filter((id) => id !== move.columnId);
            next.splice(move.index, 0, move.columnId);
            return next;
          })
        }
      >
        {order.map((columnId) => {
          const column = boardColumns.find((entry) => entry.id === columnId)!;
          const cards = columns[column.id] ?? [];

          return (
            <KanbanColumn
              key={column.id}
              columnId={column.id}
              aria-label={column.title}
              className="flex w-60 shrink-0 flex-col rounded-xl border border-border bg-card p-2"
            >
              <span className="mb-2 flex items-center justify-between gap-2 px-1">
                <span className="flex items-center gap-1.5">
                  <KanbanColumnHandle
                    aria-label={`Move ${column.title}`}
                    className="size-5"
                  />
                  <span className="text-sm font-medium">{column.title}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {cards.length}
                </span>
              </span>

              <KanbanColumnList
                aria-label={`${column.title} cards`}
                className="min-h-0 flex-1 overflow-auto"
              >
                {cards.map((cardId) => (
                  <KanbanCard
                    key={cardId}
                    cardId={cardId}
                    aria-label={boardCards[cardId].title}
                    className="mb-2 rounded-lg border border-border bg-background p-2.5 last:mb-0"
                  >
                    <span className="block text-sm">
                      {boardCards[cardId].title}
                    </span>
                    <span className="mt-1.5 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {boardCards[cardId].meta}
                      </span>
                      <span className="flex size-5 items-center justify-center rounded-full bg-secondary text-[10px] text-muted-foreground">
                        {boardCards[cardId].owner}
                      </span>
                    </span>
                  </KanbanCard>
                ))}
              </KanbanColumnList>
            </KanbanColumn>
          );
        })}
      </KanbanBoard>
    </div>
  );
}

const harnessNow = new Date(2026, 7, 18, 9, 40);
const at = (month: number, date: number, hour = 0, minute = 0) =>
  new Date(2026, month, date, hour, minute);

const harnessEvents: EventCalendarEvent[] = [
  { id: "standup", title: "Standup", start: at(7, 18, 9, 30), end: at(7, 18, 9, 45) },
  { id: "crit", title: "Design crit", start: at(7, 18, 13, 0), end: at(7, 18, 14, 30), location: "Studio" },
  { id: "sweep", title: "Eval sweep", start: at(7, 19, 10, 0), end: at(7, 19, 12, 0), tone: "secondary" },
  { id: "freeze", title: "Code freeze", start: at(7, 21, 16, 0), end: at(7, 21, 17, 0), tone: "destructive" },
  { id: "offsite", title: "Offsite", start: at(7, 20), end: at(7, 21), tone: "muted" },
];

const CALENDAR_HOURS = { min: 8, max: 18 };

/**
 * The time grid sizes itself from `hourHeight`, so a fixed value leaves dead
 * space in a tall pane. Measure the pane and divide the height across the
 * visible hours instead, with a floor so a short pane scrolls rather than
 * squashing the rows.
 */
function CalendarView() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hourHeight, setHourHeight] = React.useState(56);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      // Toolbar, day header and the all-day shelf sit above the hour rows.
      const chrome = 132;
      const hours = CALENDAR_HOURS.max - CALENDAR_HOURS.min;
      const available = entry.contentRect.height - chrome;
      setHourHeight(Math.max(44, Math.floor(available / hours)));
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex min-h-0 flex-1 flex-col">
      <EventCalendar
        className="flex min-h-0 flex-1 flex-col border-0"
        defaultEvents={harnessEvents}
        defaultDate={harnessNow}
        defaultView="week"
        now={harnessNow}
        locale="en-US"
        minHour={CALENDAR_HOURS.min}
        maxHour={CALENDAR_HOURS.max}
        hourHeight={hourHeight}
      >
        <EventCalendarToolbar />
        <EventCalendarGrid className="min-h-0 flex-1" />
      </EventCalendar>
    </div>
  );
}

interface WorkflowJob {
  id: string;
  title: string;
  detail: string;
  position: { x: number; y: number };
}

const initialJobs: WorkflowJob[] = [
  { id: "fetch", title: "Fetch corpus", detail: "every 15m", position: { x: 60, y: 80 } },
  { id: "chunk", title: "Chunk", detail: "512 tokens", position: { x: 340, y: 80 } },
  { id: "embed", title: "Embed", detail: "nessa-embed-1", position: { x: 340, y: 260 } },
  { id: "serve", title: "Serve", detail: "retrieval api", position: { x: 620, y: 170 } },
];

/** Offered when a connection is dropped on empty canvas. */
const TIMESTAMPS = ["09:41", "09:42", "09:44", "09:47", "09:51", "09:58"];

const jobPalette = [
  { id: "filter", title: "Filter", detail: "drop duplicates" },
  { id: "rerank", title: "Rerank", detail: "cross-encoder" },
  { id: "notify", title: "Notify", detail: "slack" },
];

function WorkflowView() {
  const [jobs, setJobs] = React.useState(initialJobs);
  const [edges, setEdges] = React.useState([
    { id: "fetch-chunk", source: "fetch", target: "chunk" },
    { id: "chunk-embed", source: "chunk", target: "embed" },
    { id: "embed-serve", source: "embed", target: "serve" },
  ]);
  const [palette, setPalette] = React.useState<{
    source: string;
    point: { x: number; y: number };
  } | null>(null);

  function removeJob(jobId: string) {
    setJobs((current) => current.filter((job) => job.id !== jobId));
    setEdges((current) =>
      current.filter((edge) => edge.source !== jobId && edge.target !== jobId)
    );
  }

  function addJob(option: (typeof jobPalette)[number]) {
    if (!palette) return;
    const id = `${option.id}-${jobs.length}`;
    setJobs((current) => [...current, { ...option, id, position: palette.point }]);
    setEdges((current) => [
      ...current,
      { id: `${palette.source}-${id}`, source: palette.source, target: id },
    ]);
    setPalette(null);
  }

  return (
    <WorkflowCanvas
      aria-label="Retrieval workflow"
      className="min-h-0 flex-1 border-0"
      bounds={{ minX: -60, minY: -60, maxX: 900, maxY: 520 }}
      onConnect={(connection) =>
        setEdges((current) => [
          ...current,
          {
            id: `${connection.source}-${connection.target}-${current.length}`,
            source: connection.source,
            target: connection.target,
          },
        ])
      }
      onConnectEnd={(end) => setPalette({ source: end.source, point: end.point })}
      onDismiss={() => setPalette(null)}
    >
      <WorkflowCanvasGrid />
      <WorkflowCanvasSurface>
        <WorkflowCanvasEdges>
          {edges.map((edge) => (
            <WorkflowCanvasEdge
              key={edge.id}
              source={edge.source}
              target={edge.target}
              className="stroke-[3.5] stroke-muted-foreground/70"
              aria-label={`Edge from ${edge.source} to ${edge.target}`}
              onDelete={() =>
                setEdges((current) => current.filter((e) => e.id !== edge.id))
              }
            />
          ))}
        </WorkflowCanvasEdges>

        {jobs.map((job) => (
          <WorkflowCanvasNode
            key={job.id}
            nodeId={job.id}
            defaultPosition={job.position}
            aria-label={`${job.title} job`}
            // Delete and Backspace remove a focused node with its edges.
            onDelete={() => removeJob(job.id)}
          >
            <span className="block w-44 rounded-xl border border-border bg-card p-3 shadow-sm">
              <span className="block text-sm font-medium">{job.title}</span>
              <span className="block text-xs text-muted-foreground">
                {job.detail}
              </span>
            </span>
            <WorkflowCanvasNodeHandle side="left" />
            <WorkflowCanvasNodeHandle side="right" />
            <WorkflowCanvasNodeHandle side="top" />
            <WorkflowCanvasNodeHandle side="bottom" />
          </WorkflowCanvasNode>
        ))}

        {palette ? (
          <WorkflowCanvasNode
            nodeId="palette"
            defaultPosition={palette.point}
            aria-label="Add a job"
          >
            <div className="w-52 rounded-xl border border-dashed border-primary/60 bg-popover p-2 shadow-lg">
              <div className="flex items-center justify-between px-1 pb-1">
                <span className="text-xs font-medium">Add a job</span>
                <button
                  type="button"
                  aria-label="Dismiss"
                  onClick={() => setPalette(null)}
                  className="rounded px-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
              {jobPalette.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => addJob(option)}
                  className="block w-full rounded-lg px-2 py-1.5 text-left hover:bg-accent"
                >
                  <span className="block text-sm">{option.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {option.detail}
                  </span>
                </button>
              ))}
            </div>
          </WorkflowCanvasNode>
        ) : null}
      </WorkflowCanvasSurface>
    </WorkflowCanvas>
  );
}

const themePresets = [
  { id: "", label: "Nessa", hint: "The library's neutral palette" },
  { id: "vercel", label: "Vercel", hint: "Pure black, white ink" },
  { id: "github-dark", label: "GitHub Dark", hint: "Slate with blue accents" },
  { id: "tokyo-night", label: "Tokyo Night", hint: "Cool indigo" },
  { id: "catppuccin", label: "Catppuccin", hint: "Mauve on slate" },
  { id: "nord", label: "Nord", hint: "Arctic blue" },
  { id: "gruvbox", label: "Gruvbox", hint: "Warm retro amber" },
  { id: "everforest", label: "Everforest", hint: "Soft forest green" },
  { id: "rose-pine", label: "Rosé Pine", hint: "Muted rose on plum" },
  { id: "solarized", label: "Solarized", hint: "Light, classic" },
  { id: "paper", label: "Paper", hint: "Warm light, ink on cream" },
];

/**
 * Fonts are tokens too: every nessa-ui surface resolves through
 * --nessa-font-sans and --nessa-font-mono, so a family swap is two variables.
 */
const sansFonts = [
  { id: "", label: "Geist", stack: "var(--font-geist), ui-sans-serif, system-ui, sans-serif" },
  { id: "inter", label: "Inter", stack: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" },
  { id: "serif", label: "Source Serif", stack: "var(--font-source-serif), ui-serif, Georgia, serif" },
  { id: "system", label: "System", stack: "ui-sans-serif, system-ui, sans-serif" },
];

const monoFonts = [
  { id: "", label: "Geist Mono", stack: "var(--font-geist-mono), ui-monospace, monospace" },
  { id: "jetbrains", label: "JetBrains Mono", stack: "var(--font-jetbrains), ui-monospace, monospace" },
  { id: "plex", label: "IBM Plex Mono", stack: "var(--font-plex-mono), ui-monospace, monospace" },
];

const textSizes = [
  { id: "14", label: "Small" },
  { id: "16", label: "Default" },
  { id: "18", label: "Large" },
];

/**
 * Appearance settings. Mode flips the `.dark` class the library keys off;
 * presets set `data-nessa-theme`, and each one is only a block of token
 * overrides. No component is patched, because every surface is painted from
 * those tokens.
 */
function AppearanceView() {
  const [mode, setMode] = React.useState<"light" | "dark">("dark");
  const [preset, setPreset] = React.useState("");
  const [sans, setSans] = React.useState("");
  const [mono, setMono] = React.useState("");
  const [size, setSize] = React.useState("16");

  React.useEffect(() => {
    setMode(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
    setPreset(document.documentElement.dataset.nessaTheme ?? "");
  }, []);

  function applyMode(next: "light" | "dark") {
    setMode(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    root.dataset.theme = next;
    root.style.colorScheme = next;
  }

  function applyPreset(next: string) {
    setPreset(next);
    const root = document.documentElement;
    if (next) root.dataset.nessaTheme = next;
    else delete root.dataset.nessaTheme;
  }

  function applySans(next: string) {
    setSans(next);
    const stack = sansFonts.find((font) => font.id === next)?.stack;
    document.documentElement.style.setProperty("--nessa-font-sans", stack ?? "");
  }

  function applyMono(next: string) {
    setMono(next);
    const stack = monoFonts.find((font) => font.id === next)?.stack;
    document.documentElement.style.setProperty("--nessa-font-mono", stack ?? "");
  }

  /**
   * Text size is not a library token: component sizes are rem-based, so the
   * host scales them by changing the root font size, and every surface follows.
   */
  function applySize(next: string) {
    setSize(next);
    document.documentElement.style.fontSize = `${next}px`;
  }

  return (
    <SettingsSection
      title="Appearance"
      description="Every nessa-ui surface is painted from semantic tokens, so a theme is a block of variables rather than a fork of any component."
    >
      <div>
        <h2 className="mb-3 text-sm font-medium">Mode</h2>
        <SegmentedControl
          value={mode}
          onValueChange={(value) => applyMode(value as "light" | "dark")}
        >
          <SegmentedControlOption value="light">Light</SegmentedControlOption>
          <SegmentedControlOption value="dark">Dark</SegmentedControlOption>
        </SegmentedControl>

        <h2 className="mt-8 mb-3 text-sm font-medium">Theme</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {themePresets.map((option) => {
            const active = preset === option.id;
            return (
              <button
                key={option.id || "default"}
                type="button"
                onClick={() => applyPreset(option.id)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  active
                    ? "border-ring bg-accent"
                    : "border-border hover:bg-accent/50"
                )}
              >
                <span
                  aria-hidden
                  data-nessa-theme={option.id || undefined}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background"
                >
                  <span className="size-4 rounded-full bg-primary" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">
                    {option.label}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {option.hint}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <h2 className="mt-8 mb-3 text-sm font-medium">Font</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1.5 block text-muted-foreground">Interface</span>
            <select
              value={sans}
              onChange={(event) => applySans(event.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-background px-2 text-sm outline-none"
            >
              {sansFonts.map((font) => (
                <option key={font.id || "default"} value={font.id}>
                  {font.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1.5 block text-muted-foreground">Monospace</span>
            <select
              value={mono}
              onChange={(event) => applyMono(event.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-background px-2 font-mono text-sm outline-none"
            >
              {monoFonts.map((font) => (
                <option key={font.id || "default"} value={font.id}>
                  {font.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <h2 className="mt-8 mb-3 text-sm font-medium">Text size</h2>
        <SegmentedControl value={size} onValueChange={applySize}>
          {textSizes.map((option) => (
            <SegmentedControlOption key={option.id} value={option.id}>
              {option.label}
            </SegmentedControlOption>
          ))}
        </SegmentedControl>
        <p className="mt-2 text-xs text-muted-foreground">
          Component sizes are rem-based, so scaling the root font size carries
          every surface with it.
        </p>

        <h2 className="mt-8 mb-3 text-sm font-medium">What a theme is</h2>
        <pre className="overflow-x-auto rounded-xl border border-border bg-card p-3 font-mono text-xs leading-6 text-muted-foreground">
{`[data-nessa-theme="tokyo-night"] {
  --background: oklch(0.24 0.03 267);
  --foreground: oklch(0.86 0.03 267);
  --primary:    oklch(0.72 0.13 267);
  --border:     oklch(0.34 0.03 267);
  /* ...the rest of the token set */
}`}
        </pre>
      </div>
    </SettingsSection>
  );
}

const settingsSections = [
  { id: "appearance", label: "Appearance" },
  { id: "models", label: "Models" },
  { id: "shortcuts", label: "Shortcuts" },
  { id: "about", label: "About" },
];

/** Settings takes over the window, with only its own sidebar. */
function SettingsSurface({ onClose }: { onClose: () => void }) {
  const [section, setSection] = React.useState("appearance");

  return (
    <div className="flex h-full min-h-0 bg-background">
      <nav className="flex w-56 shrink-0 flex-col border-e border-border bg-sidebar p-2">
        <div className="mb-2 px-2 py-1.5 text-sm font-semibold">Settings</div>
        {settingsSections.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setSection(entry.id)}
            className={cn(
              "mb-0.5 block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
              section === entry.id
                ? "bg-secondary font-medium text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {entry.label}
          </button>
        ))}

        <button
          type="button"
          onClick={onClose}
          className="mt-auto flex items-center gap-2 rounded-md border-t border-border px-2 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft aria-hidden className="size-4" />
          Back to the harness
        </button>
      </nav>

      <div className="min-h-0 flex-1 overflow-auto">
        {section === "appearance" ? <AppearanceView /> : null}
        {section === "models" ? (
          <SettingsSection
            title="Models"
            description="The default model for new conversations."
          >
            <ModelPicker groups={harnessModels} defaultValue={{ providerId: "anthropic", modelId: "opus" }} />
          </SettingsSection>
        ) : null}
        {section === "shortcuts" ? (
          <SettingsSection
            title="Shortcuts"
            description="Available anywhere in the harness."
          >
            <dl className="divide-y divide-border rounded-xl border border-border text-sm">
              {[
                ["Toggle terminal", "⌘J"],
                ["Move between panes", "⌘⇧H / J / K / L"],
                ["Maximize pane", "⇧⎋"],
                ["Skills and commands", "/"],
                ["Mention a file", "@"],
              ].map(([label, keys]) => (
                <div key={label} className="flex items-center justify-between p-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-mono text-xs">{keys}</dd>
                </div>
              ))}
            </dl>
          </SettingsSection>
        ) : null}
        {section === "about" ? (
          <SettingsSection
            title="About"
            description="This harness is a demo, assembled entirely from @nessa-ui/react."
          >
            <dl className="divide-y divide-border rounded-xl border border-border text-sm">
              {[
                ["Package", "@nessa-ui/react 0.1.0"],
                ["Surfaces", "AppShell, Message, ChatComposer, ToolCall"],
                ["Views", "Kanban, EventCalendar, WorkflowCanvas"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 p-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="truncate">{value}</dd>
                </div>
              ))}
            </dl>
          </SettingsSection>
        ) : null}
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl p-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

function PaneBody({ viewId }: { viewId: string | undefined }) {
  if (viewId === "view:board") return <BoardView />;
  if (viewId === "view:calendar") return <CalendarView />;
  if (viewId === "view:workflow") return <WorkflowView />;
  if (viewId?.startsWith("chat:")) return <ChatPane viewId={viewId} />;

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-4 text-xs text-muted-foreground">
      Pick something from the sidebar.
    </div>
  );
}

function PaneAction({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "size-6 shrink-0 text-muted-foreground hover:text-foreground",
        className
      )}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

interface PaneActionItem {
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  destructive?: boolean;
  run: () => void;
}

/**
 * The pane's actions as data, so the same list can render as a dropdown from
 * the "..." button and as a context menu on right-click. Each menu owns its own
 * item components; mixing them throws, since both read their own context.
 */
function usePaneActions(pane: PaneNode, maximized: boolean): PaneActionItem[] {
  const { splitPane, closePane, maximizePane, restorePane } = useAppShell();

  return [
    {
      label: "Split right",
      icon: <Columns2 aria-hidden className="size-3.5" />,
      run: () =>
        splitPane({ paneId: pane.id, direction: PaneSplitDirection.Right, views: [] }),
    },
    {
      label: "Split down",
      icon: <Rows2 aria-hidden className="size-3.5" />,
      run: () =>
        splitPane({ paneId: pane.id, direction: PaneSplitDirection.Down, views: [] }),
    },
    {
      label: maximized ? "Restore" : "Maximize",
      icon: maximized ? (
        <Minimize2 aria-hidden className="size-3.5" />
      ) : (
        <Maximize2 aria-hidden className="size-3.5" />
      ),
      shortcut: "⇧⎋",
      run: () => (maximized ? restorePane() : maximizePane({ paneId: pane.id })),
    },
    {
      label: "Close pane",
      icon: <X aria-hidden className="size-3.5" />,
      destructive: true,
      run: () => closePane({ paneId: pane.id }),
    },
  ];
}

/** Leftmost, topmost leaf: where the reveal control belongs. */
function firstPaneId(node: AppShellLayout["workspace"]["root"]): string {
  return node.type === "pane" ? node.id : firstPaneId(node.children[0]);
}

function Pane({ pane }: { pane: PaneNode }) {
  const { layout, toggleDock } = useAppShell();
  const sidebarOpen = layout.docks[AppShellDockSide.Left].open;
  const showReveal =
    !sidebarOpen && firstPaneId(layout.workspace.root) === pane.id;
  const viewId = pane.activeViewId ?? pane.views[0];
  const view = views.find((entry) => entry.id === viewId);
  const maximized = layout.workspace.maximizedPaneId === pane.id;
  const actions = usePaneActions(pane, maximized);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="group/pane-bar flex h-9 items-center pe-1">
            {showReveal ? (
              <PaneAction
                label="Show sidebar"
                onClick={() => toggleDock({ side: AppShellDockSide.Left })}
                className="ms-1.5"
              >
                <PanelLeft aria-hidden className="size-3.5" />
              </PaneAction>
            ) : null}
            <AppShellPaneDragHandle
              paneId={pane.id}
              className={cn(
                "flex h-full min-w-0 items-center gap-1.5",
                showReveal ? "ps-1.5" : "ps-2.5"
              )}
              title="Drag to move this pane"
            >
              <span className="truncate px-0.5 py-0.5 text-[0.8125rem] font-medium">
                {view?.label ?? "Empty pane"}
              </span>
            </AppShellPaneDragHandle>

            {/* Sits with the title rather than across the row, so it reads as
                this pane's menu at any pane width. */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Pane actions"
                  title="Pane actions"
                  className="ms-1 size-6 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover/pane-bar:opacity-100 data-[state=open]:opacity-100"
                >
                  <MoreHorizontal aria-hidden className="size-3.5" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="start"
                  sideOffset={4}
                  className="z-50 min-w-44 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
                >
                  {actions.map((action) => (
                    <DropdownMenu.Item
                      key={action.label}
                      onSelect={action.run}
                      className={cn(
                        "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden",
                        "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
                        action.destructive &&
                          "text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
                      )}
                    >
                      {action.icon}
                      {action.label}
                      {action.shortcut ? (
                        <span className="ms-auto text-xs text-muted-foreground">
                          {action.shortcut}
                        </span>
                      ) : null}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <span className="flex-1" />
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          {actions.map((action) => (
            <ContextMenuItem
              key={action.label}
              variant={action.destructive ? "destructive" : "default"}
              onSelect={action.run}
            >
              {action.icon}
              {action.label}
              {action.shortcut ? (
                <ContextMenuShortcut>{action.shortcut}</ContextMenuShortcut>
              ) : null}
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
      <PaneBody viewId={viewId} />
    </div>
  );
}

/* ── docks ─────────────────────────────────────────────────────────────── */

const SIDEBAR_WIDTH = 232;

/** Closing hides the sidebar outright; the toggle moves into the pane bar. */
function Sidebar({
  actions,
  onOpenSettings,
}: {
  actions?: React.ReactNode;
  onOpenSettings: () => void;
}) {
  const { openView, layout, toggleDock } = useAppShell();
  const active = layout.workspace.activePaneId;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-11 shrink-0 items-center justify-between ps-3 pe-1.5">
        <span className="text-sm font-semibold tracking-tight">
          <span aria-hidden className="me-1.5 text-muted-foreground">
            ◼
          </span>
          nessa<span className="font-normal text-muted-foreground">agent</span>
        </span>
        <PaneAction
          label="Hide sidebar"
          onClick={() => toggleDock({ side: AppShellDockSide.Left })}
        >
          <PanelLeft aria-hidden className="size-3.5" />
        </PaneAction>
      </div>

      <nav className="min-h-0 flex-1 overflow-auto p-2">
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
          Chats
        </div>
        {views
          .filter((view) => view.id.startsWith("chat:"))
          .map((view) => (
            <SidebarItem key={view.id} view={view} onOpen={openView} paneId={active} />
          ))}

        <div className="mt-4 px-2 py-1 text-xs font-medium text-muted-foreground">
          Views
        </div>
        {views
          .filter((view) => view.id.startsWith("view:"))
          .map((view) => (
            <SidebarItem key={view.id} view={view} onOpen={openView} paneId={active} />
          ))}
      </nav>

      <div className="flex items-center gap-0.5 border-t border-border p-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Settings aria-hidden className="size-4" />
          Settings
        </button>

        <PaneAction
          label="Toggle terminal (⌘J)"
          onClick={() => toggleDock({ side: AppShellDockSide.Bottom })}
        >
          <TerminalIcon aria-hidden className="size-3.5" />
        </PaneAction>
        {actions}
        <a
          href="/ui/components"
          aria-label="Leave the harness"
          title="Leave the harness"
          className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <LogOut aria-hidden className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

function SidebarItem({
  view,
  onOpen,
  paneId,
}: {
  view: (typeof views)[number];
  onOpen: (options: { viewId: string; paneId?: string }) => void;
  paneId: string;
}) {
  const Icon = view.icon;
  return (
    <button
      type="button"
      onClick={() => onOpen({ viewId: view.id, paneId })}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
    >
      {Icon ? <Icon aria-hidden className="size-4 shrink-0" /> : null}
      <span className="truncate">{view.label}</span>
    </button>
  );
}

/**
 * Pane focus by keyboard. The shell owns splitting and maximizing; moving
 * between panes is the host's, so this walks the rendered pane rects and picks
 * the nearest one in the requested direction.
 */
function useHarnessShortcuts() {
  const { toggleDock, focusPane, layout } = useAppShell();
  const activePaneId = layout.workspace.activePaneId;

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      if (!mod) return;

      // Cmd/Ctrl+J toggles the terminal.
      if (!event.shiftKey && event.key.toLowerCase() === "j") {
        event.preventDefault();
        toggleDock({ side: AppShellDockSide.Bottom });
        return;
      }

      if (!event.shiftKey) return;
      const direction = { h: "left", j: "down", k: "up", l: "right" }[
        event.key.toLowerCase()
      ];
      if (!direction) return;
      event.preventDefault();

      const panes = [
        ...document.querySelectorAll<HTMLElement>("[data-slot='app-shell-pane']"),
      ].map((element) => ({
        id: element.dataset.paneId!,
        rect: element.getBoundingClientRect(),
      }));
      const current = panes.find((pane) => pane.id === activePaneId);
      if (!current) return;

      const candidates = panes.filter((pane) => {
        if (pane.id === current.id) return false;
        if (direction === "left") return pane.rect.right <= current.rect.left + 1;
        if (direction === "right") return pane.rect.left >= current.rect.right - 1;
        if (direction === "up") return pane.rect.bottom <= current.rect.top + 1;
        return pane.rect.top >= current.rect.bottom - 1;
      });
      if (!candidates.length) return;

      // Nearest by centre distance, so stacked splits pick the neighbour.
      const centre = (rect: DOMRect) => ({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      const from = centre(current.rect);
      const next = candidates.sort((a, b) => {
        const pa = centre(a.rect);
        const pb = centre(b.rect);
        return (
          Math.hypot(pa.x - from.x, pa.y - from.y) -
          Math.hypot(pb.x - from.x, pb.y - from.y)
        );
      })[0];

      focusPane({ paneId: next.id });
      document
        .querySelector<HTMLElement>(`[data-pane-id="${next.id}"]`)
        ?.focus({ preventScroll: true });
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggleDock, focusPane, activePaneId]);
}

/* ── terminal dock ─────────────────────────────────────────────────────── */

const terminalSession = [
  { prompt: "nessa eval --suite retrieval", output: "worker-3 attached\n128/131 evaluations complete" },
  { prompt: "nessa runs tail 4192", output: "re-running 3 cases" },
  { prompt: "nessa index status", output: "index 4188 · encoder 4189 · mismatch" },
];

/** The shell's bottom dock, carrying a terminal session. Read-only here. */
function TerminalDock() {
  return (
    <div className="flex h-full flex-col bg-background font-mono text-xs">
      <div className="flex items-center gap-2 border-b border-border px-3 py-1.5 text-[11px] text-muted-foreground">
        <TerminalIcon aria-hidden className="size-3" />
        nessa@labs
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-3 py-2 leading-6">
        {terminalSession.map((entry) => (
          <div key={entry.prompt}>
            <div className="text-foreground">
              <span className="text-muted-foreground">$ </span>
              {entry.prompt}
            </div>
            <pre className="whitespace-pre-wrap text-muted-foreground">
              {entry.output}
            </pre>
          </div>
        ))}
        <div className="text-muted-foreground">
          <span>$ </span>
          <span className="inline-block h-3 w-1.5 translate-y-[1px] animate-pulse bg-muted-foreground/70" />
        </div>
      </div>
    </div>
  );
}

/* ── the harness ───────────────────────────────────────────────────────── */

function Shortcuts() {
  useHarnessShortcuts();
  return null;
}

function SidebarDock({
  actions,
  onOpenSettings,
}: {
  actions?: React.ReactNode;
  onOpenSettings: () => void;
}) {
  return (
    <AppShellDock side={AppShellDockSide.Left} minSize={180} maxSize={380}>
      <Sidebar actions={actions} onOpenSettings={onOpenSettings} />
    </AppShellDock>
  );
}

export function AgentHarness({
  headerActions,
}: {
  /** Rendered in the sidebar footer, before the exit control. */
  headerActions?: React.ReactNode;
} = {}) {
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  if (settingsOpen) {
    return <SettingsSurface onClose={() => setSettingsOpen(false)} />;
  }

  return (
    <AppShell
      className="h-full"
      defaultLayout={createAppShellLayout({
        views: ["chat:retrieval"],
        openDocks: [AppShellDockSide.Left],
        dockSizes: { [AppShellDockSide.Left]: SIDEBAR_WIDTH },
      })}
    >
      <Shortcuts />
      <AppShellBody className="relative">
        <SidebarDock
          actions={headerActions}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <AppShellMain className="relative">
          <AppShellWorkspace renderPane={(pane) => <Pane pane={pane} />} />
          <AppShellDock side={AppShellDockSide.Bottom} minSize={120} maxSize={360}>
            <TerminalDock />
          </AppShellDock>
        </AppShellMain>
      </AppShellBody>

    </AppShell>
  );
}
