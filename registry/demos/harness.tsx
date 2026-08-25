"use client";

import * as React from "react";
import {
  Calendar,
  Columns2,
  KanbanSquare,
  LogOut,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Rows2,
  Mic,
  Settings,
  Terminal as TerminalIcon,
  Workflow,
  X,
} from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { ThinkingIcon } from "../story-support/icons/nucleo";
import {
  AppShell,
  AppShellBody,
  AppShellDock,
  AppShellDockSide,
  AppShellHeader,
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
  ContextMenuSeparator,
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
  ToolCall,
  ToolCallTrigger,
  createAppShellLayout,
  useAppShell,
  type ChatComposerEditorHandle,
  type ComposerAccessModeValue,
  type ModelPickerGroup,
  type ModelPickerValue,
  type PaneNode,
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

const skills = ["Eval suite", "Trace reader", "Warehouse SQL", "Deploy"];

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

      <div className="border-t border-border p-2">
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

          <ChatComposerTrigger trigger="/" label="Skills">
            {({ query, clearTrigger }) => (
              <div className="p-1">
                {skills
                  .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
                  .map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => {
                        clearTrigger();
                        editorRef.current?.insertChip({
                          id: skill,
                          label: skill,
                          kind: "skill",
                        });
                      }}
                      className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                    >
                      {skill}
                    </button>
                  ))}
              </div>
            )}
          </ChatComposerTrigger>

          <ChatComposerTrigger trigger="@" label="Files">
            {({ query, clearTrigger }) => (
              <div className="p-1">
                {files
                  .filter((f) => f.toLowerCase().includes(query.toLowerCase()))
                  .map((file) => (
                    <button
                      key={file}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => {
                        clearTrigger();
                        editorRef.current?.insertChip({
                          id: file,
                          label: file.split("/").pop() ?? file,
                          kind: "mention",
                          textValue: file,
                        });
                      }}
                      className="block w-full truncate rounded-md px-2 py-1.5 text-left font-mono text-xs hover:bg-accent"
                    >
                      {file}
                    </button>
                  ))}
              </div>
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

/**
 * One menu of pane actions, reachable two ways: the row's "..." button, and a
 * right-click anywhere on the pane header. Four icon buttons per pane read as
 * clutter once panes are small, and the menu can name each action and carry
 * its shortcut.
 */
function PaneMenuItems({
  pane,
  maximized,
}: {
  pane: PaneNode;
  maximized: boolean;
}) {
  const { splitPane, closePane, maximizePane, restorePane } = useAppShell();

  return (
    <>
      <ContextMenuItem
        onSelect={() =>
          splitPane({ paneId: pane.id, direction: PaneSplitDirection.Right, views: [] })
        }
      >
        <Columns2 aria-hidden className="size-3.5" />
        Split right
      </ContextMenuItem>
      <ContextMenuItem
        onSelect={() =>
          splitPane({ paneId: pane.id, direction: PaneSplitDirection.Down, views: [] })
        }
      >
        <Rows2 aria-hidden className="size-3.5" />
        Split down
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        onSelect={() =>
          maximized ? restorePane() : maximizePane({ paneId: pane.id })
        }
      >
        {maximized ? (
          <Minimize2 aria-hidden className="size-3.5" />
        ) : (
          <Maximize2 aria-hidden className="size-3.5" />
        )}
        {maximized ? "Restore" : "Maximize"}
        <ContextMenuShortcut>⇧⎋</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        variant="destructive"
        onSelect={() => closePane({ paneId: pane.id })}
      >
        <X aria-hidden className="size-3.5" />
        Close pane
      </ContextMenuItem>
    </>
  );
}

function Pane({ pane }: { pane: PaneNode }) {
  const { layout } = useAppShell();
  const viewId = pane.views[0];
  const view = views.find((entry) => entry.id === viewId);
  const maximized = layout.workspace.maximizedPaneId === pane.id;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="group/pane-bar flex h-8 items-center gap-0.5 border-b border-border pe-1">
            <AppShellPaneDragHandle
              paneId={pane.id}
              className="flex h-full min-w-0 flex-1 items-center gap-1.5 ps-2"
              title="Drag to move this pane"
            >
              <span className="truncate text-xs font-medium">
                {view?.label ?? "Empty pane"}
              </span>
            </AppShellPaneDragHandle>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Pane actions"
                  title="Pane actions"
                  className="size-6 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover/pane-bar:opacity-100 data-[state=open]:opacity-100"
                >
                  <MoreHorizontal aria-hidden className="size-3.5" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={4}
                  className="z-50 min-w-44 overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md"
                >
                  <PaneMenuItems pane={pane} maximized={maximized} />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <PaneMenuItems pane={pane} maximized={maximized} />
        </ContextMenuContent>
      </ContextMenu>
      <PaneBody viewId={viewId} />
    </div>
  );
}

/* ── docks ─────────────────────────────────────────────────────────────── */

function Sidebar() {
  const { openView, layout } = useAppShell();
  const active = layout.workspace.activePaneId;

  return (
    <div className="flex h-full flex-col">
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

      <div className="border-t border-border p-2">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <Settings aria-hidden className="size-4" />
          Settings
        </button>
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

/** Sits with the brand: the sidebar toggle belongs beside what it toggles. */
function SidebarToggle() {
  const { toggleDock } = useAppShell();
  return (
    <PaneAction
      label="Toggle sidebar"
      onClick={() => toggleDock({ side: AppShellDockSide.Left })}
    >
      <PanelLeft aria-hidden className="size-3.5" />
    </PaneAction>
  );
}

function HeaderControls({ actions }: { actions?: React.ReactNode }) {
  const { toggleDock } = useAppShell();
  return (
    <div className="ms-auto flex items-center gap-0.5">
      <PaneAction
        label="Toggle terminal"
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
  );
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

export function AgentHarness({
  headerActions,
}: {
  /** Rendered in the header, before the exit control. */
  headerActions?: React.ReactNode;
} = {}) {
  return (
    <AppShell
      className="h-full"
      defaultLayout={createAppShellLayout({
        views: ["chat:retrieval"],
        openDocks: [AppShellDockSide.Left],
      })}
    >
      <AppShellHeader className="bg-sidebar">
        <SidebarToggle />
        <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span aria-hidden className="text-muted-foreground">
            ◼
          </span>
          nessa<span className="font-normal text-muted-foreground">agent</span>
        </span>
        <HeaderControls actions={headerActions} />
      </AppShellHeader>

      <AppShellBody>
        <AppShellDock side={AppShellDockSide.Left} minSize={200} maxSize={380}>
          <Sidebar />
        </AppShellDock>
        <AppShellMain>
          <AppShellWorkspace renderPane={(pane) => <Pane pane={pane} />} />
          <AppShellDock side={AppShellDockSide.Bottom} minSize={120} maxSize={360}>
            <TerminalDock />
          </AppShellDock>
        </AppShellMain>
      </AppShellBody>

    </AppShell>
  );
}
