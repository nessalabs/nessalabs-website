import type { ModelQuote, Price, PriceTier, PriceUnit } from "./types";

const TOKENS: PriceUnit = "per_million_tokens";

export function roundUsd(usd: number): number {
  return Math.round(usd * 1_000_000) / 1_000_000;
}

export function price(usd: number, unit: PriceUnit = TOKENS, when?: string): Price {
  return when ? { usd, unit, when } : { usd, unit };
}

export function scaleTier(source: PriceTier, factor: number): PriceTier {
  const scale = (prices?: Price[]) =>
    prices?.map((entry) => ({ ...entry, usd: roundUsd(entry.usd * factor) }));
  const tier: PriceTier = {};
  if (source.input) tier.input = scale(source.input);
  if (source.cachedInput) tier.cachedInput = scale(source.cachedInput);
  if (source.cacheWrite) tier.cacheWrite = scale(source.cacheWrite);
  if (source.output) tier.output = scale(source.output);
  return tier;
}

/** One input rate, one output rate, optional cache read. All per million tokens. */
export function tokens(
  input: number,
  output: number,
  cached?: number,
  when?: string,
): PriceTier {
  return {
    input: [price(input, TOKENS, when)],
    output: [price(output, TOKENS, when)],
    ...(cached === undefined ? {} : { cachedInput: [price(cached, TOKENS, when)] }),
  };
}

export function joinTiers(parts: PriceTier[]): PriceTier {
  const tier: PriceTier = {};
  const input = parts.flatMap((part) => part.input ?? []);
  const cachedInput = parts.flatMap((part) => part.cachedInput ?? []);
  const cacheWrite = parts.flatMap((part) => part.cacheWrite ?? []);
  const output = parts.flatMap((part) => part.output ?? []);
  if (input.length) tier.input = input;
  if (cachedInput.length) tier.cachedInput = cachedInput;
  if (cacheWrite.length) tier.cacheWrite = cacheWrite;
  if (output.length) tier.output = output;
  return tier;
}

/**
 * Short-context and long-context token rates. `batch` and `fast` are exact
 * multipliers the provider publishes for those tiers (0.5 and 2 are typical).
 */
export function contextBands(args: {
  id: string;
  name: string;
  context?: string;
  category?: ModelQuote["category"];
  short: { input: number; cached?: number; output: number; write?: number };
  long?: { input: number; cached?: number; output: number; write?: number };
  shortWhen?: string;
  longWhen?: string;
  batch?: number;
  fast?: number;
  note?: string;
  retiring?: string;
}): ModelQuote {
  const shortWhen = args.shortWhen ?? (args.long ? "≤272k" : undefined);
  const longWhen = args.longWhen ?? ">272k";
  const band = (
    rates: { input: number; cached?: number; output: number; write?: number },
    when?: string,
  ): PriceTier => ({
    input: [price(rates.input, TOKENS, when)],
    output: [price(rates.output, TOKENS, when)],
    ...(rates.cached === undefined
      ? {}
      : { cachedInput: [price(rates.cached, TOKENS, when)] }),
    ...(rates.write === undefined
      ? {}
      : { cacheWrite: [price(rates.write, TOKENS, when)] }),
  });
  const standard = joinTiers([
    band(args.short, shortWhen),
    ...(args.long ? [band(args.long, longWhen)] : []),
  ]);
  return {
    id: args.id,
    name: args.name,
    category: args.category ?? "language",
    context: args.context,
    standard,
    ...(args.batch === undefined ? {} : { batch: scaleTier(standard, args.batch) }),
    ...(args.fast === undefined ? {} : { fast: scaleTier(standard, args.fast) }),
    note: args.note,
    retiring: args.retiring,
  };
}

/**
 * Anthropic token rates. Cache reads are `read` times input. Writes are 1.25×
 * for five minutes and 2× for one hour. Batch is half. Those multipliers are
 * the ones on the Claude pricing page.
 */
export function claude(args: {
  id: string;
  name: string;
  context: string;
  input: number;
  output: number;
  /** Cache-read multiplier. 0.1 on most models, 0.025 on Fable 5.1. */
  read?: number;
  fast?: boolean;
  note?: string;
}): ModelQuote {
  const read = args.read ?? 0.1;
  const standard: PriceTier = {
    input: [price(args.input)],
    cachedInput: [price(roundUsd(args.input * read))],
    cacheWrite: [
      price(roundUsd(args.input * 1.25), TOKENS, "5 min"),
      price(roundUsd(args.input * 2), TOKENS, "1 hour"),
    ],
    output: [price(args.output)],
  };
  return {
    id: args.id,
    name: args.name,
    category: "language",
    context: args.context,
    standard,
    batch: scaleTier(standard, 0.5),
    ...(args.fast ? { fast: scaleTier(standard, 2) } : {}),
    note: args.note,
  };
}
