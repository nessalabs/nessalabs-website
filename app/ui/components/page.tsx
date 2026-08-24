import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Cell, CellGrid, CodeBlock } from "@/components/nessa-ui";
import { groups, registry } from "@/registry";

export const metadata: Metadata = {
  title: "Components",
  description:
    "nessa-ui — the component system behind everything Nessa Labs ships.",
};

export default function ComponentsOverviewPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-2 text-sm font-medium text-dim">nessa-ui</div>
      <h1 className="text-3xl font-semibold tracking-tight text-fg">
        Components
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        The defaults we build on: buttons, inputs, badges, tabs, and the layout
        pieces that hold them together. Components ship as source — once a file
        lands in your repo, it is yours to edit.
      </p>

      <h2 className="mt-12 mb-4 text-lg font-semibold text-fg">Installation</h2>
      <CodeBlock
        lang="bash"
        filename="Terminal"
        code={`npx nessa-ui@latest init
npx nessa-ui@latest add button input badge`}
      />

      <h2 className="mt-10 mb-4 text-lg font-semibold text-fg">Usage</h2>
      <CodeBlock
        filename="app/page.tsx"
        showLineNumbers
        code={`import { Button } from "@/components/nessa-ui"

export default function Page() {
  return <Button>Get started</Button>
}`}
      />

      <h2 className="mt-12 mb-4 text-lg font-semibold text-fg">
        All components
      </h2>
      <div className="space-y-8">
        {groups.map((group) => {
          const items = registry.filter((c) => c.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group}>
              <div className="mb-3 text-sm font-medium text-dim">{group}</div>
              <CellGrid cols={2}>
                {items.map((item) => (
                  <Link key={item.slug} href={`/ui/components/${item.slug}`}>
                    <Cell className="h-full">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-fg">{item.name}</span>
                        <Badge
                          tone={item.status === "stable" ? "neutral" : "warn"}
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-dim">
                        {item.description}
                      </p>
                    </Cell>
                  </Link>
                ))}
              </CellGrid>
            </div>
          );
        })}
      </div>
    </div>
  );
}
