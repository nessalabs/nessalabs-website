"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge, Button, Input, SegmentedControl, SegmentedControlOption } from "@nessa-ui/react";
import { MONTHS, parseISO } from "@/lib/date";
import { cn } from "@/lib/cn";
import {
  CATEGORIES,
  TIERS,
  formatUsd,
  modelPricing,
  queryCatalog,
  unitLabel,
  type Category,
  type Price,
  type TierName,
} from "@/lib/model-pricing";

function checkedLabel(iso: string) {
  const date = parseISO(iso);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

function isCategory(value: string): value is Category | "all" {
  return CATEGORIES.some((category) => category.id === value);
}

function isTier(value: string): value is TierName {
  return TIERS.some((tier) => tier.id === value);
}

function PriceList({ prices }: { prices?: Price[] }) {
  if (!prices?.length) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <ul className="flex flex-col gap-1.5">
      {prices.map((entry, index) => {
        const unit = entry.unit === "per_million_tokens" ? null : unitLabel(entry.unit);
        const caption = [unit, entry.when].filter(Boolean).join(" · ");
        return (
          <li key={`${entry.usd}-${entry.unit}-${entry.when ?? index}`}>
            <span className="font-mono text-[13px] tabular-nums text-foreground">
              {formatUsd(entry.usd)}
            </span>
            {caption ? (
              <span className="mt-px block text-[11px] leading-4 text-muted-foreground">
                {caption}
              </span>
            ) : null}
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
  const providerParam = searchParams.get("provider") ?? "all";
  const tierParam = searchParams.get("tier") ?? "standard";

  const category: Category | "all" = isCategory(categoryParam) ? categoryParam : "all";
  const tier: TierName = isTier(tierParam) ? tierParam : "standard";
  const knownProvider =
    providerParam === "all" ||
    modelPricing.providers.some((provider) => provider.id === providerParam) ||
    modelPricing.gateways.some((gateway) => gateway.id === providerParam);
  const provider = knownProvider ? providerParam : "all";

  function writeParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(next)) {
      if (!value) params.delete(key);
      else params.set(key, value);
    }
    const search = params.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  // The field filters immediately. The URL follows after a pause so a fast
  // series of keystrokes cannot be overwritten by an earlier navigation.
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
    provider: provider === "all" ? undefined : provider,
    category: category === "all" ? undefined : category,
    q: q || undefined,
  });

  const endpointParams = new URLSearchParams();
  if (provider !== "all") endpointParams.set("provider", provider);
  if (category !== "all") endpointParams.set("category", category);
  if (q) endpointParams.set("q", q);
  const endpointSearch = endpointParams.toString();
  const endpoint = endpointSearch ? `/api/model-pricing?${endpointSearch}` : "/api/model-pricing";

  const [copied, setCopied] = React.useState(false);

  async function copyEndpoint() {
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <div className="sticky top-14 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-3 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search models, ids, providers"
              aria-label="Search models"
              className="lg:max-w-sm"
            />
            <SegmentedControl
              aria-label="Price tier"
              value={tier}
              onValueChange={(value) =>
                writeParams({ tier: value === "standard" ? null : value })
              }
              className="w-fit"
            >
              {TIERS.map((item) => (
                <SegmentedControlOption key={item.id} value={item.id}>
                  {item.label}
                </SegmentedControlOption>
              ))}
            </SegmentedControl>
            <div className="flex min-w-0 items-center gap-2 lg:ml-auto">
              <a
                href={endpoint}
                className="min-w-0 truncate font-mono text-xs text-muted-foreground hover:text-foreground"
              >
                {endpoint}
              </a>
              <Button type="button" size="sm" variant="outline" onClick={copyEndpoint}>
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          <div className="min-w-0 overflow-x-auto">
            <SegmentedControl
              aria-label="Model category"
              value={category}
              onValueChange={(value) =>
                writeParams({ category: value === "all" ? null : value })
              }
            >
              {CATEGORIES.map((item) => (
                <SegmentedControlOption key={item.id} value={item.id}>
                  {item.label}
                </SegmentedControlOption>
              ))}
            </SegmentedControl>
          </div>

          <div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-0.5">
            <FilterChip
              active={provider === "all"}
              onClick={() => writeParams({ provider: null })}
            >
              All providers
            </FilterChip>
            {modelPricing.providers.map((item) => (
              <FilterChip
                key={item.id}
                active={provider === item.id}
                onClick={() => writeParams({ provider: item.id })}
              >
                {item.name}
              </FilterChip>
            ))}
            {modelPricing.gateways.map((item) => (
              <FilterChip
                key={item.id}
                active={provider === item.id}
                onClick={() => writeParams({ provider: item.id })}
              >
                {item.name}
              </FilterChip>
            ))}
            <span className="ml-auto shrink-0 pl-3 text-xs text-muted-foreground">
              {result.modelCount} {result.modelCount === 1 ? "model" : "models"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-10 sm:px-8">
        {result.providers.map((item) => (
          <section key={item.id} id={item.id} className="scroll-mt-64">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{item.name}</h2>
              <a
                href={item.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Provider pricing
              </a>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{item.billing}</p>

            <div className="mt-5 overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[920px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-secondary text-xs text-muted-foreground">
                    <th className="sticky left-0 z-10 border-r border-border bg-secondary px-3 py-2.5 font-medium">
                      Model
                    </th>
                    <th className="px-3 py-2.5 font-medium">Context</th>
                    <th className="px-3 py-2.5 font-medium">Input</th>
                    <th className="px-3 py-2.5 font-medium">Cache read</th>
                    <th className="px-3 py-2.5 font-medium">Cache write</th>
                    <th className="px-3 py-2.5 font-medium">Output</th>
                  </tr>
                </thead>
                <tbody>
                  {item.models.map((model) => {
                    const rates = model[tier];
                    return (
                      <tr
                        key={model.id}
                        className="border-b border-border align-top last:border-b-0"
                      >
                        <th
                          scope="row"
                          className="sticky left-0 z-10 min-w-56 border-r border-border bg-background px-3 py-3 text-left font-normal"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-foreground">{model.name}</span>
                            <Badge variant="outline">{model.category}</Badge>
                          </div>
                          <div className="mt-1 font-mono text-xs text-muted-foreground">
                            {model.id}
                          </div>
                          {model.retiring ? (
                            <div className="mt-1 text-xs text-muted-foreground">{model.retiring}</div>
                          ) : null}
                          {model.note ? (
                            <p className="mt-1.5 max-w-sm text-xs leading-5 text-muted-foreground">
                              {model.note}
                            </p>
                          ) : null}
                          {!rates && tier !== "standard" ? (
                            <p className="mt-1.5 text-xs text-muted-foreground">
                              No {tier} rate published.
                            </p>
                          ) : null}
                        </th>
                        <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                          {model.context ?? "—"}
                        </td>
                        <td className="px-3 py-3">
                          <PriceList prices={rates?.input} />
                        </td>
                        <td className="px-3 py-3">
                          <PriceList prices={rates?.cachedInput} />
                        </td>
                        <td className="px-3 py-3">
                          <PriceList prices={rates?.cacheWrite} />
                        </td>
                        <td className="px-3 py-3">
                          <PriceList prices={rates?.output} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {result.gateways.map((gateway) => (
          <section key={gateway.id} id={gateway.id} className="scroll-mt-64">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {gateway.name}
              </h2>
              <a
                href={gateway.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Provider pricing
              </a>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {gateway.summary}
            </p>
            <dl className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border">
              {gateway.fees.map((fee) => (
                <div key={fee.name} className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6">
                  <dt className="text-sm font-medium text-foreground">{fee.name}</dt>
                  <dd className="text-sm leading-6 text-muted-foreground">{fee.detail}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        {result.modelCount === 0 && result.gateways.length === 0 ? (
          <p className="text-sm text-muted-foreground">No models match that filter.</p>
        ) : null}

        <p className="text-xs leading-5 text-muted-foreground">
          Checked {checkedLabel(modelPricing.updated)}. Token rates are USD per million tokens
          unless the cell prints another unit. Batch and fast show the published rate for that
          tier. A dash means the provider does not list one.
        </p>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-md px-2.5 py-1 text-sm transition-colors",
        active
          ? "bg-secondary font-medium text-foreground"
          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
