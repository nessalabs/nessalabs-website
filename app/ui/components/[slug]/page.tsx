import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, CodeBlock, PropTable } from "@/components/nessa-ui";
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
      <div className="mb-2 text-sm font-medium text-accent">{doc.group}</div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">
          {doc.name}
        </h1>
        <Badge tone={doc.status === "stable" ? "accent" : "warn"}>
          {doc.status}
        </Badge>
      </div>
      <p className="mt-4 text-base leading-7 text-muted">{doc.description}</p>

      <div className="mt-10">
        <ComponentPreview previewId={doc.slug} code={doc.usage} />
      </div>

      <h2 className="mt-12 mb-4 text-lg font-semibold text-fg">Installation</h2>
      <CodeBlock
        lang="bash"
        filename="Terminal"
        code={`npx nessa-ui@latest add ${doc.slug}`}
      />

      {doc.examples?.length ? (
        <>
          <h2 className="mt-12 mb-4 text-lg font-semibold text-fg">Examples</h2>
          <div className="space-y-8">
            {doc.examples.map((ex) => (
              <div key={ex.id}>
                <div className="mb-3 text-sm font-medium text-dim">
                  {ex.title}
                </div>
                <ComponentPreview previewId={ex.id} code={ex.code} />
              </div>
            ))}
          </div>
        </>
      ) : null}

      <h2 className="mt-12 mb-4 text-lg font-semibold text-fg">
        API reference
      </h2>
      <PropTable rows={doc.props} />

      <nav className="mt-16 flex items-center justify-between gap-4 border-t border-line pt-6">
        {prev ? (
          <Link
            href={`/ui/components/${prev.slug}`}
            className="text-sm text-dim hover:text-fg"
          >
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/ui/components/${next.slug}`}
            className="text-sm text-dim hover:text-fg"
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
