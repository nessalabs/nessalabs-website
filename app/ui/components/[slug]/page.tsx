import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CodeBlock } from "@nessa-ui/react";
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
  const wide = doc.group === "Composites";

  return (
    <div className={wide ? "max-w-5xl" : "max-w-3xl"}>
      <div className="mb-2 text-sm font-medium text-muted-foreground">
        {doc.group}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">{doc.name}</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        {doc.description}
      </p>

      <div className="mt-10">
        <ComponentPreview previewId={doc.slug} />
      </div>

      <h2 className="mt-12 mb-4 text-lg font-semibold">Installation</h2>
      <CodeBlock
        language="bash"
        code={`npx shadcn@latest add https://nessalabs.ai/r/${doc.slug}.json`}
      />

      {doc.examples?.length ? (
        <>
          <h2 className="mt-12 mb-4 text-lg font-semibold">Examples</h2>
          <div className="space-y-8">
            {doc.examples.map((example) => (
              <div key={example.id}>
                <div className="mb-3 text-sm font-medium text-muted-foreground">
                  {example.title}
                </div>
                <ComponentPreview previewId={example.id} />
              </div>
            ))}
          </div>
        </>
      ) : null}

      {doc.stories?.length ? (
        <>
          <h2 className="mt-12 mb-2 text-lg font-semibold">
            Behaviours in the library
          </h2>
          <p className="mb-4 text-sm leading-6 text-muted-foreground">
            Every behaviour the component ships with, as covered by its
            storybook. The previews above show a subset.
          </p>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {doc.stories.map((story) => (
              <li key={story.name} className="p-4">
                <div className="text-sm font-medium">
                  {story.name.replace(/([a-z])([A-Z])/g, "$1 $2")}
                </div>
                {story.note ? (
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {story.note}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <nav className="mt-16 flex items-center justify-between gap-4 border-t border-border pt-6">
        {prev ? (
          <Link
            href={`/ui/components/${prev.slug}`}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {prev.name}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/ui/components/${next.slug}`}
            className="text-sm text-muted-foreground hover:text-foreground"
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
