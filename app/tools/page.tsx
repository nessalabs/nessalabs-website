import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Reference pages for model APIs. Each page is also available as JSON.",
};

const tools = [
  {
    href: "/tools/model-pricing",
    endpoint: "/api/model-pricing",
    name: "Model API pricing",
    description:
      "List prices and published scores on computer-use, coding-agent and research benches, grouped by provider.",
  },
];

export default function ToolsPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Tools
      </h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Reference pages for model APIs. Each page is also a JSON endpoint with
        the same rows.
      </p>

      <ul className="mt-12 divide-y divide-border border-y border-border">
        {tools.map((tool) => (
          <li key={tool.href} className="py-6">
            <Link
              href={tool.href}
              className="text-lg font-medium text-foreground underline-offset-4 hover:underline"
            >
              {tool.name}
            </Link>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{tool.description}</p>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              <Link href={tool.endpoint} className="hover:text-foreground">
                GET {tool.endpoint}
              </Link>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
