import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, PropTable, Terminal } from "@/components/nessa-ui";
import { ComponentPreview } from "@/components/site/component-preview";
import { getComponent, registry } from "@/registry";

export function generateStaticParams() {
  return registry.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getComponent(slug);
  if (!doc) return {};
  return { title: doc.name, description: doc.description };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getComponent(slug);
  if (!doc) notFound();

  const index = registry.findIndex((c) => c.slug === slug);
  const prev = registry[index - 1];
  const next = registry[index + 1];

  return (
    <div className="max-w-3xl">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
        {doc.group}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-medium tracking-tight text-fg">
          {doc.name}
        </h1>
        <Badge tone={doc.status === "stable" ? "accent" : "warn"}>
          {doc.status}
        </Badge>
      </div>
      <p className="mt-4 font-mono text-xs leading-6 text-muted">
        {doc.description}
      </p>

      <div className="mt-10">
        <ComponentPreview previewId={doc.slug} code={doc.usage} />
      </div>

      <h2 className="mt-14 mb-4 font-mono text-sm uppercase tracking-[0.18em] text-fg">
        Installation
      </h2>
      <Terminal
        title="nessa@labs"
        lines={[`$ npx nessa-ui@latest add ${doc.slug}`]}
      />

      {doc.examples?.length ? (
        <>
          <h2 className="mt-14 mb-4 font-mono text-sm uppercase tracking-[0.18em] text-fg">
            Examples
          </h2>
          <div className="space-y-8">
            {doc.examples.map((ex) => (
              <div key={ex.id}>
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                  {ex.title}
                </div>
                <ComponentPreview previewId={ex.id} code={ex.code} />
              </div>
            ))}
          </div>
        </>
      ) : null}

      <h2 className="mt-14 mb-4 font-mono text-sm uppercase tracking-[0.18em] text-fg">
        API reference
      </h2>
      <PropTable rows={doc.props} />

      <nav className="mt-16 flex items-center justify-between gap-4 border-t border-line pt-6">
        {prev ? (
          <Link
            href={`/ui/components/${prev.slug}`}
            className="font-mono text-xs text-dim hover:text-fg"
          >
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/ui/components/${next.slug}`}
            className="font-mono text-xs text-dim hover:text-fg"
          >
            {next.name} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
