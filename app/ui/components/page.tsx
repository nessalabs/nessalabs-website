import type { Metadata } from "next";
import Link from "next/link";
import { SourceBlock } from "@/components/site/source-block";
import { groups, registry } from "@/registry";

export const metadata: Metadata = {
  title: "Components",
  description:
    "nessa-ui — the React components and tokens behind everything Nessa Labs ships.",
};

const principles = [
  {
    title: "The library itself",
    body: "These pages render @nessa-ui/react, the same package our products import. Nothing here is a re-implementation for the docs.",
  },
  {
    title: "Compound by default",
    body: "Components ship as parts you compose — a ToolCall is a trigger, content and tabs — so a surface can be rearranged without forking it.",
  },
  {
    title: "Behaviour is the product",
    body: "Drag models with real drop targets, pan-zoom canvases, streaming transcripts, keyboard rescheduling, confirmable moves. The visual defaults are a starting point.",
  },
  {
    title: "Tokens, not hard-coded color",
    body: "Every surface is painted with semantic tokens, so light and dark come from one definition and hosts can restyle without patching components.",
  },
];

const attribution = [
  { name: "React & Next.js", what: "The framework and rendering model the library targets.", href: "https://nextjs.org" },
  { name: "Tailwind CSS", what: "The token and utility layer the theme is expressed in.", href: "https://tailwindcss.com" },
  { name: "Radix UI", what: "Primitives behind the menus, popovers, tabs and dialogs.", href: "https://www.radix-ui.com" },
  { name: "dnd-kit", what: "The drag-and-drop engine under the Kanban board.", href: "https://dndkit.com" },
  { name: "shadcn/ui", what: "The copy-the-source distribution model and registry format.", href: "https://ui.shadcn.com" },
  { name: "Lucide", what: "The icon set the components default to.", href: "https://lucide.dev" },
  { name: "KaTeX, Mermaid, react-markdown", what: "Math, diagram and markdown rendering inside message surfaces.", href: "https://katex.org" },
  { name: "WAI-ARIA Authoring Practices", what: "Roles, keyboard interaction and focus behaviour across the set.", href: "https://www.w3.org/WAI/ARIA/apg/" },
];

export default function ComponentsOverviewPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        nessa-ui
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Accessible React components and tokens for Nessa products — primitives,
        the agent surfaces our apps are built from, and composites like the
        calendar, Gantt chart, Kanban board and workflow canvas.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {principles.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-4">
            <div className="font-medium">{item.title}</div>
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 mb-4 text-lg font-semibold">Installation</h2>
      <SourceBlock
        lang="bash"
        code={`npm install @nessa-ui/react

# or take the source, shadcn-style
npx shadcn@latest add https://nessalabs.ai/r/tool-call.json`}
      />

      <h2 className="mt-10 mb-4 text-lg font-semibold">Usage</h2>
      <SourceBlock
        lang="tsx"
        code={`import "@nessa-ui/react/styles.css"
import { ToolCall, ToolCallTabs, ToolCallTrigger } from "@nessa-ui/react"

export function Row() {
  return (
    <ToolCall status="running">
      <ToolCallTrigger meta="run 4192">Evaluating</ToolCallTrigger>
      <ToolCallContent>
        <ToolCallTabs input={input} output={output} />
      </ToolCallContent>
    </ToolCall>
  )
}`}
      />

      <h2 className="mt-12 mb-4 text-lg font-semibold">All components</h2>
      <div className="space-y-8">
        {groups.map((group) => {
          const items = registry.filter((c) => c.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group}>
              <div className="mb-3 text-sm font-medium text-muted-foreground">
                {group}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {items.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/ui/components/${item.slug}`}
                    className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted-foreground/40"
                  >
                    <div className="font-medium">{item.name}</div>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-14 mb-2 text-lg font-semibold">Attribution</h2>
      <p className="mb-4 text-sm leading-6 text-muted-foreground">
        nessa-ui stands on open-source work. Where we build on someone
        else&apos;s library, pattern or research, it is credited here.
      </p>
      <div className="divide-y divide-border rounded-xl border border-border">
        {attribution.map((item) => (
          <div key={item.name} className="p-4">
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline-offset-4 hover:underline"
            >
              {item.name}
            </a>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {item.what}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
