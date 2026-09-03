"use client";

import * as React from "react";
import { Archive, Bot, Columns2, GripVertical, Pin, Plus, X } from "lucide-react";
import {
  AppShell,
  AppShellBody,
  AppShellDock,
  AppShellDockSide,
  AppShellHeader,
  AppShellMain,
  AppShellPaneDragHandle,
  AppShellStatusBar,
  AppShellWorkspace,
  Button,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
  PaneSplitDirection,
  PopoverSurface,
  SearchableListbox,
  SectionedListbox,
  Sidebar,
  SidebarCollapsible,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  createAppShellLayout,
  useAppShell,
  type PaneNode,
} from "@nessa-ui/react";
import {
  ChatComposeIcon,
  EditIcon,
  FileCopyIcon,
  FolderClosedIcon,
  FolderOpenIcon,
  GlobeIcon,
  SearchIcon,
  TodoIcon,
} from "../story-support/icons/nucleo";
import { SidebarToggleIcon } from "../story-support/icons/sidebar-toggle-icon";

/* ------------------------------------------------------------------ */
/* PopoverSurface                                                      */
/* ------------------------------------------------------------------ */

export function PopoverSurfaceDemo() {
  return (
    <div className="flex w-full justify-center py-4">
      <PopoverSurface className="w-72 p-4">
        <div className="flex items-center gap-3">
          <div
            aria-hidden
            className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
          >
            <Bot className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="m-0 truncate text-sm font-medium">Planner</p>
            <p className="m-0 truncate text-xs text-muted-foreground">
              Reads the repo, writes the plan
            </p>
          </div>
        </div>
        <p className="mt-3 mb-0 text-sm leading-6 text-muted-foreground">
          The surface only paints the card. Positioning, portalling and
          dismissal stay with whatever floats it.
        </p>
      </PopoverSurface>
    </div>
  );
}

export function PopoverSurfaceVariantsDemo() {
  return (
    <div className="grid w-full gap-4 py-2 sm:grid-cols-3">
      {(
        [
          { radius: "lg", elevation: "md", label: "lg · md" },
          { radius: "xl", elevation: "md", label: "xl · md (default)" },
          { radius: "2xl", elevation: "xl", label: "2xl · xl" },
        ] as const
      ).map((variant) => (
        <PopoverSurface
          key={variant.label}
          radius={variant.radius}
          elevation={variant.elevation}
          className="p-4"
        >
          <p className="m-0 text-sm font-medium">{variant.label}</p>
          <p className="m-0 mt-1 text-xs text-muted-foreground">
            radius and elevation are the only two knobs.
          </p>
        </PopoverSurface>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ContextMenu                                                         */
/* ------------------------------------------------------------------ */

export function ContextMenuDemo() {
  const [wrap, setWrap] = React.useState(true);
  const [inlineDiffs, setInlineDiffs] = React.useState(false);
  const [assignee, setAssignee] = React.useState("mira");

  return (
    <div className="flex w-full justify-center py-2">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className="flex h-40 w-72 select-none items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
            Right click here
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent className="min-w-56">
          <ContextMenuItem>
            <EditIcon />
            Rename
            <ContextMenuShortcut>⌘E</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <FileCopyIcon />
            Duplicate
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Open with</ContextMenuSubTrigger>
            <ContextMenuSubContent className="min-w-44">
              <ContextMenuItem>
                <GlobeIcon />
                Browser
              </ContextMenuItem>
              <ContextMenuItem>
                <SearchIcon />
                Inspector
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Choose another…</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked={wrap} onCheckedChange={setWrap}>
            Wrap long lines
            <ContextMenuShortcut>⌥Z</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={inlineDiffs}
            onCheckedChange={setInlineDiffs}
          >
            Inline diffs
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value={assignee} onValueChange={setAssignee}>
            <ContextMenuLabel inset>Assign to</ContextMenuLabel>
            <ContextMenuRadioItem value="mira">Mira Chen</ContextMenuRadioItem>
            <ContextMenuRadioItem value="sasha">
              Sasha Ortiz
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SearchableListbox                                                   */
/* ------------------------------------------------------------------ */

interface ModelRow {
  id: string;
  name: string;
  vendor: string;
  note: string;
  retired?: boolean;
}

const models: ModelRow[] = [
  {
    id: "opus",
    name: "Opus 5",
    vendor: "Anthropic",
    note: "Deepest reasoning",
  },
  {
    id: "sonnet",
    name: "Sonnet 5",
    vendor: "Anthropic",
    note: "The everyday default",
  },
  {
    id: "haiku",
    name: "Haiku 4.5",
    vendor: "Anthropic",
    note: "Fast and cheap",
  },
  {
    id: "fable",
    name: "Fable 5.1",
    vendor: "Anthropic",
    note: "Long-form writing",
  },
  {
    id: "legacy",
    name: "Sonnet 3.7",
    vendor: "Anthropic",
    note: "Retired",
    retired: true,
  },
];

export function SearchableListboxDemo() {
  const [value, setValue] = React.useState("sonnet");

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-popover p-1">
      <SearchableListbox
        items={models}
        value={value}
        onValueChange={setValue}
        getItemId={(model) => model.id}
        getItemKeywords={(model) => [model.name, model.vendor, model.note]}
        isItemDisabled={(model) => model.retired === true}
        listLabel="Models"
        searchPlaceholder="Search models"
        emptyMessage="No model matches that."
        listClassName="max-h-64"
        renderItem={(model, { selected }) => (
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <span className="min-w-0">
              <span className="block truncate text-sm">{model.name}</span>
              <span className="block truncate text-xs text-muted-foreground">
                {model.note}
              </span>
            </span>
            {selected ? (
              <span className="shrink-0 text-xs text-muted-foreground">
                Active
              </span>
            ) : null}
          </div>
        )}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SectionedListbox                                                    */
/* ------------------------------------------------------------------ */

interface CommandRow {
  id: string;
  label: string;
  hint: string;
}

const commandSections = [
  {
    id: "recent",
    label: "Recent",
    items: [
      { id: "audit", label: "Repo audit", hint: "12m ago" },
      { id: "notes", label: "Release notes", hint: "1h ago" },
    ] satisfies CommandRow[],
  },
  {
    id: "skills",
    label: "Skills",
    items: [
      { id: "review", label: "Code review", hint: "/review" },
      { id: "simplify", label: "Simplify", hint: "/simplify" },
      { id: "security", label: "Security review", hint: "/security" },
    ] satisfies CommandRow[],
  },
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "settings", label: "Open settings", hint: "⌘," },
      { id: "theme", label: "Toggle theme", hint: "⌘⇧L" },
    ] satisfies CommandRow[],
  },
];

export function SectionedListboxDemo() {
  const [value, setValue] = React.useState("review");

  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-popover p-1">
      <SectionedListbox
        sections={commandSections}
        value={value}
        onValueChange={setValue}
        getItemId={(row) => row.id}
        listLabel="Commands"
        className="max-h-64"
        renderItem={(row) => (
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            <span className="truncate text-sm">{row.label}</span>
            <span className="shrink-0 text-xs text-muted-foreground">
              {row.hint}
            </span>
          </div>
        )}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

const pinnedChats = ["Build the design system", "Ship the release notes"];

const sidebarProjects = [
  { name: "nessa_ui", chats: ["Chart ramp", "Sheet motion"] },
  { name: "website", chats: [] as string[] },
];

/**
 * The library sizes the sidebar shell to the viewport (`h-svh`). A docs
 * preview is a box on a page, so the frame overrides that to fill the box
 * instead — the same override the library's own catalogue stories use.
 */
function SidebarFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[30rem] w-full overflow-hidden rounded-2xl border border-border">
      {children}
    </div>
  );
}

export function SidebarDemo() {
  const [active, setActive] = React.useState(pinnedChats[0]!);
  const [drafts, setDrafts] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(true);
  const [expanded, setExpanded] = React.useState(
    () => new Set(["nessa_ui"])
  );

  const toggleProject = (project: (typeof sidebarProjects)[number]) => {
    setActive(project.name);
    if (project.chats.length === 0) return;
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(project.name)) next.delete(project.name);
      else next.add(project.name);
      return next;
    });
  };

  return (
    <SidebarFrame>
      <SidebarProvider
        open={open}
        onOpenChange={setOpen}
        sidebarWidth="17rem"
        className="min-h-0 h-full"
      >
        <Sidebar
          aria-label="Workspace navigation"
          collapsible={SidebarCollapsible.Icon}
          className="h-full"
        >
          <SidebarHeader className="gap-3 px-3 pt-3 pb-1">
            <div className="flex min-h-9 items-center justify-between gap-2">
              <span className="truncate px-1 text-base font-semibold group-data-[state=collapsed]/sidebar:hidden">
                Nessa
              </span>
              <SidebarTrigger>
                <SidebarToggleIcon />
              </SidebarTrigger>
            </div>
            <SidebarMenu>
              <SidebarMenuItem
                icon={<ChatComposeIcon />}
                className="font-medium"
                onClick={() => {
                  const next = `Untitled chat ${drafts.length + 1}`;
                  setDrafts((current) => [next, ...current]);
                  setActive(next);
                }}
              >
                New chat
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Pinned</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {pinnedChats.map((chat) => (
                    <SidebarMenuItem
                      key={chat}
                      icon={<Pin className="size-4" />}
                      isActive={active === chat}
                      tooltip={chat}
                      onClick={() => setActive(chat)}
                    >
                      {chat}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Projects</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarProjects.map((project) => (
                    <SidebarMenuItem
                      key={project.name}
                      icon={
                        expanded.has(project.name) ? (
                          <FolderOpenIcon />
                        ) : (
                          <FolderClosedIcon />
                        )
                      }
                      isActive={active === project.name}
                      tooltip={project.name}
                      onClick={() => toggleProject(project)}
                      badge={
                        project.chats.length > 0
                          ? String(project.chats.length)
                          : undefined
                      }
                      submenu={
                        project.chats.length > 0 &&
                        expanded.has(project.name) ? (
                          <SidebarMenu>
                            {project.chats.map((chat) => (
                              <SidebarMenuItem
                                key={chat}
                                isActive={active === chat}
                                tooltip={chat}
                                onClick={() => setActive(chat)}
                              >
                                {chat}
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        ) : undefined
                      }
                    >
                      {project.name}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {drafts.length > 0 ? (
              <SidebarGroup>
                <SidebarGroupLabel>Drafts</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {drafts.map((chat) => (
                      <SidebarMenuItem
                        key={chat}
                        icon={<TodoIcon />}
                        isActive={active === chat}
                        tooltip={chat}
                        onClick={() => setActive(chat)}
                      >
                        {chat}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ) : null}
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem
                icon={<Archive className="size-4" />}
                tooltip="Archive"
              >
                Archive
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="min-h-0">
          <div className="flex h-full flex-col gap-2 p-6">
            <p className="m-0 text-sm text-muted-foreground">Open</p>
            <p className="m-0 text-lg font-semibold">{active}</p>
            <p className="m-0 mt-auto text-xs text-muted-foreground">
              The trigger collapses the rail to icons; every row keeps its
              tooltip there.
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </SidebarFrame>
  );
}

/* ------------------------------------------------------------------ */
/* AppShell                                                            */
/* ------------------------------------------------------------------ */

const shellChats = [
  { id: "chat:planner", name: "Planner" },
  { id: "chat:reviewer", name: "Reviewer" },
  { id: "chat:release", name: "Release notes" },
];

function ShellPane({ pane }: { pane: PaneNode }) {
  const { closePane, splitPane } = useAppShell();
  const chat = shellChats.find((entry) => entry.id === pane.activeViewId);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex h-9 shrink-0 items-center gap-0.5 border-b border-border bg-muted/40 pe-1.5">
        {/* Dragging the grip moves this pane onto another pane's edge. */}
        <AppShellPaneDragHandle
          paneId={pane.id}
          className="flex h-full min-w-0 flex-1 items-center gap-1.5 ps-2"
          title="Drag to move this pane"
        >
          <GripVertical
            aria-hidden
            className="size-3.5 shrink-0 text-muted-foreground/70"
          />
          <span className="truncate text-xs font-medium">
            {chat?.name ?? "Empty pane"}
          </span>
        </AppShellPaneDragHandle>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label="Split pane right"
          onClick={() =>
            splitPane({
              paneId: pane.id,
              direction: PaneSplitDirection.Right,
              views: [],
            })
          }
        >
          <Columns2 aria-hidden className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          aria-label="Close pane"
          onClick={() => closePane({ paneId: pane.id })}
        >
          <X aria-hidden className="size-3.5" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 p-4 text-sm text-muted-foreground">
        {chat
          ? `${chat.name} — pick another conversation on the left to open it here.`
          : "Empty pane. Pick a conversation on the left."}
      </div>
    </div>
  );
}

function ShellConversations() {
  const { layout, openView } = useAppShell();
  const activePaneId = layout.workspace.activePaneId;

  return (
    <div className="flex h-full flex-col gap-1 p-2">
      <p className="m-0 px-2 pt-1 pb-2 text-xs font-medium text-muted-foreground">
        Conversations
      </p>
      {shellChats.map((chat) => (
        <Button
          key={chat.id}
          variant="ghost"
          className="justify-start gap-2"
          onClick={() => openView({ viewId: chat.id, paneId: activePaneId })}
        >
          <Bot aria-hidden className="size-4" />
          {chat.name}
        </Button>
      ))}
      <Button
        variant="ghost"
        className="mt-auto justify-start gap-2 text-muted-foreground"
      >
        <Plus aria-hidden className="size-4" />
        New conversation
      </Button>
    </div>
  );
}

export function AppShellDemo() {
  return (
    // A definite height and width: the panes contain their own size, so the
    // frame can never be derived from the content inside them.
    <div className="h-[32rem] w-full overflow-hidden rounded-2xl border border-border">
      <AppShell
        defaultLayout={createAppShellLayout({
          views: ["chat:planner"],
          openDocks: [AppShellDockSide.Left, AppShellDockSide.Bottom],
        })}
      >
        <AppShellHeader className="bg-sidebar">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-tight">
            <Bot aria-hidden className="size-4" />
            Nessa
          </span>
        </AppShellHeader>
        <AppShellBody>
          <AppShellDock side={AppShellDockSide.Left} minSize={180} maxSize={320}>
            <ShellConversations />
          </AppShellDock>
          <AppShellMain>
            <AppShellWorkspace renderPane={(pane) => <ShellPane pane={pane} />} />
            <AppShellDock
              side={AppShellDockSide.Bottom}
              minSize={100}
              maxSize={280}
            >
              <div className="p-3 font-mono text-xs text-muted-foreground">
                Bottom dock — agent run logs.
              </div>
            </AppShellDock>
          </AppShellMain>
        </AppShellBody>
        <AppShellStatusBar className="bg-sidebar">
          <span className="text-xs text-muted-foreground">
            Split a pane, then drag it by its grip onto another pane&apos;s edge.
          </span>
        </AppShellStatusBar>
      </AppShell>
    </div>
  );
}
