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
  Ticker,
} from "@/components/nessa-ui";

/**
 * Live previews, keyed by component slug and by example id. Docs pages look up
 * the slug first, then each example id underneath it.
 */
export const previews: Record<string, React.ReactNode> = {
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

  button: (
    <Button variant="accent" brackets>
      sync with us
    </Button>
  ),
  "button-variants": (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="solid">solid</Button>
      <Button variant="outline">outline</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="accent">accent</Button>
    </div>
  ),
  "button-sizes": (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">sm</Button>
      <Button size="md">md</Button>
      <Button size="lg">lg</Button>
    </div>
  ),

  badge: (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>neutral</Badge>
      <Badge tone="accent">stable</Badge>
      <Badge tone="warn">beta</Badge>
      <Badge tone="outline">outline</Badge>
    </div>
  ),

  terminal: (
    <Terminal
      className="w-full max-w-xl"
      typing
      lines={[
        "$ npx nessa-ui add button",
        "  ↳ resolving registry…",
        "  ↳ writing components/nessa-ui/button.tsx",
        "✔ installed in 412ms",
      ]}
    />
  ),

  "ascii-art": (
    <div className="w-full overflow-hidden">
      <AsciiArt cols={90} rows={12} density={0.6} />
    </div>
  ),

  ticker: (
    <Ticker
      className="w-full"
      items={["research", "agents", "infrastructure", "nessa-ui"]}
    />
  ),

  "code-block": (
    <CodeBlock
      className="w-full max-w-xl"
      filename="page.tsx"
      showLineNumbers
      code={`export default function Page() {\n  return <Button>hello</Button>\n}`}
    />
  ),

  tabs: (
    <Tabs
      className="w-full max-w-xl"
      items={[
        {
          value: "preview",
          label: "Preview",
          content: <Badge tone="accent">rendered</Badge>,
        },
        {
          value: "code",
          label: "Code",
          content: <CodeBlock code={`<Badge tone="accent">rendered</Badge>`} />,
        },
      ]}
    />
  ),

  input: (
    <Input
      className="w-full max-w-sm"
      prompt="$"
      placeholder="your@email.com"
      aria-label="Email"
    />
  ),

  "cell-grid": (
    <CellGrid className="w-full" cols={3}>
      <Cell>research</Cell>
      <Cell>agents</Cell>
      <Cell>infrastructure</Cell>
    </CellGrid>
  ),

  announce: (
    <Announce label="coming soon" href="#">
      Nessa Agents enters private preview
    </Announce>
  ),

  section: (
    <div className="w-full border border-line">
      <Section
        className="border-b-0 px-6 py-8"
        eyebrow="nessa-ui"
        title="Components"
        description="Everything on this site is built from them."
      >
        <Badge tone="outline">children</Badge>
      </Section>
    </div>
  ),
};
