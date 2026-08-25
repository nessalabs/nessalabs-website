"use client";

import * as React from "react";
import {
  ArrowLeft,
  Calendar,
  Columns2,
  KanbanSquare,
  Maximize2,
  Minimize2,
  PanelBottom,
  PanelLeft,
  Plus,
  Rows2,
  Settings,
  Workflow,
  X,
} from "lucide-react";
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
  ChatComposerFooter,
  ChatComposerInput,
  ChatComposerSubmit,
  ChatComposerTrigger,
  Message,
  MessageBubble,
  MessageContent,
  MessageStreamText,
  PaneSplitDirection,
  ToolCall,
  ToolCallTrigger,
  createAppShellLayout,
  useAppShell,
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
          <ChatComposerInput
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Type / for skills, @ for files"
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
                      onClick={() => clearTrigger(`/${skill} `)}
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
                      onClick={() => clearTrigger(`@${file.split("/").pop()} `)}
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
              <ChatComposerAction aria-label="Attach" title="Attach">
                <Plus aria-hidden="true" />
              </ChatComposerAction>
            </ChatComposerActions>
            <ChatComposerActions className="justify-end">
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

function Pane({ pane }: { pane: PaneNode }) {
  const { splitPane, closePane, maximizePane, restorePane, layout } =
    useAppShell();
  const viewId = pane.views[0];
  const view = views.find((entry) => entry.id === viewId);
  const maximized = layout.workspace.maximizedPaneId === pane.id;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="flex h-8 items-center gap-0.5 border-b border-border pe-1">
        <AppShellPaneDragHandle
          paneId={pane.id}
          className="flex h-full min-w-0 flex-1 items-center gap-1.5 ps-2"
          title="Drag to move this pane"
        >
          <span className="truncate text-xs font-medium">
            {view?.label ?? "Empty pane"}
          </span>
        </AppShellPaneDragHandle>
        <PaneAction
          label="Split right"
          onClick={() =>
            splitPane({ paneId: pane.id, direction: PaneSplitDirection.Right, views: [] })
          }
        >
          <Columns2 aria-hidden className="size-3.5" />
        </PaneAction>
        <PaneAction
          label="Split down"
          onClick={() =>
            splitPane({ paneId: pane.id, direction: PaneSplitDirection.Down, views: [] })
          }
        >
          <Rows2 aria-hidden className="size-3.5" />
        </PaneAction>
        <PaneAction
          label={maximized ? "Restore" : "Maximize"}
          onClick={() => (maximized ? restorePane() : maximizePane({ paneId: pane.id }))}
        >
          {maximized ? (
            <Minimize2 aria-hidden className="size-3.5" />
          ) : (
            <Maximize2 aria-hidden className="size-3.5" />
          )}
        </PaneAction>
        <PaneAction label="Close" onClick={() => closePane({ paneId: pane.id })}>
          <X aria-hidden className="size-3.5" />
        </PaneAction>
      </div>
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

function HeaderControls() {
  const { toggleDock } = useAppShell();
  return (
    <div className="ms-auto flex items-center gap-0.5">
      <PaneAction
        label="Toggle sidebar"
        onClick={() => toggleDock({ side: AppShellDockSide.Left })}
      >
        <PanelLeft aria-hidden className="size-3.5" />
      </PaneAction>
      <PaneAction
        label="Toggle logs"
        onClick={() => toggleDock({ side: AppShellDockSide.Bottom })}
      >
        <PanelBottom aria-hidden className="size-3.5" />
      </PaneAction>
    </div>
  );
}

/* ── the harness ───────────────────────────────────────────────────────── */

export function AgentHarness() {
  return (
    <AppShell
      className="h-full"
      defaultLayout={createAppShellLayout({
        views: ["chat:retrieval"],
        openDocks: [AppShellDockSide.Left],
      })}
    >
      <AppShellHeader className="bg-sidebar">
        <a
          href="/ui/components"
          aria-label="Back to the docs"
          title="Back to the docs"
          className="mr-1 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
        </a>
        <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span aria-hidden className="text-muted-foreground">
            ◼
          </span>
          nessa<span className="font-normal text-muted-foreground">agent</span>
        </span>
        <HeaderControls />
      </AppShellHeader>

      <AppShellBody>
        <AppShellDock side={AppShellDockSide.Left} minSize={200} maxSize={380}>
          <Sidebar />
        </AppShellDock>
        <AppShellMain>
          <AppShellWorkspace renderPane={(pane) => <Pane pane={pane} />} />
          <AppShellDock side={AppShellDockSide.Bottom} minSize={100} maxSize={320}>
            <pre className="p-3 font-mono text-xs leading-6 text-muted-foreground">
              {`› worker-3 attached
› 128/131 evaluations complete
› re-running 3 cases`}
            </pre>
          </AppShellDock>
        </AppShellMain>
      </AppShellBody>

    </AppShell>
  );
}
