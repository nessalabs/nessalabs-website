"use client";

import * as React from "react";
import {
  FlowChart,
  PieChart,
  PriceChart,
  RadarChart,
  StockQuote,
  type FlowChartLink,
  type FlowChartNode,
  type PieChartSlice,
  type RadarChartAxis,
  type RadarChartSeries,
} from "@nessa-ui/react";
import {
  SESSION_START,
  candleSeries,
  priceSeries,
} from "../story-support/market-demo-data";

/** A box with a fixed height: every chart fills the box its host gives it. */
function ChartFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? "h-80 w-full min-w-0"}>{children}</div>
  );
}

const ticketMix: PieChartSlice[] = [
  { id: "bugs", label: "Bugs", value: 128 },
  { id: "features", label: "Features", value: 94 },
  { id: "questions", label: "Questions", value: 61 },
  { id: "billing", label: "Billing", value: 37 },
  { id: "other", label: "Other", value: 18 },
];

export function PieChartDemo() {
  return (
    <ChartFrame>
      <PieChart
        slices={ticketMix}
        aria-label="Support tickets by kind"
        formatValue={(value) => `${value} tickets`}
      />
    </ChartFrame>
  );
}

export function PieChartDonutDemo() {
  return (
    <ChartFrame>
      <PieChart
        slices={ticketMix}
        innerRadius={0.62}
        padAngle={1.5}
        aria-label="Support tickets by kind"
        formatValue={(value) => `${value} tickets`}
      />
    </ChartFrame>
  );
}

export function PieChartGaugeDemo() {
  return (
    <ChartFrame className="h-64 w-full min-w-0">
      <PieChart
        slices={[
          { id: "used", label: "Used", value: 68 },
          { id: "free", label: "Free", value: 32 },
        ]}
        innerRadius={0.7}
        startAngle={-90}
        endAngle={90}
        labels="none"
        aria-label="Storage used"
        formatValue={(value) => `${value}%`}
      />
    </ChartFrame>
  );
}

const scorecardAxes: RadarChartAxis[] = [
  { id: "latency", label: "Latency" },
  { id: "accuracy", label: "Accuracy" },
  { id: "cost", label: "Cost" },
  { id: "coverage", label: "Coverage" },
  { id: "recovery", label: "Recovery" },
];

const scorecardSeries: RadarChartSeries[] = [
  {
    id: "current",
    label: "Current",
    values: { latency: 62, accuracy: 88, cost: 54, coverage: 71, recovery: 66 },
  },
  {
    id: "candidate",
    label: "Candidate",
    values: { latency: 84, accuracy: 79, cost: 38, coverage: 86, recovery: 82 },
  },
];

export function RadarChartDemo() {
  return (
    <ChartFrame>
      <RadarChart
        axes={scorecardAxes}
        series={scorecardSeries}
        aria-label="Model scorecard"
      />
    </ChartFrame>
  );
}

export function RadarChartPerAxisDemo() {
  return (
    <ChartFrame>
      <RadarChart
        axes={scorecardAxes}
        series={scorecardSeries}
        scale="axis"
        curve={0}
        dots="always"
        aria-label="Model scorecard, normalised per axis"
      />
    </ChartFrame>
  );
}

const budgetNodes: FlowChartNode[] = [
  { id: "revenue", label: "Revenue" },
  { id: "product", label: "Product" },
  { id: "platform", label: "Platform" },
  { id: "salaries", label: "Salaries" },
  { id: "compute", label: "Compute" },
  { id: "tooling", label: "Tooling" },
];

const budgetLinks: FlowChartLink[] = [
  { source: "revenue", target: "product", value: 420 },
  { source: "revenue", target: "platform", value: 260 },
  { source: "product", target: "salaries", value: 300 },
  { source: "product", target: "tooling", value: 120 },
  { source: "platform", target: "salaries", value: 140 },
  { source: "platform", target: "compute", value: 120 },
];

export function FlowChartDemo() {
  return (
    <ChartFrame>
      <FlowChart
        nodes={budgetNodes}
        links={budgetLinks}
        aria-label="Where the budget goes"
        formatValue={(value) => `$${value}k`}
      />
    </ChartFrame>
  );
}

export function FlowChartVerticalDemo() {
  return (
    <ChartFrame className="h-96 w-full min-w-0">
      <FlowChart
        nodes={budgetNodes}
        links={budgetLinks}
        orientation="vertical"
        linkColor="gradient"
        aria-label="Where the budget goes"
        formatValue={(value) => `$${value}k`}
      />
    </ChartFrame>
  );
}

const session = priceSeries({
  seed: 7,
  count: 78,
  start: 214.6,
  startTime: SESSION_START,
  stepMs: 5 * 60_000,
  drift: 0.0006,
});

const sessionCandles = candleSeries({
  seed: 11,
  count: 48,
  start: 214.6,
  startTime: SESSION_START,
  stepMs: 8 * 60_000,
  drift: 0.0007,
});

const month = priceSeries({
  seed: 3,
  count: 120,
  start: 198.2,
  startTime: SESSION_START - 120 * 86_400_000,
  stepMs: 86_400_000,
  drift: 0.0012,
});

/** Fixed to UTC so the server and the client print the same labels. */
const sessionTime = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

export function PriceChartDemo() {
  return (
    <ChartFrame className="h-72 w-full min-w-0">
      <PriceChart
        series={session}
        baseline={session[0]?.value}
        tone="gain"
        fill
        selectable
        formatTime={(time) => sessionTime.format(new Date(time))}
      />
    </ChartFrame>
  );
}

export function PriceChartCandlesDemo() {
  return (
    <ChartFrame className="h-72 w-full min-w-0">
      <PriceChart
        series={sessionCandles}
        view="candle"
        selectable
        formatTime={(time) => sessionTime.format(new Date(time))}
      />
    </ChartFrame>
  );
}

export function PriceChartSparklineDemo() {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {[
        { symbol: "NSSA", tone: "gain" as const, series: session },
        { symbol: "ACME", tone: "loss" as const, series: month },
        { symbol: "ORBT", tone: "neutral" as const, series: sessionCandles },
      ].map((row) => (
        <div
          key={row.symbol}
          className="rounded-xl border border-border bg-card p-3"
        >
          <div className="text-sm font-medium">{row.symbol}</div>
          <div className="mt-2 h-16">
            <PriceChart
              series={row.series}
              tone={row.tone}
              axes={false}
              scrubbable={false}
              labels={{ chart: `${row.symbol} price` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StockQuoteDemo() {
  return (
    <StockQuote
      className="h-[30rem] w-full"
      symbol="NSSA"
      name="Nessa Labs Inc."
      price={session[session.length - 1]?.value ?? 0}
      previousClose={session[0]?.value}
      series={{ "1D": session, "1M": month }}
      status="live"
      selectable
      extendedHours={{ price: 219.4, label: "After-hours" }}
      stats={[
        { label: "Open", value: "214.60" },
        { label: "Day range", value: "212.10 – 220.85" },
        { label: "Volume", value: "18.4M" },
        { label: "Market cap", value: "42.7B" },
      ]}
    />
  );
}
