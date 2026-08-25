"use client";

import * as React from "react";
import {
  Calendar,
  Columns2,
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
  Rocket,
  Settings,
  Sparkles,
  Terminal as TerminalIcon,
  Workflow,
  X,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { cn } from "@/lib/cn";
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
  Message,
  MessageBubble,
  MessageContent,
  MessageStreamText,
  ModelPicker,
  ModelThinkingControl,
  PaneSplitDirection,
  SectionedListbox,
  ToolCall,
  ToolCallTrigger,
  createAppShellLayout,
  useAppShell,
  type ChatComposerEditorHandle,
  type ComposerAccessModeValue,
  type ModelPickerGroup,
  type ModelPickerValue,
  type AppShellLayout,
  type PaneNode,
  type SectionedListboxSection,
} from "@nessa-ui/react";
import {
  EventCalendarDemo,
  KanbanDemo,
  WorkflowCanvasDemo,
} from "./composites";

/* ── data ──────────────────────────────────────────────────────────────── */

interface Turn {
  id: string;
  from: "user" | "assistant";
  text: string;
  streaming?: boolean;
}

const openingTurns: Record<string, Turn[]> = {
  "chat:retrieval": [
    { id: "1", from: "user", text: "Why did the retrieval suite regress?" },
    {
      id: "2",
      from: "assistant",
      text: "The index was rebuilt against checkpoint 4188 while the query encoder moved to 4189. Re-running the three failing cases against a matched index now.",
    },
  ],
  "chat:release": [
    { id: "1", from: "user", text: "What is left before the freeze?" },
    {
      id: "2",
      from: "assistant",
      text: "Composites are at 15 percent and hardening has not started. Everything else is done or in review.",
    },
  ],
};

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

const replies = [
  "Queued. I will report back when the run settles.",
  "Reading the trace now. The mismatch starts at step 7.",
  "Done. Three cases pass against the matched index.",
];

const views = [
  { id: "chat:retrieval", label: "Retrieval regression", icon: null },
  { id: "chat:release", label: "Release plan", icon: null },
  { id: "view:board", label: "Board", icon: KanbanSquare },
  { id: "view:calendar", label: "Calendar", icon: Calendar },
  { id: "view:workflow", label: "Workflow", icon: Workflow },
] as { id: string; label: string; icon: React.ComponentType<{ className?: string }> | null }[];

/* ── chat pane ─────────────────────────────────────────────────────────── */

function ChatPane({ viewId }: { viewId: string }) {
  const [turns, setTurns] = React.useState<Turn[]>(
    openingTurns[viewId] ?? openingTurns["chat:retrieval"]
  );
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

  function send() {
    const text = draft.trim();
    if (!text) return;
    const reply = replies[turns.length % replies.length];
    setTurns((current) => [
      ...current,
      { id: `${current.length}-u`, from: "user", text },
      { id: `${current.length}-a`, from: "assistant", text: reply, streaming: true },
    ]);
    setDraft("");
    editorRef.current?.clear();
  }

  return (
    <>
      <div
        role="log"
        aria-label="Conversation"
        tabIndex={0}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto p-3 outline-none"
      >
        {turns.map((turn) =>
          turn.from === "assistant" ? (
            <Message key={turn.id} from="assistant">
              <MessageContent>
                {/* No avatar or sender name: the agent's turns read as plain
                    text, and only the person's turns carry a bubble. */}
                <MessageBubble variant="plain" streaming={turn.streaming}>
                  {turn.streaming ? (
                    <MessageStreamText text={turn.text} />
                  ) : (
                    turn.text
                  )}
                </MessageBubble>
              </MessageContent>
            </Message>
          ) : (
            <Message key={turn.id} from="user">
              <MessageContent>
                <MessageBubble variant="primary">{turn.text}</MessageBubble>
              </MessageContent>
            </Message>
          )
        )}

        <ToolCall status="complete">
          <ToolCallTrigger meta="suite=retrieval">Read run 4192</ToolCallTrigger>
        </ToolCall>
      </div>

      <div className="p-2">
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

function PaneBody({ viewId }: { viewId: string | undefined }) {
  if (viewId === "view:board")
    return (
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <KanbanDemo />
      </div>
    );
  if (viewId === "view:calendar")
    return (
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <EventCalendarDemo defaultView="day" />
      </div>
    );
  if (viewId === "view:workflow")
    return (
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <WorkflowCanvasDemo />
      </div>
    );
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
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      size="icon"
      variant="ghost"
      className="size-6 text-muted-foreground hover:text-foreground"
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
  const viewId = pane.views[0];
  const view = views.find((entry) => entry.id === viewId);
  const maximized = layout.workspace.maximizedPaneId === pane.id;
  const actions = usePaneActions(pane, maximized);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="group/pane-bar flex h-8 items-center pe-1">
            {showReveal ? (
              <span className="ps-1.5">
                <PaneAction
                  label="Show sidebar"
                  onClick={() => toggleDock({ side: AppShellDockSide.Left })}
                >
                  <PanelLeft aria-hidden className="size-3.5" />
                </PaneAction>
              </span>
            ) : null}
            <AppShellPaneDragHandle
              paneId={pane.id}
              className="flex h-full min-w-0 items-center gap-1.5 ps-2"
              title="Drag to move this pane"
            >
              <span className="truncate text-xs font-medium">
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
function Sidebar({ actions }: { actions?: React.ReactNode }) {
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

function SidebarDock({ actions }: { actions?: React.ReactNode }) {
  return (
    <AppShellDock side={AppShellDockSide.Left} minSize={180} maxSize={380}>
      <Sidebar actions={actions} />
    </AppShellDock>
  );
}

export function AgentHarness({
  headerActions,
}: {
  /** Rendered in the sidebar footer, before the exit control. */
  headerActions?: React.ReactNode;
} = {}) {
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
        <SidebarDock actions={headerActions} />
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
