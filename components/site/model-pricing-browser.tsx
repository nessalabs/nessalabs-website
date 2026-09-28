"use client";

import * as React from "react";
import { createPortal } from "react-dom";
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
  type BenchScore,
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

  const narrowed = Boolean(provider || category !== "all");
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const urlView = searchParams.get("view") === "benches" ? "benches" : "prices";
  // The server passes the query in, and the address bar takes over after mount.
  // Reading the query during the first client render disagrees with a static shell.
  const view = mounted ? urlView : initialView;

  function hrefFor(next: "prices" | "benches", reset = false) {
    const params = new URLSearchParams(reset ? undefined : searchParams.toString());
    if (reset) {
      const current = searchParams.get("q");
      if (current) params.set("q", current);
    }
    if (next === "benches") params.set("view", "benches");
    else params.delete("view");
    const search = params.toString();
    return search ? `${pathname}?${search}` : pathname;
  }

  const benchRows = result.providers.flatMap((item) =>
    item.models.filter((model) => model.scores?.length).map((model) => ({ provider: item, model })),
  );
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
              placeholder="Find a model"
              aria-label="Find a model"
              className="min-w-0 flex-1 md:w-56 md:flex-none"
            />
            <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
              {view === "benches" ? benchRows.length : result.modelCount}{" "}
              {(view === "benches" ? benchRows.length : result.modelCount) === 1 ? "model" : "models"}
            </span>
          </div>
          <nav aria-label="View" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-6 text-muted-foreground md:ml-auto md:justify-end">
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
            Prices checked {checkedLabel(modelPricing.updated)}. Bench scores were read from the
            linked boards on 28 September 2026. A dash means that board published no score. The
            OSWorld rows use different task sets.
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

function formatTaskUsd(usd: number) {
  return `$${usd.toFixed(2)}`;
}

const MODEL_ICONS: Record<string, { src: string; dark?: string; invert?: boolean }> = {
  anthropic: { src: "/model-icons/claude-color.svg" },
  openai: { src: "/model-icons/openai.svg", invert: true },
  google: { src: "/model-icons/gemini-color.svg" },
  xai: { src: "/model-icons/grok.svg", invert: true },
  moonshot: { src: "/model-icons/kimi-color.svg", dark: "/model-icons/kimi-color-dark.svg" },
  deepseek: { src: "/model-icons/deepseek-color.svg" },
};

function PointIcon({ providerId, x, y, size }: { providerId: string; x: number; y: number; size: number }) {
  const icon = MODEL_ICONS[providerId];
  if (!icon) return null;
  const box = { x: x - size / 2, y: y - size / 2, width: size, height: size };
  if (icon.dark) {
    return (
      <>
        <image href={icon.src} {...box} className="dark:hidden" />
        <image href={icon.dark} {...box} className="hidden dark:block" />
      </>
    );
  }
  return <image href={icon.src} {...box} className={icon.invert ? "dark:invert" : undefined} />;
}

function ModelIcon({ providerId }: { providerId: string }) {
  const icon = MODEL_ICONS[providerId];
  if (!icon) return null;
  if (icon.dark) {
    return (
      <span aria-hidden className="inline-grid size-3.5 shrink-0 place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon.src} alt="" draggable={false} className="col-start-1 row-start-1 size-3.5 dark:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon.dark} alt="" draggable={false} className="col-start-1 row-start-1 hidden size-3.5 dark:block" />
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={icon.src}
      alt=""
      aria-hidden
      draggable={false}
      className={icon.invert ? "size-3.5 shrink-0 dark:invert" : "size-3.5 shrink-0"}
    />
  );
}

const SERIES = [
  "var(--nessa-chart-series-1-strong)",
  "var(--nessa-chart-series-2-strong)",
  "var(--nessa-chart-series-3-strong)",
  "var(--nessa-chart-series-4-strong)",
  "var(--nessa-chart-series-5-strong)",
  "var(--nessa-chart-series-6-strong)",
  "var(--nessa-chart-series-7-strong)",
  "var(--nessa-chart-series-8-strong)",
];

function BenchCharts({
  rows,
  benches,
}: {
  rows: { provider: { id: string; name: string }; model: ModelQuote }[];
  benches: Bench[];
}) {
  const color = new Map(rows.map((row, index) => [row.model.id, SERIES[index % SERIES.length]]));

  return (
    <div>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">By bench</h2>
      <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
        One chart per board, grouped by the kind of work. Click a name to keep that model, and
        Command-click to add another. On a point chart, hovering a point draws a line at that score
        and marks every point above it.
      </p>
      <div className="mt-8 flex flex-col gap-10">
        {benchGroups(benches).map((group) => (
          <section key={group.task} aria-label={group.task}>
            <h3 className="text-sm font-medium text-muted-foreground">{group.task}</h3>
            <div className="mt-4 flex flex-col gap-8">
              {group.benches.map((bench) => (
                <BenchChart key={bench.id} bench={bench} rows={rows} color={color} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function benchGroups(benches: Bench[]) {
  const groups: { task: string; benches: Bench[] }[] = [];
  for (const bench of benches) {
    const last = groups.at(-1);
    if (last?.task === bench.task) last.benches.push(bench);
    else groups.push({ task: bench.task, benches: [bench] });
  }
  return groups;
}

type ChartPoint = {
  model: ModelQuote;
  providerId: string;
  entry: NonNullable<ModelQuote["scores"]>[number];
};

type CostLevel = { effort: string; value: number; usd: number };

type CostSeries = ChartPoint & { levels: CostLevel[] };

function publishedEffort(note?: string) {
  const match = note?.match(/^(max|xhigh|high|medium|low)\b/i);
  return match ? match[1].toLowerCase() : "";
}

function formatRunUsd(usd: number) {
  const thousands = usd / 1000;
  const text = Number.isInteger(thousands) ? String(thousands) : thousands.toFixed(1);
  return `$${text}k`;
}

function formatCostTick(kind: "task" | "run", usd: number) {
  if (Math.abs(usd) < 0.005) return "$0";
  if (kind === "run") return formatRunUsd(usd);
  const rounded = Math.round(usd * 100) / 100;
  return Number.isInteger(rounded) ? `$${rounded}` : `$${rounded.toFixed(2)}`;
}

/** Cost axis that keeps $0 and compresses the expensive tail. */
function logCost(usd: number) {
  return Math.log10(1 + Math.max(usd, 0));
}

function logCeil(value: number) {
  const pow = 10 ** Math.floor(Math.log10(Math.max(value, 1)));
  const n = value / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 3 ? 3 : n <= 5 ? 5 : 10;
  return nice * pow;
}

function taskTicks(x0: number, x1: number) {
  const span = x1 - x0;
  const candidates = span > 12
    ? [0, 1, 2, 5, 10, 30, 50]
    : span > 4
      ? [0, 0.5, 1, 2, 3, 5, 8, 10, 15, 20]
      : [0, 0.1, 0.2, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10];
  const ticks = candidates.filter((tick) => tick >= x0 - 1e-9 && tick <= x1 + 1e-9);
  return ticks.length >= 2 ? ticks : [x0, (x0 + x1) / 2, x1];
}

function plotSeries(bench: Bench, points: ChartPoint[]) {
  if (bench.unit !== "percent") return null;
  const task = points.flatMap((point) => {
    const levels = (point.entry.levels?.length
      ? point.entry.levels
      : [{ effort: publishedEffort(point.entry.note), value: point.entry.value, usd: point.entry.usd }]
    )
      .filter((level): level is CostLevel => level.usd !== undefined)
      .sort((a, b) => a.usd - b.usd || b.value - a.value);
    return levels.length ? [{ ...point, levels }] : [];
  });
  if (task.length) return { kind: "task" as const, series: task };
  const run = points.flatMap((point) =>
    point.entry.runUsd !== undefined
      ? [{
          ...point,
          levels: [{ effort: publishedEffort(point.entry.note), value: point.entry.value, usd: point.entry.runUsd }],
        }]
      : [],
  );
  if (run.length) return { kind: "run" as const, series: run };
  const levelSeries = points.flatMap((point) => {
    const levels = (point.entry.levels ?? [])
      .filter((level) => level.effort)
      .map((level) => ({ effort: level.effort, value: level.value }));
    return levels.length ? [{ ...point, levels }] : [];
  });
  if (levelSeries.some((item) => item.levels.length > 1)) return { kind: "level" as const, series: levelSeries };
  return null;
}

type PointTone = "idle" | "hover" | "above" | "below";

function pointTone(value: number, key: string, hover: { key: string; value: number } | null): PointTone {
  if (!hover) return "idle";
  if (key === hover.key) return "hover";
  if (value > hover.value + 0.001) return "above";
  if (value < hover.value - 0.001) return "below";
  return "idle";
}

function pointerInViewBox(event: React.MouseEvent, svg: SVGSVGElement, width: number, height: number) {
  const rect = svg.getBoundingClientRect();
  const scale = Math.min(rect.width / width, rect.height / height);
  if (!scale) return null;
  const offsetX = (rect.width - width * scale) / 2;
  const offsetY = (rect.height - height * scale) / 2;
  return {
    x: (event.clientX - rect.left - offsetX) / scale,
    y: (event.clientY - rect.top - offsetY) / scale,
  };
}

function nearestPlotHit<T extends { x: number; y: number }>(hits: T[], x: number, y: number, radius = 16) {
  let best: T | null = null;
  let bestD = radius * radius;
  for (const hit of hits) {
    const distance = (hit.x - x) ** 2 + (hit.y - y) ** 2;
    if (distance < bestD) {
      best = hit;
      bestD = distance;
    }
  }
  return best;
}

function ScoreGuide({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <line
      data-score-guide=""
      x1={x1}
      x2={x2}
      y1={y}
      y2={y}
      strokeWidth="2"
      strokeDasharray="7 5"
      className="stroke-foreground"
      vectorEffect="non-scaling-stroke"
      pointerEvents="none"
    />
  );
}

function PointFace({
  tone,
  x,
  y,
  stroke,
  providerId,
  children,
}: {
  tone: PointTone;
  x: number;
  y: number;
  stroke: string;
  providerId: string;
  children?: React.ReactNode;
}) {
  return (
    <g opacity={tone === "below" ? 0.35 : 1}>
      {tone === "above" ? (
        <circle cx={x} cy={y} r="14" fill={stroke} fillOpacity="0.22" stroke={stroke} strokeWidth="1.5" />
      ) : null}
      {tone === "hover" ? <circle cx={x} cy={y} r="13" fill="none" stroke={stroke} strokeWidth="2" /> : null}
      <circle cx={x} cy={y} r="12" fill="transparent" />
      <circle
        cx={x}
        cy={y}
        r="9"
        className="fill-background"
        stroke={stroke}
        strokeWidth={tone === "hover" || tone === "above" ? 2 : 1.5}
      />
      <PointIcon providerId={providerId} x={x} y={y} size={12} />
      {children}
    </g>
  );
}

function ScoreCostChart({
  bench,
  series,
  kind,
}: {
  bench: Bench;
  series: CostSeries[];
  kind: "task" | "run";
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const pinned = React.useRef(false);
  const tipKey = React.useRef<string | null>(null);
  const [picked, setPicked] = React.useState<string[]>([]);
  const [active, setActive] = React.useState<string | null>(null);
  const [tip, setTip] = React.useState<{
    key: string;
    x: number;
    y: number;
    below: boolean;
    name: string;
    providerId: string;
    effort: string;
    value: number;
    usd: number;
  } | null>(null);
  const shown = picked.length ? series.filter((item) => picked.includes(item.model.id)) : series;
  const width = 720;
  const height = 340;
  const pad = { left: 36, right: 16, top: 28, bottom: 36 };
  const useLog = kind === "task";
  const step = kind === "run" ? 2000 : 5;
  const costs = shown.flatMap((item) => item.levels.map((level) => level.usd));
  const costLo = Math.min(...costs);
  const costHi = Math.max(...costs);
  const zoomed = picked.length > 0 && costHi > costLo;
  let x0: number;
  let x1: number;
  if (useLog && zoomed) {
    const padDecades = Math.max((logCost(costHi) - logCost(costLo)) * 0.18, 0.04);
    x0 = Math.max(0, 10 ** (logCost(costLo) - padDecades) - 1);
    x1 = 10 ** (logCost(costHi) + padDecades) - 1;
  } else if (useLog) {
    x0 = 0;
    x1 = logCeil(costHi);
  } else if (zoomed) {
    x0 = Math.max(0, costLo - Math.max((costHi - costLo) * 0.18, 400));
    x1 = costHi + Math.max((costHi - costLo) * 0.18, 400);
  } else {
    x0 = 0;
    x1 = Math.ceil(costHi / step) * step;
  }
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const xAt = (usd: number) => {
    if (!useLog) return pad.left + ((usd - x0) / (x1 - x0 || 1)) * plotWidth;
    return pad.left + ((logCost(usd) - logCost(x0)) / (logCost(x1) - logCost(x0) || 1)) * plotWidth;
  };
  const yAt = (value: number) => pad.top + (1 - value / 100) * plotHeight;
  const yTicks = [0, 25, 50, 75, 100];
  const xTicks = useLog
    ? taskTicks(x0, x1)
    : zoomed
      ? [0, 1, 2, 3, 4].map((index) => x0 + ((x1 - x0) * index) / 4)
      : Array.from({ length: x1 / step + 1 }, (_, index) => index * step);
  const axisLabel = kind === "run" ? "cost of the full run" : "mean cost per task, on a log scale";
  const hits = shown.flatMap((item) =>
    item.levels.map((level) => ({
      key: `${item.model.id}-${level.effort}`,
      x: xAt(level.usd),
      y: yAt(level.value),
      item,
      level,
    })),
  );

  function showTip(event: React.MouseEvent, item: CostSeries, level: CostLevel) {
    const bounds = wrapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const key = `${item.model.id}-${level.effort}`;
    const x = Math.min(Math.max(event.clientX - bounds.left, 72), bounds.width - 72);
    const y = event.clientY - bounds.top;
    tipKey.current = key;
    setActive(item.model.id);
    setTip({
      key,
      x,
      y,
      below: y < 36,
      name: item.model.name,
      providerId: item.providerId,
      effort: level.effort,
      value: level.value,
      usd: level.usd,
    });
  }

  function clearTip() {
    if (pinned.current || tipKey.current === null) return;
    tipKey.current = null;
    setActive(null);
    setTip(null);
  }

  function dismiss() {
    pinned.current = false;
    tipKey.current = null;
    setActive(null);
    setTip(null);
  }

  function hitFrom(event: React.MouseEvent) {
    const svg = svgRef.current;
    if (!svg) return null;
    const point = pointerInViewBox(event, svg, width, height);
    if (!point) return null;
    return nearestPlotHit(hits, point.x, point.y);
  }

  return (
    <div
      ref={wrapRef}
      className="relative rounded-md border border-border bg-muted/30 px-3 py-3"
      onClick={dismiss}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${bench.name}. Score against ${axisLabel}.`}
        className="h-80 w-full sm:h-96"
        onPointerMove={(event) => {
          if (pinned.current) return;
          const hit = hitFrom(event);
          if (!hit) {
            clearTip();
            return;
          }
          if (hit.key === tipKey.current) return;
          showTip(event, hit.item, hit.level);
        }}
        onPointerLeave={clearTip}
        onClick={(event) => {
          const hit = hitFrom(event);
          if (!hit) return;
          event.stopPropagation();
          pinned.current = true;
          showTip(event, hit.item, hit.level);
        }}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={yAt(tick)} y2={yAt(tick)} className="stroke-border" />
            <text x={pad.left - 8} y={yAt(tick) + 3} textAnchor="end" className="fill-muted-foreground text-[11px]">
              {tick}
            </text>
          </g>
        ))}
        {xTicks.map((tick, index) => (
          <g key={tick}>
            {useLog && tick > 0 ? (
              <line x1={xAt(tick)} x2={xAt(tick)} y1={pad.top} y2={height - pad.bottom} className="stroke-border" />
            ) : null}
            <text
              x={xAt(tick)}
              y={height - 8}
              textAnchor={index === 0 ? "start" : index === xTicks.length - 1 ? "end" : "middle"}
              className="fill-muted-foreground text-[11px]"
            >
              {formatCostTick(kind, tick)}
            </text>
          </g>
        ))}
        {tip ? <ScoreGuide x1={pad.left} x2={width - pad.right} y={yAt(tip.value)} /> : null}
        {series
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => picked.length === 0 || picked.includes(item.model.id))
          .reverse()
          .map(({ item, index }) => {
            const stroke = SERIES[index % SERIES.length];
            const dashed = index >= SERIES.length;
            const path = item.levels.map((level) => `${xAt(level.usd)},${yAt(level.value)}`).join(" ");
            const quiet = tip !== null && active !== item.model.id;
            return (
              <g key={item.model.id}>
                {item.levels.length > 1 ? (
                  <polyline
                    points={path}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={active === item.model.id ? 2.5 : 1.75}
                    strokeDasharray={dashed ? "6 4" : undefined}
                    vectorEffect="non-scaling-stroke"
                    opacity={quiet ? 0.45 : 1}
                  />
                ) : null}
                {item.levels.map((level) => {
                  const key = `${item.model.id}-${level.effort}`;
                  const x = xAt(level.usd);
                  const y = yAt(level.value);
                  return (
                    <g
                      key={key}
                      aria-label={`${item.model.name}${level.effort ? `, ${level.effort}` : ""}`}
                      className="cursor-pointer"
                    >
                      <PointFace tone={pointTone(level.value, key, tip)} x={x} y={y} stroke={stroke} providerId={item.providerId}>
                        {picked.length === 1 && item.levels.length > 1 ? (
                          <text
                            x={x}
                            y={y > pad.top + 18 ? y - 14 : y + 18}
                            textAnchor={x < pad.left + 36 ? "start" : x > width - pad.right - 36 ? "end" : "middle"}
                            className="fill-foreground text-[11px]"
                          >
                            {level.effort}
                          </text>
                        ) : null}
                      </PointFace>
                    </g>
                  );
                })}
              </g>
            );
          })}
      </svg>
      {tip ? (
        <div
          className={`pointer-events-none absolute z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-background px-2 py-1 text-xs text-foreground shadow-sm ${tip.below ? "translate-y-2" : "-translate-y-[calc(100%+10px)]"}`}
          style={{ left: tip.x, top: tip.y }}
        >
          <ModelIcon providerId={tip.providerId} />
          <span>{tip.name}</span>
          {tip.effort ? (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] leading-4 text-muted-foreground">
              {tip.effort}
            </span>
          ) : null}
          <span className="tabular-nums text-muted-foreground">
            {formatBench(bench, tip.value)}
            {" · "}
            {kind === "run" ? `Run ${formatRunUsd(tip.usd)}` : `${formatTaskUsd(tip.usd)} a task`}
          </span>
        </div>
      ) : null}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {series.map((item, index) => {
          const stroke = SERIES[index % SERIES.length];
          const dashed = index >= SERIES.length;
          const selected = picked.includes(item.model.id);
          return (
            <li key={item.model.id} className={picked.length > 0 && !selected ? "opacity-40" : undefined}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={(event) => {
                  event.stopPropagation();
                  dismiss();
                  setPicked((current) => {
                    if (event.metaKey || event.ctrlKey) {
                      return current.includes(item.model.id)
                        ? current.filter((id) => id !== item.model.id)
                        : [...current, item.model.id];
                    }
                    if (current.length === 1 && current[0] === item.model.id) return [];
                    return [item.model.id];
                  });
                }}
                className="flex cursor-pointer items-center gap-1.5 text-left text-xs text-foreground"
              >
                <svg width="16" height="8" aria-hidden className="shrink-0">
                  {item.levels.length > 1 ? (
                    <line
                      x1="0"
                      y1="4"
                      x2="16"
                      y2="4"
                      stroke={stroke}
                      strokeWidth="2"
                      strokeDasharray={dashed ? "3 2" : undefined}
                    />
                  ) : (
                    <circle cx="8" cy="4" r="2.5" fill={stroke} />
                  )}
                </svg>
                <ModelIcon providerId={item.providerId} />
                <span>{item.model.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {picked.length > 0
        ? shown
            .filter((item) => item.levels.length > 1)
            .map((item) => (
              <div key={item.model.id} className="mt-3">
                {picked.length > 1 ? <p className="text-xs font-medium text-foreground">{item.model.name}</p> : null}
                <ul className="flex flex-col gap-0.5 text-xs leading-5 text-muted-foreground">
                  {item.levels.map((level) => (
                    <li key={level.effort || "score"}>
                      {level.effort ? `${level.effort} ` : ""}
                      {formatBench(bench, level.value)} · {kind === "run" ? `Run ${formatRunUsd(level.usd)}` : `${formatTaskUsd(level.usd)} a task`}
                    </li>
                  ))}
                </ul>
              </div>
            ))
        : null}
    </div>
  );
}

const EFFORT_ORDER = ["low", "medium", "high", "xhigh", "max", "thinking", "enabled"];

function effortRank(effort: string) {
  const index = EFFORT_ORDER.indexOf(effort);
  return index === -1 ? EFFORT_ORDER.length : index;
}

type LevelSeries = ChartPoint & { levels: { effort: string; value: number }[] };

function ScoreLevelChart({ bench, series }: { bench: Bench; series: LevelSeries[] }) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const pinned = React.useRef(false);
  const tipKey = React.useRef<string | null>(null);
  const [picked, setPicked] = React.useState<string[]>([]);
  const [active, setActive] = React.useState<string | null>(null);
  const [tip, setTip] = React.useState<{
    key: string;
    x: number;
    y: number;
    below: boolean;
    name: string;
    providerId: string;
    effort: string;
    value: number;
  } | null>(null);
  const shown = picked.length ? series.filter((item) => picked.includes(item.model.id)) : series;
  const width = 720;
  const height = 340;
  const pad = { left: 36, right: 20, top: 28, bottom: 36 };
  const efforts = [...new Set(shown.flatMap((item) => item.levels.map((level) => level.effort)))].sort(
    (a, b) => effortRank(a) - effortRank(b),
  );
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const yAt = (value: number) => pad.top + (1 - value / 100) * plotHeight;
  const xAt = (effort: string) => {
    const index = efforts.indexOf(effort);
    if (efforts.length <= 1) return pad.left + plotWidth / 2;
    return pad.left + (index / (efforts.length - 1)) * plotWidth;
  };
  const placed = new Map<string, { x: number; y: number }>();
  for (const effort of efforts) {
    const column = shown.flatMap((item) =>
      item.levels
        .filter((level) => level.effort === effort)
        .map((level) => ({ key: `${item.model.id}-${level.effort}`, value: level.value })),
    );
    const sorted = [...column].sort((a, b) => a.value - b.value);
    let cluster: typeof sorted = [];
    const flush = () => {
      if (!cluster.length) return;
      const mid = (cluster.length - 1) / 2;
      const raw = cluster.map((_, index) => xAt(effort) + (index - mid) * 18);
      const room = 16;
      let shift = 0;
      const maxX = Math.max(...raw);
      const minX = Math.min(...raw);
      if (maxX > width - pad.right - room) shift = width - pad.right - room - maxX;
      if (minX + shift < pad.left + room) shift += pad.left + room - (minX + shift);
      cluster.forEach((point, index) => {
        placed.set(point.key, { x: raw[index] + shift, y: yAt(point.value) });
      });
      cluster = [];
    };
    for (const point of sorted) {
      if (cluster.length && point.value - cluster[cluster.length - 1].value > 8) flush();
      cluster.push(point);
    }
    flush();
  }
  const yTicks = [0, 25, 50, 75, 100];

  const hits = shown.flatMap((item) =>
    item.levels.flatMap((level) => {
      const point = placed.get(`${item.model.id}-${level.effort}`);
      return point ? [{ key: `${item.model.id}-${level.effort}`, x: point.x, y: point.y, item, level }] : [];
    }),
  );

  function showTip(
    event: React.MouseEvent,
    item: LevelSeries,
    level: { effort: string; value: number },
  ) {
    const bounds = wrapRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const key = `${item.model.id}-${level.effort}`;
    const x = Math.min(Math.max(event.clientX - bounds.left, 72), bounds.width - 72);
    const y = event.clientY - bounds.top;
    tipKey.current = key;
    setActive(item.model.id);
    setTip({
      key,
      x,
      y,
      below: y < 36,
      name: item.model.name,
      providerId: item.providerId,
      effort: level.effort,
      value: level.value,
    });
  }

  function clearTip() {
    if (pinned.current || tipKey.current === null) return;
    tipKey.current = null;
    setActive(null);
    setTip(null);
  }

  function dismiss() {
    pinned.current = false;
    tipKey.current = null;
    setActive(null);
    setTip(null);
  }

  function hitFrom(event: React.MouseEvent) {
    const svg = svgRef.current;
    if (!svg) return null;
    const point = pointerInViewBox(event, svg, width, height);
    if (!point) return null;
    return nearestPlotHit(hits, point.x, point.y);
  }

  return (
    <div
      ref={wrapRef}
      className="relative rounded-md border border-border bg-muted/30 px-3 py-3"
      onClick={dismiss}
    >
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${bench.name}. Score against thinking level.`}
        className="h-80 w-full sm:h-96"
        onPointerMove={(event) => {
          if (pinned.current) return;
          const hit = hitFrom(event);
          if (!hit) {
            clearTip();
            return;
          }
          if (hit.key === tipKey.current) return;
          showTip(event, hit.item, hit.level);
        }}
        onPointerLeave={clearTip}
        onClick={(event) => {
          const hit = hitFrom(event);
          if (!hit) return;
          event.stopPropagation();
          pinned.current = true;
          showTip(event, hit.item, hit.level);
        }}
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={yAt(tick)} y2={yAt(tick)} className="stroke-border" />
            <text x={pad.left - 8} y={yAt(tick) + 3} textAnchor="end" className="fill-muted-foreground text-[11px]">
              {tick}
            </text>
          </g>
        ))}
        {efforts.map((effort, index) => (
          <g key={effort}>
            <line x1={xAt(effort)} x2={xAt(effort)} y1={pad.top} y2={height - pad.bottom} className="stroke-border" />
            <text
              x={xAt(effort)}
              y={height - 8}
              textAnchor={index === 0 ? "start" : index === efforts.length - 1 ? "end" : "middle"}
              className="fill-muted-foreground text-[11px]"
            >
              {effort}
            </text>
          </g>
        ))}
        {tip ? <ScoreGuide x1={pad.left} x2={width - pad.right} y={yAt(tip.value)} /> : null}
        {series
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => picked.length === 0 || picked.includes(item.model.id))
          .reverse()
          .map(({ item, index }) => {
            const stroke = SERIES[index % SERIES.length];
            const dashed = index >= SERIES.length;
            const ordered = [...item.levels].sort((a, b) => effortRank(a.effort) - effortRank(b.effort));
            const path = ordered
              .map((level) => {
                const point = placed.get(`${item.model.id}-${level.effort}`);
                return point ? `${point.x},${point.y}` : "";
              })
              .filter(Boolean)
              .join(" ");
            const quiet = tip !== null && active !== item.model.id;
            return (
              <g key={item.model.id}>
                {ordered.length > 1 ? (
                  <polyline
                    points={path}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={active === item.model.id ? 2.5 : 1.75}
                    strokeDasharray={dashed ? "6 4" : undefined}
                    vectorEffect="non-scaling-stroke"
                    opacity={quiet ? 0.45 : 1}
                  />
                ) : null}
                {ordered.map((level) => {
                  const point = placed.get(`${item.model.id}-${level.effort}`);
                  if (!point) return null;
                  const key = `${item.model.id}-${level.effort}`;
                  return (
                    <g
                      key={key}
                      aria-label={`${item.model.name}, ${level.effort}`}
                      className="cursor-pointer"
                    >
                      <PointFace tone={pointTone(level.value, key, tip)} x={point.x} y={point.y} stroke={stroke} providerId={item.providerId} />
                    </g>
                  );
                })}
              </g>
            );
          })}
      </svg>
      {tip ? (
        <div
          className={`pointer-events-none absolute z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-background px-2 py-1 text-xs text-foreground shadow-sm ${tip.below ? "translate-y-2" : "-translate-y-[calc(100%+10px)]"}`}
          style={{ left: tip.x, top: tip.y }}
        >
          <ModelIcon providerId={tip.providerId} />
          <span>{tip.name}</span>
          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] leading-4 text-muted-foreground">
            {tip.effort}
          </span>
          <span className="tabular-nums text-muted-foreground">{formatBench(bench, tip.value)}</span>
        </div>
      ) : null}
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {series.map((item, index) => {
          const stroke = SERIES[index % SERIES.length];
          const dashed = index >= SERIES.length;
          const selected = picked.includes(item.model.id);
          return (
            <li key={item.model.id} className={picked.length > 0 && !selected ? "opacity-40" : undefined}>
              <button
                type="button"
                aria-pressed={selected}
                onClick={(event) => {
                  event.stopPropagation();
                  dismiss();
                  setPicked((current) => {
                    if (event.metaKey || event.ctrlKey) {
                      return current.includes(item.model.id)
                        ? current.filter((id) => id !== item.model.id)
                        : [...current, item.model.id];
                    }
                    if (current.length === 1 && current[0] === item.model.id) return [];
                    return [item.model.id];
                  });
                }}
                className="flex cursor-pointer items-center gap-1.5 text-left text-xs text-foreground"
              >
                <svg width="16" height="8" aria-hidden className="shrink-0">
                  {item.levels.length > 1 ? (
                    <line
                      x1="0"
                      y1="4"
                      x2="16"
                      y2="4"
                      stroke={stroke}
                      strokeWidth="2"
                      strokeDasharray={dashed ? "3 2" : undefined}
                    />
                  ) : (
                    <circle cx="8" cy="4" r="2.5" fill={stroke} />
                  )}
                </svg>
                <ModelIcon providerId={item.providerId} />
                <span>{item.model.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {picked.length > 0
        ? shown
            .filter((item) => item.levels.length > 1 || item.entry.note)
            .map((item) => (
              <div key={item.model.id} className="mt-3">
                {picked.length > 1 ? <p className="text-xs font-medium text-foreground">{item.model.name}</p> : null}
                {item.levels.length > 1 ? (
                  <ul className="flex flex-col gap-0.5 text-xs leading-5 text-muted-foreground">
                    {[...item.levels]
                      .sort((a, b) => effortRank(a.effort) - effortRank(b.effort))
                      .map((level) => (
                        <li key={level.effort}>
                          {level.effort} {formatBench(bench, level.value)}
                        </li>
                      ))}
                  </ul>
                ) : null}
                {item.entry.note ? <p className="text-xs leading-5 text-muted-foreground">{item.entry.note}</p> : null}
              </div>
            ))
        : null}
    </div>
  );
}

function BenchChart({
  bench,
  rows,
  color,
}: {
  bench: Bench;
  rows: { provider: { id: string; name: string }; model: ModelQuote }[];
  color: Map<string, string>;
}) {
  const points: ChartPoint[] = rows
    .flatMap((row) => {
      const entry = row.model.scores?.find((item) => item.bench === bench.id);
      return entry ? [{ model: row.model, providerId: row.provider.id, entry }] : [];
    })
    .sort((a, b) => b.entry.value - a.entry.value);
  if (!points.length) return null;
  const plot = plotSeries(bench, points);
  const percent = bench.unit === "percent";
  const max = percent ? 100 : Math.max(...points.map((point) => point.entry.value));
  const min = percent ? 0 : Math.min(...points.map((point) => point.entry.value));
  const span = max - min || 1;
  const ticks = percent ? [0, 25, 50, 75, 100] : [Math.round(min), Math.round(max)];
  const columns = "grid-cols-[8.25rem_minmax(0,1fr)_3.75rem] sm:grid-cols-[12.5rem_minmax(0,1fr)_4rem]";
  return (
    <figure>
      <figcaption>
        <h4 className="text-sm font-medium text-foreground">{bench.name}</h4>
        {plot ? (
          <p className="text-xs text-muted-foreground">
            {plot.kind === "run"
              ? "The vertical axis is the score and the horizontal axis is the cost of the full run."
              : plot.kind === "level"
                ? "The vertical axis is the score and the horizontal axis is the thinking level."
                : "The vertical axis is the score and the horizontal axis is the mean cost per task, on a log scale."}
          </p>
        ) : points.some((point) => (point.entry.levels?.length ?? 0) > 1) ? (
          <p className="text-xs text-muted-foreground">
            {points.some((point) => point.entry.levels?.some((level) => level.usd !== undefined))
              ? "Each thinking level that board published, with its mean cost per task."
              : "Each thinking level that board published."}
          </p>
        ) : percent ? null : (
          <p className="text-xs text-muted-foreground">Bars show the spread between these scores.</p>
        )}
      </figcaption>
      <div className="mt-3 grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_15rem] md:gap-x-8">
      <div className="min-w-0">
      {plot?.kind === "level" ? (
        <ScoreLevelChart bench={bench} series={plot.series} />
      ) : plot ? (
        <ScoreCostChart bench={bench} series={plot.series} kind={plot.kind} />
      ) : (
      <div className="rounded-md border border-border bg-muted/30 px-3 py-3">
        <div className="relative">
          {percent ? (
            <div className={`pointer-events-none absolute inset-0 grid gap-x-2 ${columns}`} aria-hidden>
              <span />
              <span className="relative">
                {ticks
                  .filter((tick) => tick > 0 && tick < 100)
                  .map((tick) => (
                    <span
                      key={tick}
                      className="absolute inset-y-0 border-l border-border"
                      style={{ left: `${tick}%` }}
                    />
                  ))}
              </span>
              <span />
            </div>
          ) : null}
          <ul className="relative flex flex-col gap-2.5">
          {points.map((point) => {
            const ladder = (point.entry.levels?.length ?? 0) > 1 ? point.entry.levels! : null;
            const reads = ladder ?? [{ effort: point.entry.note ?? "", value: point.entry.value, usd: point.entry.usd }];
            return reads.map((level, index) => {
              const width = percent
                ? (level.value / max) * 100
                : Math.max(((level.value - min) / span) * 100, points.length > 1 ? 3 : 100);
              const label = ladder ? `${point.model.name}, ${level.effort}` : point.model.name;
              return (
                <li
                  key={ladder ? `${point.model.id}-${level.effort}` : point.model.id}
                  className={`grid items-center gap-x-2 ${columns} ${index === 0 ? "mt-3 first:mt-0" : ""}`}
                >
                  {index === 0 ? (
                    <span className="flex min-w-0 items-start gap-1.5">
                      <span className="mt-0.5">
                        <ModelIcon providerId={point.providerId} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs text-foreground" title={point.model.name}>
                          {point.model.name}
                        </span>
                        {point.entry.note ? (
                          <span className="block text-[11px] leading-4 text-muted-foreground">{point.entry.note}</span>
                        ) : null}
                        {ladder ? (
                          <span className="block text-[11px] leading-4 text-muted-foreground">{level.effort}</span>
                        ) : null}
                      </span>
                    </span>
                  ) : (
                    <span className="truncate pl-5 text-[11px] leading-4 text-muted-foreground">{level.effort}</span>
                  )}
                  <div
                    className="relative h-2.5"
                    role="meter"
                    aria-valuenow={level.value}
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-label={`${label}, ${bench.name}`}
                  >
                    <span
                      className="absolute inset-y-0 left-0 rounded-sm"
                      style={{ width: `${width}%`, background: color.get(point.model.id) }}
                    />
                  </div>
                  <span className="text-right font-mono text-xs tabular-nums text-foreground">
                    <span className="block">{formatBench(bench, level.value)}</span>
                    {level.usd !== undefined ? (
                      <span className="block text-[11px] text-muted-foreground">{formatTaskUsd(level.usd)}</span>
                    ) : null}
                  </span>
                </li>
              );
            });
          })}
        </ul>
        </div>
        <div className={`mt-2 grid gap-x-2 ${columns}`} aria-hidden>
          <span />
          <div className="flex justify-between text-[10px] tabular-nums text-muted-foreground">
            {ticks.map((tick) => (
              <span key={tick}>{percent ? tick : tick.toLocaleString("en-GB")}</span>
            ))}
          </div>
          <span />
        </div>
      </div>
      )}
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{bench.reading}</p>
      </div>
    </figure>
  );
}

type ScoreLine = { key: string; best: boolean; text: string; wrap?: boolean };

/** Best score in the cell. Hover lists every published figure for that score. */
function scoreReadout(bench: Bench, entry: BenchScore): { effort: string; lines: ScoreLine[]; caveat: string | null } {
  const levels = entry.levels ?? [];
  if (levels.length > 1) {
    const effort = levels.find((level) => level.value === entry.value)?.effort ?? "";
    const lines: ScoreLine[] = levels.map((level) => ({
      key: level.effort,
      best: level.effort === effort && level.value === entry.value,
      text: `${level.effort} ${formatBench(bench, level.value)}${level.usd !== undefined ? ` · ${formatTaskUsd(level.usd)} a task` : ""}`,
    }));
    if (entry.note) lines.push({ key: "note", best: false, text: entry.note, wrap: true });
    return { effort, caveat: null, lines };
  }
  const effort = (levels.length === 1 ? levels[0].effort : "") || publishedEffort(entry.note);
  const lines: ScoreLine[] = [];
  const noteIsEffort = Boolean(
    entry.note && effort && entry.note.replace(/\.+$/, "").trim().toLowerCase() === effort,
  );
  if (entry.note && !noteIsEffort && effort) lines.push({ key: "note", best: false, text: entry.note, wrap: true });
  if (!effort && entry.note && entry.usd !== undefined) lines.push({ key: "note", best: false, text: entry.note, wrap: true });
  if (entry.usd !== undefined) lines.push({ key: "usd", best: false, text: `${formatTaskUsd(entry.usd)} a task` });
  const caveat = !effort && entry.note && entry.usd === undefined ? entry.note : null;
  return { effort, lines, caveat };
}

function ScoreTip({ lines, children }: { lines: ScoreLine[]; children: React.ReactNode }) {
  const id = React.useId();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const touch = React.useRef(false);
  const [place, setPlace] = React.useState<{ left: number; top: number; above: boolean } | null>(null);

  function show() {
    const node = buttonRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const width = 240;
    const center = rect.left + rect.width / 2;
    const left = Math.min(Math.max(center, width / 2 + 12), window.innerWidth - width / 2 - 12);
    const above = rect.bottom + 160 > window.innerHeight && rect.top > 160;
    setPlace({ left, top: above ? rect.top - 6 : rect.bottom + 6, above });
  }

  React.useEffect(() => {
    if (!place) return;
    const close = () => setPlace(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [place]);

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        className="cursor-help whitespace-nowrap rounded-sm font-[inherit] underline decoration-dotted decoration-muted-foreground/70 underline-offset-[3px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-describedby={id}
        onPointerDown={(event) => {
          touch.current = event.pointerType === "touch";
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "touch") return;
          show();
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "touch") return;
          setPlace(null);
        }}
        onFocus={show}
        onBlur={() => setPlace(null)}
        onClick={() => {
          if (!touch.current) return;
          if (place) setPlace(null);
          else show();
        }}
      >
        {children}
      </button>
      <span id={id} className="sr-only">
        {lines.map((line) => line.text).join(". ")}
      </span>
      {place
        ? createPortal(
            <div
              role="presentation"
              className="pointer-events-none fixed z-50 w-max max-w-xs -translate-x-1/2 rounded-md border border-border bg-background px-2.5 py-1.5 text-left shadow-sm"
              style={{
                left: place.left,
                top: place.top,
                transform: place.above ? "translate(-50%, -100%)" : undefined,
              }}
            >
              <ul className="flex flex-col gap-0.5">
                {lines.map((line) => (
                  <li
                    key={line.key}
                    className={
                      line.best
                        ? "text-xs font-medium text-foreground"
                        : `text-xs text-muted-foreground ${line.wrap ? "" : "whitespace-nowrap"}`
                    }
                  >
                    {line.text}
                  </li>
                ))}
              </ul>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function BenchScoreReadout({ bench, entry }: { bench: Bench; entry: BenchScore }) {
  const { effort, lines, caveat } = scoreReadout(bench, entry);
  const figure = (
    <>
      <span className="font-mono text-sm tabular-nums text-foreground">{formatBench(bench, entry.value)}</span>
      {effort ? <span className="text-muted-foreground"> ({effort})</span> : null}
    </>
  );
  return (
    <>
      {lines.length ? <ScoreTip lines={lines}>{figure}</ScoreTip> : figure}
      {caveat ? (
        <span className="mt-0.5 block text-[11px] leading-4 whitespace-normal text-muted-foreground">{caveat}</span>
      ) : null}
    </>
  );
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

  return (
    <div className="mt-8">
      <BenchCharts rows={rows} benches={benches} />
      <h2 className="mt-14 text-lg font-semibold tracking-tight text-foreground">Scores</h2>
      <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
        Each row is one board, and the shaded cell is the highest score on that row. A cell shows the best score with its thinking level in brackets, and hovering it lists the other figures for that score.
      </p>
      <div className="mt-4 max-w-full overflow-hidden [contain:paint]">
        <div className="min-w-0 overflow-x-auto">
        <table className="w-max min-w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border border-border bg-background px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                Bench
              </th>
              {rows.map((row, index) => (
                <th
                  key={row.model.id}
                  id={rows[index - 1]?.provider.id === row.provider.id ? undefined : row.provider.id}
                  className="scroll-mt-[var(--pricing-sticky)] border border-border bg-background px-3 py-3 text-sm font-medium text-foreground"
                >
                  {row.model.name}
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    {row.provider.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {benches.map((bench) => {
              const cells = rows.map((row) => row.model.scores?.find((item) => item.bench === bench.id));
              const published = cells.flatMap((entry) => (entry ? [entry.value] : []));
              const best = published.length ? Math.max(...published) : undefined;
              return (
                <tr key={bench.id}>
                  <th
                    scope="row"
                    className="sticky left-0 z-10 border border-border bg-background px-3 py-3 text-left font-normal"
                  >
                    <div className="text-xs text-muted-foreground">{bench.task}</div>
                    <a
                      href={bench.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 block text-sm font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {bench.name}
                    </a>
                  </th>
                  {cells.map((entry, index) => {
                    const leads = entry !== undefined && entry.value === best;
                    return (
                      <td
                        key={rows[index].model.id}
                        className={
                          leads
                            ? "border border-border bg-foreground/[0.08] px-3 py-3"
                            : "border border-border px-3 py-3"
                        }
                      >
                        {entry ? (
                          <BenchScoreReadout bench={bench} entry={entry} />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
      <details className="group mt-10 max-w-3xl">
        <summary className="flex cursor-pointer list-none items-center gap-2 text-sm text-foreground [&::-webkit-details-marker]:hidden">
          <span aria-hidden className="inline-block text-muted-foreground transition-transform group-open:rotate-90">
            ›
          </span>
          References
        </summary>
        <dl className="mt-4">
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
      </details>
    </div>
  );
}

function hasListPrice(model: ModelQuote) {
  return [model.standard, model.batch, model.fast].some((tier) =>
    Boolean(tier && [tier.input, tier.cachedInput, tier.cacheWrite, tier.output].some((list) => list && list.length > 0)),
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
      {!hasListPrice(model) && model.note ? (
        <p className="mt-1 text-xs text-muted-foreground">{model.note}</p>
      ) : null}
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
        {!hasListPrice(model) && model.note ? (
          <div className="mt-1 text-xs text-muted-foreground">{model.note}</div>
        ) : null}
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
