import type { Metadata } from "next";
import Link from "next/link";
import { Badge, CodeBlock } from "@/components/nessa-ui";
import { groups, registry } from "@/registry";

export const metadata: Metadata = {
  title: "Components",
  description:
    "nessa-ui — the component system behind everything Nessa Labs ships, from primitives to full composites.",
};

export default function ComponentsOverviewPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-2 text-sm font-medium text-dim">nessa-ui</div>
      <h1 className="text-3xl font-semibold tracking-tight text-fg">
        Components
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        {registry.length} components: the primitives you reach for daily, and
        the composites that would otherwise take a week — an application shell,
        a sortable data table, a drag-and-drop board, a month calendar, and a
        pan-and-zoom canvas. Everything ships as source, so once a file lands in
        your repo it is yours to edit.
      </p>

      <h2 className="mt-12 mb-4 text-lg font-semibold text-fg">Installation</h2>
      <CodeBlock
        lang="bash"
        filename="Terminal"
        code={`npx nessa-ui@latest init
npx nessa-ui@latest add button data-table kanban`}
      />

      <h2 className="mt-10 mb-4 text-lg font-semibold text-fg">Usage</h2>
      <CodeBlock
        filename="app/runs/page.tsx"
        showLineNumbers
        code={`import { DataTable, Badge } from "@/components/nessa-ui"

export default function Runs({ rows }) {
  return (
    <DataTable
      columns={[
        { key: "model", header: "Model", sortable: true },
        { key: "score", header: "Score", align: "right", sortable: true },
      ]}
      rows={rows}
      rowKey={(row) => row.id}
      searchKeys={["model"]}
    />
  )
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
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/ui/components/${item.slug}`}
                    className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-dim"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium text-fg">{item.name}</span>
                      {item.status === "beta" ? (
                        <Badge tone="warn">beta</Badge>
                      ) : null}
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-dim">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
