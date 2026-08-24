"use client";

import * as React from "react";
import {
  Announce,
  AsciiArt,
  AsciiBox,
  Badge,
  Button,
  Cell,
  CellGrid,
  CodeBlock,
  Input,
  Section,
  Tabs,
  Terminal,
} from "@/components/nessa-ui";

/**
 * Live previews, keyed by component slug and by example id. Docs pages look up
 * the slug first, then each example id underneath it.
 */
export const previews: Record<string, React.ReactNode> = {
  button: <Button>Get started</Button>,
  "button-variants": (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  "button-sizes": (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
  "button-disabled": <Button disabled>Unavailable</Button>,

  badge: (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Neutral</Badge>
      <Badge tone="accent">Stable</Badge>
      <Badge tone="warn">Beta</Badge>
      <Badge tone="outline">Outline</Badge>
    </div>
  ),

  input: (
    <Input
      className="w-full max-w-sm"
      placeholder="you@example.com"
      aria-label="Email"
    />
  ),
  "input-icon": (
    <Input
      className="w-full max-w-sm"
      icon={<span>@</span>}
      placeholder="username"
      aria-label="Username"
    />
  ),

  "cell-grid": (
    <CellGrid className="w-full" cols={3}>
      <Cell>Research</Cell>
      <Cell>Agents</Cell>
      <Cell>Interfaces</Cell>
    </CellGrid>
  ),

  section: (
    <div className="w-full rounded-xl border border-line">
      <Section
        className="px-6 py-8"
        eyebrow="nessa-ui"
        title="Components"
        description="Everything on this site is built from them."
      >
        <Badge tone="outline">children</Badge>
      </Section>
    </div>
  ),

  tabs: (
    <Tabs
      className="w-full max-w-xl"
      items={[
        {
          value: "preview",
          label: "Preview",
          content: <Badge tone="accent">Rendered</Badge>,
        },
        {
          value: "code",
          label: "Code",
          content: <CodeBlock code={`<Badge tone="accent">Rendered</Badge>`} />,
        },
      ]}
    />
  ),

  "code-block": (
    <CodeBlock
      className="w-full max-w-xl"
      filename="page.tsx"
      showLineNumbers
      code={`export default function Page() {\n  return <Button>Get started</Button>\n}`}
    />
  ),

  announce: (
    <Announce label="New" href="#">
      nessa-ui v0.1.0 is available
    </Announce>
  ),

  terminal: (
    <Terminal
      className="w-full max-w-xl"
      typing
      lines={[
        "$ npx nessa-ui add button",
        "  ↳ resolving registry…",
        "✔ installed in 412ms",
      ]}
    />
  ),

  "ascii-box": (
    <AsciiBox title="manifest" footer="v0.1.0" className="w-full max-w-xl">
      Wherever life happens, our AI is there.
    </AsciiBox>
  ),
  "ascii-box-dense": (
    <AsciiBox title="log" dense className="w-full max-w-xl">
      build ok — 412ms
    </AsciiBox>
  ),

  "ascii-art": (
    <div className="w-full overflow-hidden">
      <AsciiArt cols={90} rows={12} density={0.6} />
    </div>
  ),
};
