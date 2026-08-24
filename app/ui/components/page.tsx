import type { Metadata } from "next";
import Link from "next/link";
import {
  Badge,
  Cell,
  CellGrid,
  CodeBlock,
  Terminal,
} from "@/components/nessa-ui";
import { groups, registry } from "@/registry";

export const metadata: Metadata = {
  title: "nessa-ui",
  description:
    "A monospace, ASCII-first React component library. Copy the source into your app.",
};

export default function ComponentsOverviewPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
        nessa-ui
      </div>
      <h1 className="text-3xl font-medium tracking-tight text-fg">
        Components
      </h1>
      <p className="mt-4 font-mono text-xs leading-6 text-muted">
        {registry.length} components, all monospace, all on the same grid. The
        nessalabs site you are reading is built from nothing else. Components are
        distributed as source: you own the file once it lands in your repo.
      </p>

      <h2 className="mt-12 mb-4 font-mono text-sm uppercase tracking-[0.18em] text-fg">
        Installation
      </h2>
      <Terminal
        title="nessa@labs"
        lines={[
          "$ npx nessa-ui@latest init",
          "$ npx nessa-ui@latest add button ascii-box terminal",
        ]}
      />

      <h2 className="mt-12 mb-4 font-mono text-sm uppercase tracking-[0.18em] text-fg">
        Usage
      </h2>
      <CodeBlock
        filename="app/page.tsx"
        showLineNumbers
        code={`import { AsciiBox, Button } from "@/components/nessa-ui"

export default function Page() {
  return (
    <AsciiBox title="hello" footer="v0.1.0">
      <Button variant="accent" brackets>sync with us</Button>
    </AsciiBox>
  )
}`}
      />

      <h2 className="mt-12 mb-4 font-mono text-sm uppercase tracking-[0.18em] text-fg">
        All components
      </h2>
      <div className="space-y-10">
        {groups.map((group) => {
          const items = registry.filter((c) => c.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group}>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                {group}
              </div>
              <CellGrid cols={2}>
                {items.map((item) => (
                  <Cell key={item.slug}>
                    <Link href={`/ui/components/${item.slug}`} className="block">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-sm text-fg">
                          {item.name}
                        </span>
                        <Badge
                          tone={item.status === "stable" ? "accent" : "warn"}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="mt-2 font-mono text-xs leading-6 text-dim">
                        {item.description}
                      </p>
                    </Link>
                  </Cell>
                ))}
              </CellGrid>
            </div>
          );
        })}
      </div>
    </div>
  );
}
