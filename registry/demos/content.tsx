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
  CodeBlock,
  DiffStat,
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
  Reference,
  ReferenceCard,
  ReferenceContent,
  ReferenceTrigger,
  SegmentedControl,
  SegmentedControlOption,
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
