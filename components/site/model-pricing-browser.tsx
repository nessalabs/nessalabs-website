"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@nessa-ui/react";
import { MONTHS, parseISO } from "@/lib/date";
import {
  CATEGORIES,
  formatUsd,
  modelPricing,
  queryCatalog,
  unitLabel,
  type Bench,
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
          <li key={`${entry.usd}-${entry.unit}-${entry.when ?? index}`} className="text-right">
            {caption ? (
              <span className="mr-2 text-[11px] leading-4 text-muted-foreground">{caption}</span>
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

export function ModelPricingBrowser({
  initialView = "prices",
}: {
  initialView?: "prices" | "benches";
}) {
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
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const urlView = searchParams.get("view") === "benches" ? "benches" : "prices";
  // The server passes the query in, and the address bar takes over after mount.
  // Reading the query during the first client render disagrees with a static shell.
  const view = mounted ? urlView : initialView;

  function hrefFor(next: "prices" | "benches", reset = false) {
    const params = reset ? new URLSearchParams() : new URLSearchParams(searchParams.toString());
    if (next === "benches") params.set("view", "benches");
    else params.delete("view");
    const search = params.toString();
    return search ? `${pathname}?${search}` : pathname;
  }

  const benchRows = result.providers.flatMap((item) =>
    item.models.filter((model) => model.scores?.length).map((model) => ({ provider: item, model })),
  );
  const shownJumps = view === "benches"
    ? benchRows
        .filter((row, index) => benchRows[index - 1]?.provider.id !== row.provider.id)
        .map((row) => ({ id: row.provider.id, name: row.provider.name }))
    : jumps;
  const barRef = React.useRef<HTMLDivElement>(null);
  const [stickyOffset, setStickyOffset] = React.useState(168);

  React.useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const update = () => setStickyOffset(56 + bar.offsetHeight + 16);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ "--pricing-sticky": `${stickyOffset}px` } as React.CSSProperties}>
      <div
        ref={barRef}
        className="sticky top-14 z-40 border-b border-border bg-background/95 backdrop-blur"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-3 sm:px-8 md:flex-row md:items-center md:gap-6">
          <div className="flex min-w-0 items-center gap-3">
            <Input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Filter models"
              aria-label="Filter models"
              className="min-w-0 flex-1 md:w-56 md:flex-none"
            />
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              {view === "benches" ? benchRows.length : result.modelCount}{" "}
              {(view === "benches" ? benchRows.length : result.modelCount) === 1 ? "model" : "models"}
            </span>
          </div>
          <nav aria-label="Providers" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-6 text-muted-foreground md:ml-auto md:justify-end">
            <Link
              href={hrefFor("prices")}
              scroll={false}
              aria-current={view === "prices" ? "page" : undefined}
              className={view === "prices" ? "text-foreground" : "hover:text-foreground"}
            >
              Prices
            </Link>
            <Link
              href={hrefFor("benches")}
              scroll={false}
              aria-current={view === "benches" ? "page" : undefined}
              className={view === "benches" ? "text-foreground" : "hover:text-foreground"}
            >
              Benches
            </Link>
            {shownJumps.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="hover:text-foreground">
                {item.name}
              </a>
            ))}
            {narrowed ? (
              <Link href={hrefFor(view, true)} scroll={false} className="hover:text-foreground">
                Show every provider
              </Link>
            ) : null}
          </nav>
        </div>
      </div>

    <div className="mx-auto w-full min-w-0 max-w-6xl overflow-x-clip px-6 pb-20 sm:px-8">
      {view === "benches" ? (
        <BenchSheet rows={benchRows} benches={result.benches} />
      ) : (
      <div className="mt-8 flex flex-col">
        {result.providers.map((item) => {
          const several = new Set(item.models.map((model) => model.category)).size > 1;
          return (
            <section key={item.id} id={item.id} className="scroll-mt-[var(--pricing-sticky)] border-t border-border py-10 first:border-t-0 first:pt-0">
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

              <div className="mt-2 md:hidden">
                {item.models.map((model, index) => (
                  <React.Fragment key={model.id}>
                    {several && model.category !== item.models[index - 1]?.category ? (
                      <p
                        className={
                          index === 0
                            ? "pb-1 pt-2 text-xs font-medium text-muted-foreground"
                            : "pb-1 pt-6 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {categoryLabel(model.category)}
                      </p>
                    ) : null}
                    <ModelCard model={model} />
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-4 hidden min-w-0 overflow-x-auto md:block">
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
          <section key={gateway.id} id={gateway.id} className="scroll-mt-[var(--pricing-sticky)] border-t border-border py-10">
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
      )}

      <p className="mt-16 text-xs leading-5 text-muted-foreground">
        {view === "benches" ? (
          <>
            Checked {checkedLabel(modelPricing.updated)}. A dash means that source published no score.
            The two OSWorld columns are different task sets.
          </>
        ) : (
          <>
            Checked {checkedLabel(modelPricing.updated)}. The table shows the standard list price.
            Batch and fast tiers are in the JSON.
          </>
        )}
      </p>
    </div>
    </div>
  );
}

function formatBench(bench: Bench, value: number) {
  if (bench.unit === "elo") return Math.round(value).toLocaleString("en-GB");
  return `${value.toFixed(1)}%`;
}

function BenchSheet({
  rows,
  benches,
}: {
  rows: { provider: { id: string; name: string }; model: ModelQuote }[];
  benches: Bench[];
}) {
  if (!rows.length) {
    return <p className="mt-10 text-sm text-muted-foreground">No published scores match.</p>;
  }

  const groups: { id: string; name: string; models: ModelQuote[] }[] = [];
  for (const row of rows) {
    const last = groups[groups.length - 1];
    if (!last || last.id !== row.provider.id) {
      groups.push({ id: row.provider.id, name: row.provider.name, models: [row.model] });
    } else {
      last.models.push(row.model);
    }
  }

  return (
    <div className="mt-8">
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="sticky left-0 z-10 bg-background py-2 pr-4 text-left font-medium">Model</th>
              {benches.map((bench) => (
                <th key={bench.id} className="px-3 py-2 text-right font-medium">
                  <a href={bench.url} target="_blank" rel="noreferrer" className="hover:text-foreground">
                    {bench.name}
                  </a>
                  <span className="mt-0.5 block font-normal">{bench.task}</span>
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group.id} id={group.id} className="scroll-mt-[var(--pricing-sticky)]">
              <tr>
                <td
                  colSpan={benches.length + 1}
                  className="sticky left-0 bg-background pb-1 pt-6 text-xs font-medium text-muted-foreground"
                >
                  {group.name}
                </td>
              </tr>
              {group.models.map((model) => (
                <tr key={model.id} className="border-b border-border align-top">
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-background py-3 pr-4 text-left font-normal"
                  >
                    <div className="font-medium text-foreground">{model.name}</div>
                    <div className="mt-0.5 font-mono text-xs text-muted-foreground">{model.id}</div>
                  </th>
                  {benches.map((bench) => {
                    const entry = model.scores?.find((item) => item.bench === bench.id);
                    return (
                      <td key={bench.id} className="px-3 py-3 text-right">
                        {entry ? (
                          <>
                            <span className="font-mono text-sm tabular-nums text-foreground">
                              {formatBench(bench, entry.value)}
                            </span>
                            {entry.note ? (
                              <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
                                {entry.note}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      <dl className="mt-10 max-w-3xl">
        {benches.map((bench) => (
          <div key={bench.id} className="border-t border-border py-3">
            <dt className="text-sm text-foreground">
              <a
                href={bench.url}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {bench.name}
              </a>
              <span className="text-muted-foreground"> · {bench.task}</span>
            </dt>
            <dd className="mt-1 text-sm leading-6 text-muted-foreground">
              {bench.summary} {bench.protocol}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ModelCard({ model }: { model: ModelQuote }) {
  const rates = model.standard;
  const fields = [
    ["Input", rates.input],
    ["Output", rates.output],
    ["Cache read", rates.cachedInput],
    ["Cache write", rates.cacheWrite],
  ] as const;

  return (
    <article className="border-b border-border py-4">
      <h3 className="font-medium text-foreground">{model.name}</h3>
      <p className="mt-0.5 break-all font-mono text-xs text-muted-foreground">{model.id}</p>
      {model.retiring ? <p className="mt-1 text-xs text-muted-foreground">{model.retiring}</p> : null}
      <dl className="mt-3 grid grid-cols-[6.5rem_minmax(0,1fr)] items-baseline gap-y-1.5">
        {model.context ? (
          <>
            <dt className="text-sm text-muted-foreground">Context</dt>
            <dd className="text-right font-mono text-xs text-muted-foreground">{model.context}</dd>
          </>
        ) : null}
        {fields.map(([label, prices]) =>
          prices?.length ? (
            <React.Fragment key={label}>
              <dt className="text-sm text-muted-foreground">{label}</dt>
              <dd className="min-w-0 text-right">
                <PriceList prices={prices} />
              </dd>
            </React.Fragment>
          ) : null,
        )}
      </dl>
    </article>
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
