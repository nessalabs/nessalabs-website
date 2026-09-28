import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ModelPricingBrowser } from "@/components/site/model-pricing-browser";

export const metadata: Metadata = {
  title: "Model API pricing",
  description:
    "List prices and published task-bench scores for major model APIs, grouped by provider.",
  alternates: {
    types: {
      "application/json": "/api/model-pricing",
    },
  },
};

export default async function ModelPricingPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.view) ? params.view[0] : params.view;
  const initialView = raw === "benches" ? "benches" : "prices";

  return (
    <div>
      <header className="mx-auto w-full min-w-0 max-w-6xl overflow-x-clip px-6 pt-10 sm:px-8 sm:pt-12">
        <Link
          href="/tools"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Tools
        </Link>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Model API pricing
          </h1>
          <a
            href="/api/model-pricing"
            className="font-mono text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            /api/model-pricing
          </a>
        </div>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          List prices and published task-bench scores for major model APIs. Each bench
          is one board, and an empty cell means that board published no score.
        </p>
      </header>
      <Suspense fallback={<div className="mx-auto w-full max-w-6xl px-6 py-10 text-sm text-muted-foreground sm:px-8">Loading prices.</div>}>
        <ModelPricingBrowser initialView={initialView} />
      </Suspense>
    </div>
  );
}
