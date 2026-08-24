import type { Metadata } from "next";
import { Badge } from "@/components/nessa-ui";

export const metadata: Metadata = { title: "Agents" };

export default function AgentsPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8">
      <Badge tone="warn">Coming soon</Badge>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        Agents
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Long-running agents with real memory, wired into the surfaces you
        already use.
      </p>
    </section>
  );
}
