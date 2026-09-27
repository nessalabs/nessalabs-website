import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ModelPricingBrowser } from "@/components/site/model-pricing-browser";

export const metadata: Metadata = {
  title: "Model API pricing",
  description:
    "Published list prices for major model APIs, grouped by provider, including voice, image and tool meters.",
  alternates: {
    types: {
      "application/json": "/api/model-pricing",
    },
  },
};

export default function ModelPricingPage() {
  return (
    <div>
      <header className="mx-auto w-full max-w-6xl px-6 pt-14 sm:px-8">
        <Link
          href="/tools"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Tools
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Model API pricing
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Published list prices for major model APIs, grouped by provider. The same
          rows are available as JSON at{" "}
          <a
            href="/api/model-pricing"
            className="font-mono text-sm text-foreground underline-offset-4 hover:underline"
          >
            /api/model-pricing
          </a>
          .
        </p>
      </header>
      <Suspense fallback={<div className="mx-auto w-full max-w-6xl px-6 py-10 text-sm text-muted-foreground sm:px-8">Loading prices.</div>}>
        <ModelPricingBrowser />
      </Suspense>
    </div>
  );
}
