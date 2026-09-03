"use client";

import * as React from "react";
import {
  ImagePlus,
  Inbox,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  FileDropZone,
  FilePreview,
  GradientSurface,
  Input,
  PageOutline,
  Sheet,
  SheetAction,
  SheetBody,
  SheetClose,
  SheetExpand,
  SheetHandle,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  TaskList,
  TaskListItem,
  gradientSurfacePatterns,
  gradientSurfacePresets,
  type FileDropRejection,
  type PageOutlineItemData,
  type TaskListItemStatus,
} from "@nessa-ui/react";

const panelClassName =
  "mt-4 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground";

export function TabsDemo() {
  return (
    <Tabs defaultValue="inbox" className="w-full max-w-md">
      <TabsList aria-label="Session drawers">
        <TabsTrigger value="inbox" icon={<Inbox />} badge="12">
          Inbox
        </TabsTrigger>
        <TabsTrigger value="running" icon={<Sparkles />} badge="3">
          Running
        </TabsTrigger>
        <TabsTrigger value="archived" icon={<MessageSquare />}>
          Archived
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inbox" className={panelClassName}>
        Twelve sessions waiting on you.
      </TabsContent>
      <TabsContent value="running" className={panelClassName}>
        Three agents are still working.
      </TabsContent>
      <TabsContent value="archived" className={panelClassName}>
        Nothing archived yet.
      </TabsContent>
    </Tabs>
  );
}

export function TabsPillDemo() {
  return (
    <Tabs defaultValue="threads" className="w-full max-w-sm">
      <TabsList aria-label="Channel view" variant="pill">
        <TabsTrigger value="threads">Threads</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="pins">Pins</TabsTrigger>
      </TabsList>
      <TabsContent value="threads" className={panelClassName}>
        Every thread in this channel.
      </TabsContent>
      <TabsContent value="files" className={panelClassName}>
        Files shared here.
      </TabsContent>
      <TabsContent value="pins" className={panelClassName}>
        Pinned messages.
      </TabsContent>
    </Tabs>
  );
}

export function TaskListDemo() {
  return (
    <TaskList aria-label="Agent plan" className="w-full max-w-md">
      <TaskListItem status="done">Read the failing test output</TaskListItem>
      <TaskListItem status="done" meta="2 files">
        Locate the selector regression
      </TaskListItem>
      <TaskListItem status="active">Apply the fix and re-run tests</TaskListItem>
      <TaskListItem status="failed" meta="exit 1">
        Update the visual snapshots
      </TaskListItem>
      <TaskListItem>Push the branch</TaskListItem>
    </TaskList>
  );
}

const checklist = [
  { id: "update", label: "Send the weekly update" },
  { id: "notes", label: "Review project notes" },
  { id: "groceries", label: "Pick up groceries" },
  { id: "dentist", label: "Book a dentist appointment", meta: "due Friday" },
];

export function TaskListChecklistDemo() {
  const [statuses, setStatuses] = React.useState<
    Record<string, TaskListItemStatus>
  >({ update: "todo", notes: "todo", groceries: "done", dentist: "todo" });

  return (
    <TaskList aria-label="Today's tasks" className="w-full max-w-md">
      {checklist.map((task) => (
        <TaskListItem
          key={task.id}
          status={statuses[task.id]}
          meta={task.meta}
          onStatusChange={(next) =>
            setStatuses((current) => ({ ...current, [task.id]: next }))
          }
        >
          {task.label}
        </TaskListItem>
      ))}
    </TaskList>
  );
}

export function GradientSurfaceDemo() {
  return (
    <GradientSurface
      colors={gradientSurfacePresets.meadow}
      pattern="contours"
      className="min-h-72 w-full rounded-2xl"
    >
      <div className="flex h-full flex-col justify-end gap-2 p-6">
        <p className="m-0 text-xl font-semibold text-white">
          Build the agent surface, not the scroll container
        </p>
        <p className="m-0 max-w-sm text-sm leading-6 text-white/80">
          Every wash is CSS and inline SVG, so the server and the client paint
          the same markup.
        </p>
      </div>
    </GradientSurface>
  );
}

export function GradientSurfacePalettesDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(gradientSurfacePresets).map(([name, colors]) => (
        <GradientSurface key={name} colors={colors} className="min-h-40 rounded-2xl">
          <div className="flex h-full items-end">
            <p className="px-5 py-4 text-sm font-medium capitalize text-white/90">
              {name}
            </p>
          </div>
        </GradientSurface>
      ))}
    </div>
  );
}

export function GradientSurfacePatternsDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {gradientSurfacePatterns.map((pattern) => (
        <GradientSurface
          key={pattern}
          colors={gradientSurfacePresets.dusk}
          pattern={pattern}
          patternOpacity={0.28}
          className="min-h-44 rounded-2xl"
        >
          <div className="flex h-full items-end">
            <p className="px-5 py-4 text-sm font-medium capitalize text-white/90">
              {pattern}
            </p>
          </div>
        </GradientSurface>
      ))}
    </div>
  );
}

function ContactFields() {
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-sm">
        Name
        <Input defaultValue="Sara Mendez" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        Email
        <Input defaultValue="sara@acme.com" />
      </label>
    </div>
  );
}

export function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open contact</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sara Mendez</DrawerTitle>
          <DrawerDescription>
            Product owner at Acme Inc., last active five minutes ago.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody className="flex flex-col gap-6">
          <ContactFields />
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">Linked conversations</h3>
            {[
              "Product design — feedback request",
              "Web development — project update",
              "Contract renewal",
            ].map((title) => (
              <div
                key={title}
                className="rounded-lg border border-border bg-background p-3 text-sm"
              >
                {title}
              </div>
            ))}
          </div>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DrawerClose>
          <Button>Save contact</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function DrawerResizableDemo() {
  return (
    <Drawer side="left">
      <DrawerTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </DrawerTrigger>
      <DrawerContent
        resizable
        defaultSize="24rem"
        minSize="20rem"
        maxSize="34rem"
      >
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>
            Drag the inner edge, or focus it and use the arrow keys.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <ContactFields />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export function SheetDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-border bg-background">
      <Button
        variant="outline"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        onClick={() => setOpen(true)}
      >
        Open sheet
      </Button>
      {open ? (
        <Sheet label="Queued" onClose={() => setOpen(false)}>
          <SheetHandle />
          <SheetHeader>
            <SheetExpand />
            <SheetTitle>Queued</SheetTitle>
            <SheetAction>Done</SheetAction>
          </SheetHeader>
          <SheetBody>
            <p className="m-0 text-sm">
              Two follow-ups are waiting behind the current run. Drag the grab
              bar up to fill the frame.
            </p>
          </SheetBody>
        </Sheet>
      ) : null}
    </div>
  );
}

export function SheetContainedDemo() {
  const [open, setOpen] = React.useState(false);
  const [queued, setQueued] = React.useState(0);

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Outside the ancestor the sheet fills. A non-modal sheet covers its
          own siblings and leaves this row clickable and in the tab order —
          which is the whole difference, so the row has to live out here. */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={() => setQueued((n) => n + 1)}>
          Queue another run
        </Button>
        <span className="text-sm text-muted-foreground">
          {queued} queued, with the sheet open
        </span>
      </div>
      <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-border bg-background p-4">
        <Button variant="outline" onClick={() => setOpen(true)}>
          Show details
        </Button>
        {open ? (
          <Sheet label="Run details" modal={false} onClose={() => setOpen(false)}>
            <SheetHandle />
            <SheetHeader>
              <SheetExpand />
              <SheetTitle>Run details</SheetTitle>
              <SheetClose className="col-start-3 justify-self-end" />
            </SheetHeader>
            <SheetBody>
              <p className="m-0 text-sm">
                Started 4 minutes ago, 12 tool calls, 3 files touched.
              </p>
            </SheetBody>
          </Sheet>
        ) : null}
      </div>
    </div>
  );
}

const outlineSections: PageOutlineItemData[] = [
  { id: "installation", label: "Installation", depth: 0 },
  { id: "package-manager", label: "Package manager", depth: 1 },
  { id: "pnpm", label: "pnpm", depth: 2 },
  { id: "peer-dependencies", label: "Peer dependencies", depth: 3 },
  { id: "npm", label: "npm", depth: 2 },
  { id: "manual-setup", label: "Manual setup", depth: 1 },
  { id: "usage", label: "Usage", depth: 0 },
  { id: "rendering", label: "Rendering", depth: 1 },
  { id: "selection", label: "Selection", depth: 1 },
  { id: "keyboard-model", label: "Keyboard model", depth: 2 },
  { id: "api-reference", label: "API reference", depth: 0 },
  { id: "props", label: "Props", depth: 1 },
];

const outlineCopy =
  "The rail traces the heading hierarchy rather than sitting straight, so depth stays legible without indenting the type. Scroll and the pulse travels the rail to the section being read.";

/** The guide the outline sits beside: the scroller is the spy's container. */
function OutlineGuide({
  outline,
}: {
  outline: (scrollRef: React.RefObject<HTMLDivElement | null>) => React.ReactNode;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="h-96 w-full overflow-y-auto rounded-xl border border-border bg-background"
    >
      <div className="flex items-start">
        <article className="min-w-0 flex-1 px-6 py-6">
          {outlineSections.map((section) => {
            const Tag = `h${Math.min(6, section.depth + 2)}` as "h2";
            return (
              <React.Fragment key={section.id}>
                <Tag
                  id={section.id}
                  className="mt-8 mb-2 text-base font-semibold first:mt-0"
                >
                  {section.label}
                </Tag>
                <p className="mb-3 max-w-[62ch] text-sm leading-6 text-muted-foreground">
                  {outlineCopy}
                </p>
              </React.Fragment>
            );
          })}
        </article>
        <div className="sticky top-0 w-56 flex-none border-l border-border py-6 pl-4 pr-3">
          {outline(scrollRef)}
        </div>
      </div>
    </div>
  );
}

export function PageOutlineDemo() {
  return (
    <OutlineGuide
      outline={(scrollRef) => (
        <PageOutline
          items={outlineSections}
          scrollContainerRef={scrollRef}
          scrollOffset={64}
          aria-label="On this page"
        />
      )}
    />
  );
}

export function PageOutlineCollapseDemo() {
  return (
    <OutlineGuide
      outline={(scrollRef) => (
        <PageOutline
          items={outlineSections}
          scrollContainerRef={scrollRef}
          scrollOffset={64}
          collapse="auto"
          aria-label="On this page"
        />
      )}
    />
  );
}

export function PageOutlineMarkerDemo() {
  return (
    <OutlineGuide
      outline={(scrollRef) => (
        <PageOutline
          items={outlineSections}
          scrollContainerRef={scrollRef}
          scrollOffset={64}
          aria-label="On this page"
          // Drawn centred on 0,0 pointing toward positive y; the outline
          // translates and rotates it along the rail every frame, so it banks
          // through the jogs instead of cutting the corner.
          marker={
            <g>
              <path
                d="M-3.5 -6 Q0 -9 3.5 -6 L3.5 4 Q3.5 7 0 7 Q-3.5 7 -3.5 4 Z"
                className="fill-foreground"
              />
              <circle cx="-3.5" cy="-1" r="1.4" className="fill-background" />
              <circle cx="3.5" cy="-1" r="1.4" className="fill-background" />
              <circle cx="-3.5" cy="4" r="1.4" className="fill-background" />
              <circle cx="3.5" cy="4" r="1.4" className="fill-background" />
            </g>
          }
        />
      )}
    />
  );
}

/** A tiny inline SVG, so the preview fetches nothing. */
const diagramSrc = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="#0b3560"/>
    <circle cx="110" cy="90" r="46" fill="#3aa4d8"/>
    <rect x="170" y="52" width="96" height="76" rx="12" fill="#a06be0"/>
  </svg>`
)}`;

export function FilePreviewDemo() {
  return (
    <FilePreview
      file={{
        src: diagramSrc,
        name: "architecture.svg",
        mimeType: "image/svg+xml",
        size: 1_234_567,
      }}
      className="h-80 w-full"
    />
  );
}

export function FilePreviewFallbackDemo() {
  return (
    <FilePreview
      file={{
        src: diagramSrc,
        name: "session-capture.bin",
        mimeType: "application/octet-stream",
        size: 84_500,
      }}
      className="h-64 w-full"
    />
  );
}

export function FileDropZoneDemo() {
  const [names, setNames] = React.useState<string[]>([]);

  return (
    <div className="flex w-full flex-col gap-3">
      <FileDropZone
        accept="image/*"
        onFiles={(files) =>
          setNames((current) => [...current, ...files.map((file) => file.name)])
        }
      >
        {({ isDragging }) => (
          <div
            className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors"
            style={{
              borderColor: isDragging ? "var(--ring)" : "var(--border)",
              backgroundColor: isDragging ? "var(--accent)" : "transparent",
            }}
          >
            <ImagePlus aria-hidden="true" className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium">Drop images here</span>
            <span className="text-sm text-muted-foreground">
              Folders are expanded; anything else is refused.
            </span>
          </div>
        )}
      </FileDropZone>
      <ul className="text-sm text-muted-foreground">
        {names.map((name) => (
          <li key={name}>Attached {name}</li>
        ))}
      </ul>
    </div>
  );
}

const rejectionReasons: Record<FileDropRejection["reason"], string> = {
  type: "not an image",
  size: "over 1 MB",
  count: "over the 2-file limit",
  folder: "a folder, not a file",
};

export function FileDropZoneLimitsDemo() {
  const [accepted, setAccepted] = React.useState<string[]>([]);
  const [rejected, setRejected] = React.useState<FileDropRejection[]>([]);

  return (
    <div className="flex w-full flex-col gap-3">
      <FileDropZone
        accept="image/*"
        maxFiles={2}
        maxSize={1024 * 1024}
        label="Drop up to 2 images"
        onFiles={(files) => setAccepted(files.map((file) => file.name))}
        onRejectedFiles={setRejected}
        className="rounded-xl border border-border p-6"
      >
        <p className="m-0 text-sm">Drop up to 2 images, 1 MB each.</p>
      </FileDropZone>
      <ul className="text-sm text-muted-foreground">
        {accepted.map((name) => (
          <li key={name}>Attached {name}</li>
        ))}
      </ul>
      <ul className="text-sm text-destructive">
        {rejected.map(({ file, reason }) => (
          <li key={file.name}>
            {file.name} — {rejectionReasons[reason]}
          </li>
        ))}
      </ul>
    </div>
  );
}
