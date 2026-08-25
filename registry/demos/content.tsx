"use client";

import * as React from "react";
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
  FileDiffPath,
  Input,
  JsonTree,
  MathBlock,
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

export function MathBlockDemo() {
  return <MathBlock tex="\\text{sim}(q, d) = \\frac{q \\cdot d}{\\lVert q \\rVert \\lVert d \\rVert}" />;
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
