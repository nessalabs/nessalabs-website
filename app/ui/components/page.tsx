import type { Metadata } from "next";
import Link from "next/link";
import { SourceBlock } from "@/components/site/source-block";
import { CardArt } from "@/components/site/card-art";
import { groups, registry } from "@/registry";

export const metadata: Metadata = {
  title: "Components",
  description:
    "nessa-ui: React components and tokens for Nessa products.",
};

const principles = [
  {
    title: "Interaction, not appearance",
    body: "What ships is the hard part: drag models, pan and zoom, streaming, focus and keyboard paths.",
  },
  {
    title: "You render the content",
    body: "Calendar events, Gantt bars, board cards and canvas nodes are yours, through render props and children.",
  },
  {
    title: "Compound parts",
    body: "Surfaces are assembled from parts, so you can rearrange one without forking it.",
  },
  {
    title: "Styling stays open",
    body: "Every part carries a data-slot and merges className. Tokens drive light and dark.",
  },
];

const attribution = [
  { name: "React, Next.js", what: "Framework and rendering model.", href: "https://nextjs.org" },
  { name: "Tailwind CSS", what: "Token and utility layer.", href: "https://tailwindcss.com" },
  { name: "Radix UI", what: "Menu, popover, tab and dialog primitives.", href: "https://www.radix-ui.com" },
  { name: "dnd-kit", what: "Drag and drop under the Kanban board.", href: "https://dndkit.com" },
  { name: "shadcn/ui", what: "Source distribution model and registry format.", href: "https://ui.shadcn.com" },
  { name: "Lucide", what: "Default icon set.", href: "https://lucide.dev" },
  { name: "KaTeX, Mermaid, react-markdown", what: "Math, diagram and markdown rendering.", href: "https://katex.org" },
  { name: "WAI-ARIA APG", what: "Roles, keyboard interaction, focus behaviour.", href: "https://www.w3.org/WAI/ARIA/apg/" },
];

export default function ComponentsOverviewPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        nessa-ui
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Accessible React components and tokens for Nessa products: primitives,
        agent surfaces, and composites.
      </p>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        Closer to Radix than to a theme. Components own the behaviour and hand
        you the presentation: <code className="text-foreground">renderEvent</code>{" "}
        and <code className="text-foreground">renderTask</code> for the calendar
        and Gantt, node and card children for the canvas and board, compound
        parts everywhere else. Unlike Radix they arrive with a working default
        skin, painted in tokens rather than fixed color, so you can ship first
        and restyle after.
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
                    className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-colors hover:border-muted-foreground/40"
                  >
                    <CardArt slug={item.slug} />
                    <div className="relative font-medium">{item.name}</div>
                    <p className="relative mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
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
      <p className="mb-4 text-sm text-muted-foreground">
        Open-source work nessa-ui builds on.
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
