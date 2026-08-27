"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  CodeBlock,
  DiffStat,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  FileDiffCard,
  FileDiffCardHeader,
  FileDiffCardHeading,
  FileDiffCardTitle,
  FileDiffList,
  FileDiffListItem,
  FileDiffListToggle,
  FileDiffPath,
  Input,
  JsonTree,
  MathBlock,
  MermaidDiagram,
  MessageMarkdown,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  RandomAvatar,
  Reference,
  ReferenceCard,
  ReferenceContent,
  ReferenceTrigger,
  SegmentedControl,
  SegmentedControlOption,
  TimelineHeader,
  TimelineHeaderCell,
  tablePaginationRange,
} from "@nessa-ui/react";

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}

export function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  );
}

export function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Run 4192</CardTitle>
        <CardDescription>retrieval · completed in 1m 12s</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        All 128 evaluations passed.
      </CardContent>
    </Card>
  );
}

export function InputDemo() {
  return <Input className="max-w-sm" placeholder="you@example.com" aria-label="Email" />;
}

export function SegmentedControlDemo() {
  const [value, setValue] = React.useState("week");
  return (
    <SegmentedControl value={value} onValueChange={setValue}>
      <SegmentedControlOption value="day">Day</SegmentedControlOption>
      <SegmentedControlOption value="week">Week</SegmentedControlOption>
      <SegmentedControlOption value="month">Month</SegmentedControlOption>
    </SegmentedControl>
  );
}

const traceKinds = ["Tool call", "Retrieval", "Handoff", "Reflection"];

/**
 * The select-all pattern the mixed state exists for: the header box is checked
 * when every kind is selected and mixed when only some are, so one glance
 * separates "all" from "some".
 */
export function CheckboxDemo() {
  const [selected, setSelected] = React.useState(["Retrieval"]);
  const all = selected.length === traceKinds.length;

  return (
    <div className="w-full max-w-xs">
      <label className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium">
        <Checkbox
          checked={all}
          indeterminate={selected.length > 0 && !all}
          onChange={() => setSelected(all ? [] : traceKinds)}
        />
        Every trace kind
      </label>
      <ul className="flex flex-col border-t border-border pt-1">
        {traceKinds.map((kind) => (
          <li key={kind}>
            <label className="flex items-center gap-3 rounded-lg p-2 text-sm">
              <Checkbox
                checked={selected.includes(kind)}
                onChange={(event) =>
                  setSelected((current) =>
                    event.target.checked
                      ? [...current, kind]
                      : current.filter((entry) => entry !== kind)
                  )
                }
              />
              {kind}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The four states side by side. Checked and mixed share one wash and differ
 * only in their glyph; a disabled control fades as a whole.
 */
export function CheckboxStatesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6 text-sm">
      <label className="flex items-center gap-2">
        <Checkbox checked={false} readOnly /> Unchecked
      </label>
      <label className="flex items-center gap-2">
        <Checkbox checked readOnly /> Checked
      </label>
      <label className="flex items-center gap-2">
        <Checkbox checked={false} indeterminate readOnly /> Mixed
      </label>
      <label className="flex items-center gap-2">
        <Checkbox checked readOnly disabled /> Disabled
      </label>
    </div>
  );
}

/**
 * The whole composition on one menu: labelled groups with shortcut hints, a
 * checkbox item, a submenu holding a radio group, and a destructive item.
 * Selection is marked by the leading indicators, never by the accent wash.
 */
export function DropdownMenuDemo() {
  const [dense, setDense] = React.useState(true);
  const [grouping, setGrouping] = React.useState("agent");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Trace list</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Refresh
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Export CSV
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={dense} onCheckedChange={setDense}>
          Dense rows
        </DropdownMenuCheckboxItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>Group by</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={grouping} onValueChange={setGrouping}>
              <DropdownMenuRadioItem value="agent">Agent</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="day">Day</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete view</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Twelve pages behind a seven-slot window. The window keeps the first page,
 * the last page and the current page's neighbours, collapsing the rest into
 * ellipses; `tablePaginationRange` computes it, and the page itself is state
 * the host holds.
 */
export function PaginationDemo() {
  const [page, setPage] = React.useState(4);
  const pageCount = 12;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          />
        </PaginationItem>
        {tablePaginationRange(page, pageCount).map((item, index) => (
          <PaginationItem key={item === "ellipsis" ? `gap-${index}` : item}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                aria-label={`Page ${item}`}
                isActive={item === page}
                onClick={() => setPage(item)}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            disabled={page >= pageCount}
            onClick={() => setPage(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const WEEK_WIDTH = 32;
const QUARTER_WEEKS = 13;
const quarters = ["Q1", "Q2", "Q3", "Q4"];

/**
 * A two-tier ruler inside an ordinary horizontal scroller. Scroll it sideways:
 * each quarter label pins eight pixels from the viewport's left edge while any
 * part of its quarter is still in view, and the week ticks scroll underneath.
 */
export function TimelineHeaderDemo() {
  const weeks = QUARTER_WEEKS * quarters.length;

  return (
    <div className="w-full max-w-lg overflow-x-auto rounded-lg border border-border">
      <TimelineHeader className="h-14" style={{ width: weeks * WEEK_WIDTH }}>
        {quarters.map((quarter, index) => (
          <TimelineHeaderCell
            key={quarter}
            start={index * QUARTER_WEEKS * WEEK_WIDTH}
            width={QUARTER_WEEKS * WEEK_WIDTH}
            pinLabelInset={8}
            className="top-0 h-7 font-medium text-foreground"
          >
            {quarter}
          </TimelineHeaderCell>
        ))}
        {Array.from({ length: weeks }, (_, week) => (
          <TimelineHeaderCell
            key={week}
            start={week * WEEK_WIDTH}
            width={WEEK_WIDTH}
            className="bottom-0 h-7 justify-center"
          >
            {(week % QUARTER_WEEKS) + 1}
          </TimelineHeaderCell>
        ))}
      </TimelineHeader>
    </div>
  );
}

const roster = [
  "Chief",
  "Sales Outbound",
  "Inbox Manager",
  "Account Manager",
  "Talent Scout",
  "Research Desk",
];

/**
 * The avatar's home habitat: one painting per teammate, at the size a list row
 * uses. The name is the seed, so the same teammate paints the same picture on
 * every client — there is no image to upload, fetch or cache.
 */
export function RandomAvatarDemo() {
  return (
    <ul className="flex w-full max-w-xs flex-col gap-1">
      {roster.map((teammate) => (
        <li key={teammate} className="flex items-center gap-3 rounded-lg p-2">
          <RandomAvatar seed={teammate} className="size-9" />
          <span className="text-sm font-medium">{teammate}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * A list of seeds paints one shared picture, the group counterpart of a
 * facepile. Membership is the identity: reordering the list paints the same
 * picture, adding or removing an agent repaints the group.
 */
export function RandomAvatarGroupDemo() {
  const crew = ["Chief", "Research Desk", "Talent Scout"];

  return (
    <div className="flex flex-wrap items-end justify-center gap-8">
      {[crew.slice(0, 1), crew.slice(0, 2), crew].map((members) => (
        <div key={members.length} className="flex flex-col items-center gap-2">
          <RandomAvatar
            seed={members}
            name={members.join(", ")}
            className="size-16"
          />
          <span className="text-xs text-muted-foreground">
            {members.length === 1 ? "1 agent" : `${members.length} agents`}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * `busy` keeps the paint alive: a wash floods the paper and hands over to the
 * next for as long as an agent is working, and turning it off walks each wash
 * home rather than snapping it. It also sets `aria-busy`, which defers
 * reporting rather than announcing — saying "working" out loud is the host's
 * job, through a live region or a status beside the avatar.
 */
export function RandomAvatarWorkingDemo() {
  const [busy, setBusy] = React.useState(true);

  return (
    <div className="flex flex-col items-center gap-4">
      <RandomAvatar
        seed="Research Desk"
        name="Research Desk"
        busy={busy}
        className="size-24"
      />
      <Button variant="outline" size="sm" onClick={() => setBusy((v) => !v)}>
        {busy ? "Stop working" : "Start working"}
      </Button>
    </div>
  );
}

const painted = ["Chief", "Sales Outbound", "Inbox Manager", "Talent Scout", "Research Desk"];

/**
 * `tone` sets how dilute the paint is, `ground` what it is laid on. The same
 * five seeds run across every row, so the prop is the only thing changing. On
 * `ink` the passes lighten instead of multiplying, which is what keeps a
 * painting's structure on a dark surface rather than a bright disc.
 */
export function RandomAvatarToneDemo() {
  return (
    <div className="flex flex-col gap-3">
      {(["pastel", "soft", "vivid", "deep"] as const).map((tone) => (
        <div key={tone} className="flex items-center gap-3">
          <span className="w-14 text-xs text-muted-foreground">{tone}</span>
          {painted.map((seed) => (
            <RandomAvatar key={seed} seed={seed} tone={tone} className="size-10" />
          ))}
        </div>
      ))}
      {/* A dark scope, so the ink row sits on the library's dark tokens in
          either colour mode rather than on a hard-coded colour. */}
      <div className="dark mt-1 flex items-center gap-3 rounded-lg border border-border bg-background p-3">
        <span className="w-14 text-xs text-muted-foreground">ink</span>
        {painted.map((seed) => (
          <RandomAvatar key={seed} seed={seed} ground="ink" className="size-10" />
        ))}
      </div>
    </div>
  );
}

export function CodeBlockDemo() {
  return (
    <CodeBlock
      className="w-full max-w-2xl"
      language="tsx"
      code={`import { ToolCall, ToolCallTrigger } from "@nessa-ui/react"

export function Row() {
  return (
    <ToolCall status="running">
      <ToolCallTrigger meta="run 4192">Evaluating</ToolCallTrigger>
    </ToolCall>
  )
}`}
    />
  );
}

const payload = {
  suite: "retrieval",
  filters: { status: ["failed", "queued"], since: "2026-08-22" },
  limit: 12,
  options: { includeTraces: true, sample: null },
};

export function JsonTreeDemo({ collapsible }: { collapsible?: boolean }) {
  return (
    <JsonTree
      className="w-full max-w-2xl"
      value={payload}
      collapsible={collapsible}
      defaultExpandedDepth={collapsible ? 1 : undefined}
    />
  );
}

/**
 * A formula arriving as a token stream. MathBlock keeps the last successful
 * render on screen while intermediate TeX is invalid, so the block never
 * flashes KaTeX's error state mid-stream — press Replay to watch it again.
 */
export function MathBlockDemo() {
  const tex = String.raw`\text{sim}(q, d) = \frac{q \cdot d}{\lVert q \rVert \, \lVert d \rVert}`;
  const [shown, setShown] = React.useState(tex);
  const [run, setRun] = React.useState(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(tex);
      return;
    }
    let i = 0;
    setShown("");
    const id = window.setInterval(() => {
      i += 2;
      setShown(tex.slice(0, i));
      if (i >= tex.length) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, [tex, run]);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <MathBlock tex={shown} />
      <Button variant="outline" size="sm" onClick={() => setRun((n) => n + 1)}>
        <RotateCcw aria-hidden="true" />
        Replay
      </Button>
    </div>
  );
}

export function MessageMarkdownDemo() {
  return (
    <MessageMarkdown className="w-full max-w-2xl">
      {`### Retrieval regression

Three cases regressed after the index rebuild:

- \`4189\` — encoder mismatch
- \`4191\` — stale vectors
- \`4193\` — timeout

The fix is to pin the encoder to the checkpoint that wrote the index.`}
    </MessageMarkdown>
  );
}

export function ReferenceDemo() {
  return (
    <p className="max-w-2xl text-sm leading-7">
      The rebuild pinned the wrong encoder checkpoint
      <Reference>
        <ReferenceTrigger>1</ReferenceTrigger>
        <ReferenceContent>
          <ReferenceCard
            sources={[
              {
                title: "run-4189.json",
                excerpt:
                  "step 7: index.rebuild(checkpoint=4188) — step 8: encoder=4189",
                meta: "step 7–8",
              },
            ]}
          />
        </ReferenceContent>
      </Reference>{" "}
      which is why long-tail queries drifted.
    </p>
  );
}

const manyFiles = [
  { path: "packages/react/src/retrieval/index.ts", additions: 84, deletions: 12 },
  { path: "packages/react/src/retrieval/encoder.ts", additions: 31, deletions: 0 },
  { path: "packages/react/src/retrieval/rerank.ts", additions: 18, deletions: 6 },
  { path: "packages/react/src/retrieval/legacy.ts", additions: 0, deletions: 96 },
  { path: "packages/react/src/index.ts", additions: 4, deletions: 1 },
  { path: "apps/api/routes/search.ts", additions: 12, deletions: 4 },
  { path: "apps/api/routes/embed.ts", additions: 22, deletions: 9 },
  { path: "apps/api/lib/client.ts", additions: 7, deletions: 3 },
  { path: "apps/worker/jobs/reindex.ts", additions: 41, deletions: 15 },
  { path: "apps/worker/jobs/backfill.ts", additions: 9, deletions: 2 },
  { path: "docs/retrieval.md", additions: 27, deletions: 3 },
  { path: "docs/changelog.md", additions: 6, deletions: 0 },
];

/** Collapsed to three rows; expanding scrolls the rest under a height cap. */
export function FileDiffScrollDemo() {
  return (
    <FileDiffCard className="w-full max-w-2xl" itemCount={manyFiles.length}>
      <FileDiffCardHeader>
        <FileDiffCardHeading>
          <FileDiffCardTitle>Changes</FileDiffCardTitle>
        </FileDiffCardHeading>
        <DiffStat
          additions={manyFiles.reduce((n, f) => n + f.additions, 0)}
          deletions={manyFiles.reduce((n, f) => n + f.deletions, 0)}
        />
      </FileDiffCardHeader>
      <FileDiffList>
        {manyFiles.map((file) => (
          <FileDiffListItem key={file.path}>
            <FileDiffPath path={file.path} />
            <DiffStat additions={file.additions} deletions={file.deletions} />
          </FileDiffListItem>
        ))}
      </FileDiffList>
      <FileDiffListToggle />
    </FileDiffCard>
  );
}

export function FileDiffDemo() {
  const files = [
    { path: "packages/react/src/retrieval/index.ts", additions: 84, deletions: 12 },
    { path: "packages/react/src/retrieval/encoder.ts", additions: 31, deletions: 0 },
    { path: "apps/api/routes/search.ts", additions: 12, deletions: 4 },
    { path: "docs/retrieval.md", additions: 27, deletions: 3 },
  ];

  return (
    <FileDiffCard className="w-full max-w-2xl" itemCount={files.length}>
      <FileDiffCardHeader>
        <FileDiffCardHeading>
          <FileDiffCardTitle>Changes</FileDiffCardTitle>
        </FileDiffCardHeading>
        <DiffStat
          additions={files.reduce((n, f) => n + f.additions, 0)}
          deletions={files.reduce((n, f) => n + f.deletions, 0)}
        />
      </FileDiffCardHeader>
      <FileDiffList>
        {files.map((file) => (
          <FileDiffListItem key={file.path}>
            <FileDiffPath path={file.path} />
            <DiffStat additions={file.additions} deletions={file.deletions} />
          </FileDiffListItem>
        ))}
      </FileDiffList>
    </FileDiffCard>
  );
}

export function MermaidDiagramDemo() {
  return (
    <MermaidDiagram
      className="w-full max-w-2xl"
      chart={`flowchart LR
  A[Corpus] --> B[Chunk]
  B --> C[Embed]
  C --> D[(Vector store)]
  D --> E{Rerank?}
  E -- yes --> F[Cross-encoder]
  E -- no --> G[Serve]
  F --> G`}
    />
  );
}
