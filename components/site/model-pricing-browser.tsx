"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nessa-ui/react";
import { MONTHS, parseISO } from "@/lib/date";
import {
  CATEGORIES,
  formatUsd,
  modelPricing,
  queryCatalog,
  unitLabel,
  type Category,
  type ModelQuote,
  type Price,
} from "@/lib/model-pricing";

function checkedLabel(iso: string) {
  const date = parseISO(iso);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function isCategory(value: string): value is Category | "all" {
  return CATEGORIES.some((category) => category.id === value);
}

function categoryLabel(category: Category) {
  return CATEGORIES.find((item) => item.id === category)?.label ?? category;
}

function PriceList({ prices }: { prices?: Price[] }) {
  if (!prices?.length) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <ul className="flex flex-col items-end gap-1">
      {prices.map((entry, index) => {
        const unit = entry.unit === "per_million_tokens" ? null : unitLabel(entry.unit);
        const caption = [entry.when, unit].filter(Boolean).join(" ");
        return (
          <li
            key={`${entry.usd}-${entry.unit}-${entry.when ?? index}`}
            className="flex items-baseline justify-end gap-2 whitespace-nowrap"
          >
            {caption ? (
              <span className="text-[11px] leading-4 text-muted-foreground">{caption}</span>
            ) : null}
            <span className="font-mono text-sm tabular-nums text-foreground">
              {formatUsd(entry.usd)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function ModelPricingBrowser() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlQ = searchParams.get("q") ?? "";
  const [q, setQ] = React.useState(urlQ);
  const categoryParam = searchParams.get("category") ?? "all";
  const providerParam = searchParams.get("provider") ?? "";

  const category: Category | "all" = isCategory(categoryParam) ? categoryParam : "all";
  const knownProvider =
    modelPricing.providers.some((provider) => provider.id === providerParam) ||
    modelPricing.gateways.some((gateway) => gateway.id === providerParam);
  const provider = knownProvider ? providerParam : undefined;

  React.useEffect(() => {
    setQ(urlQ);
  }, [urlQ]);

  React.useEffect(() => {
    if (q === urlQ) return;
    const handle = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (q) params.set("q", q);
      else params.delete("q");
      const search = params.toString();
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    }, 200);
    return () => window.clearTimeout(handle);
  }, [q, urlQ, pathname, router]);

  const result = queryCatalog(modelPricing, {
    provider,
    category: category === "all" ? undefined : category,
    q: q || undefined,
  });

  const jumps = [
    ...result.providers.map((item) => ({ id: item.id, name: item.name })),
    ...result.gateways.map((item) => ({ id: item.id, name: item.name })),
  ];

  const narrowed = Boolean(provider || category !== "all");

  return (
    <div className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-8">
      <div className="mt-8 flex items-center gap-4">
        <Input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Filter models"
          aria-label="Filter models"
          className="max-w-xs"
        />
        <span className="ml-auto shrink-0 text-sm tabular-nums text-muted-foreground">
          {result.modelCount} {result.modelCount === 1 ? "model" : "models"}
        </span>
      </div>
      <nav aria-label="Providers" className="mt-4 text-sm leading-6 text-muted-foreground">
        {jumps.map((item, index) => (
          <span key={item.id}>
            {index > 0 ? <span className="mx-2 text-muted-foreground">·</span> : null}
            <a href={`#${item.id}`} className="hover:text-foreground">
              {item.name}
            </a>
          </span>
        ))}
        {narrowed ? (
          <>
            <span className="mx-2 text-muted-foreground">·</span>
            <a href="/tools/model-pricing" className="hover:text-foreground">
              Show every provider
            </a>
          </>
        ) : null}
      </nav>

      <div className="mt-12 flex flex-col">
        {result.providers.map((item) => {
          const several = new Set(item.models.map((model) => model.category)).size > 1;
          return (
            <section key={item.id} id={item.id} className="scroll-mt-20 border-t border-border py-10 first:border-t-0 first:pt-0">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{item.name}</h2>
                <a
                  href={item.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Pricing
                </a>
              </div>
              {item.line ? (
                <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">{item.line}</p>
              ) : null}

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="py-2 pr-4 font-medium">Model</th>
                      <th className="px-3 py-2 font-medium">Context</th>
                      <th className="px-3 py-2 text-right font-medium">Input</th>
                      <th className="px-3 py-2 text-right font-medium">Cache read</th>
                      <th className="px-3 py-2 text-right font-medium">Cache write</th>
                      <th className="py-2 pl-3 text-right font-medium">Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.models.map((model, index) => (
                      <React.Fragment key={model.id}>
                        {several && model.category !== item.models[index - 1]?.category ? (
                          <tr>
                            <td
                              colSpan={6}
                              className={
                                index === 0
                                  ? "pb-1 pt-2 text-xs font-medium text-muted-foreground"
                                  : "pb-1 pt-7 text-xs font-medium text-muted-foreground"
                              }
                            >
                              {categoryLabel(model.category)}
                            </td>
                          </tr>
                        ) : null}
                        <ModelRow model={model} />
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        {result.gateways.map((gateway) => (
          <section key={gateway.id} id={gateway.id} className="scroll-mt-20 border-t border-border py-10">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{gateway.name}</h2>
              <a
                href={gateway.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Pricing
              </a>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{gateway.summary}</p>
            <dl className="mt-4 max-w-2xl">
              {gateway.fees.map((fee) => (
                <div key={fee.name} className="grid gap-1 border-t border-border py-3 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="text-sm text-foreground">{fee.name}</dt>
                  <dd className="text-sm leading-6 text-muted-foreground">{fee.detail}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        {result.modelCount === 0 && result.gateways.length === 0 ? (
          <p className="text-sm text-muted-foreground">No models match.</p>
        ) : null}
      </div>

      <p className="mt-16 text-xs leading-5 text-muted-foreground">
        Checked {checkedLabel(modelPricing.updated)}. The table shows the standard list price.
        Batch and fast tiers are in the JSON.
      </p>
    </div>
  );
}

function ModelRow({ model }: { model: ModelQuote }) {
  const rates = model.standard;
  return (
    <tr className="border-b border-border align-top transition-colors hover:bg-muted/50">
      <th scope="row" className="min-w-52 py-3 pr-4 text-left font-normal">
        <div className="font-medium text-foreground">{model.name}</div>
        <div className="mt-0.5 font-mono text-xs text-muted-foreground">{model.id}</div>
        {model.retiring ? (
          <div className="mt-1 text-xs text-muted-foreground">{model.retiring}</div>
        ) : null}
      </th>
      <td className="px-3 py-3 font-mono text-xs text-muted-foreground">{model.context ?? "—"}</td>
      <td className="px-3 py-3 text-right">
        <PriceList prices={rates.input} />
      </td>
      <td className="px-3 py-3 text-right">
        <PriceList prices={rates.cachedInput} />
      </td>
      <td className="px-3 py-3 text-right">
        <PriceList prices={rates.cacheWrite} />
      </td>
      <td className="py-3 pl-3 text-right">
        <PriceList prices={rates.output} />
      </td>
    </tr>
  );
}
