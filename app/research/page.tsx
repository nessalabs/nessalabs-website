import type { Metadata } from "next";
import { Badge } from "@/components/nessa-ui";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8">
      <Badge tone="warn">Coming soon</Badge>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        Research
      </h1>
      <p className="mt-4 text-base leading-7 text-muted">
        Papers, evaluations, and open weights from the lab. We publish what we
        can, when it is reproducible.
      </p>
    </section>
  );
}
