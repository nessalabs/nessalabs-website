import type { Metadata } from "next";
import Link from "next/link";
import { Badge, CodeBlock } from "@/components/nessa-ui";
import { groups, registry } from "@/registry";

export const metadata: Metadata = {
  title: "Components",
  description:
    "nessa-ui — behaviour-first React components: the interaction model is built in, the styling is yours.",
};

const principles = [
  {
    title: "Behaviour, not decoration",
    body: "What ships is the hard part: drag models with real drop targets, pan-zoom-select on a canvas, token streaming, queue steering, resizable panes, keyboard navigation, sorting and paging. The visual defaults are a starting point.",
  },
  {
    title: "Yours to restyle",
    body: "Every component takes className, most take classNames for their parts, and the interactive ones take a render prop — renderNode, renderCard, renderMessage — so you can replace the entire look while the interaction model stays intact.",
  },
  {
    title: "Source, not a dependency",
    body: "Components are copied into your repo. There is no runtime package to version against and nothing to fight when your design diverges from ours.",
  },
  {
    title: "Pure where it counts",
    body: "Dates are ISO strings and today is passed in; streaming is a prop, not a timer you cannot control. Components render the same on the server and the client.",
  },
];

const attribution = [
  {
    name: "React & Next.js",
    what: "The framework and rendering model the library targets.",
    href: "https://nextjs.org",
  },
  {
    name: "Tailwind CSS",
    what: "The token and utility layer our theme is expressed in.",
    href: "https://tailwindcss.com",
  },
  {
    name: "shadcn/ui",
    what: "The copy-the-source distribution model, and the shape of registry-driven docs, follow the path it charted.",
    href: "https://ui.shadcn.com",
  },
  {
    name: "Radix UI",
    what: "Reference for headless component APIs — controlled/uncontrolled pairs, and separating behaviour from presentation.",
    href: "https://www.radix-ui.com",
  },
  {
    name: "WAI-ARIA Authoring Practices",
    what: "Roles, keyboard interaction and focus behaviour for tabs, dialog, menu, switch and separator.",
    href: "https://www.w3.org/WAI/ARIA/apg/",
  },
  {
    name: "Inter & JetBrains Mono",
    what: "Typefaces, used under the SIL Open Font License.",
    href: "https://rsms.me/inter/",
  },
];

export default function ComponentsOverviewPage() {
  const composites = registry.filter((c) => c.group === "Composites");

  return (
    <div className="max-w-3xl">
      <div className="mb-2 text-sm font-medium text-dim">nessa-ui</div>
      <h1 className="text-3xl font-semibold tracking-tight text-fg">
        Components
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        {registry.length} components built behaviour-first. The primitives are
        the ones you reach for daily; the {composites.length} composites —
        application shell, data table, board, calendar, canvas, chat and
        composer — carry the interaction logic that normally costs a week each.
        Styling is entirely yours.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {principles.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-line bg-surface p-4"
          >
            <div className="font-medium text-fg">{item.title}</div>
            <p className="mt-1.5 text-sm leading-6 text-dim">{item.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 mb-4 text-lg font-semibold text-fg">Installation</h2>
      <CodeBlock
        lang="bash"
        filename="Terminal"
        code={`npx nessa-ui@latest init
npx nessa-ui@latest add canvas kanban composer`}
      />

      <h2 className="mt-10 mb-4 text-lg font-semibold text-fg">Usage</h2>
      <CodeBlock
        filename="app/workflow/page.tsx"
        showLineNumbers
        code={`import { Canvas } from "@/components/nessa-ui"

// The canvas owns drag, zoom, selection and edge routing.
// renderNode owns everything you see.
export default function Workflow({ nodes, edges }) {
  return (
    <Canvas
      snap={8}
      nodes={nodes}
      edges={edges}
      renderNode={(node, { selected }) => (
        <WorkflowNode node={node} selected={selected} />
      )}
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

      <h2 className="mt-14 mb-2 text-lg font-semibold text-fg">Attribution</h2>
      <p className="mb-4 text-sm leading-6 text-muted">
        nessa-ui stands on open-source work. Where we followed someone else&apos;s
        pattern, API shape, or research, it is credited here.
      </p>
      <div className="divide-y divide-line rounded-xl border border-line">
        {attribution.map((item) => (
          <div key={item.name} className="p-4">
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-fg underline-offset-4 hover:underline"
            >
              {item.name}
            </a>
            <p className="mt-1 text-sm leading-6 text-dim">{item.what}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-dim">
        Component implementations here are our own; the credits above are for
        ideas, interaction patterns, and the tools we build on. If we ship code
        derived from another project, it will carry that project&apos;s license
        header and appear in this list.
      </p>
    </div>
  );
}
