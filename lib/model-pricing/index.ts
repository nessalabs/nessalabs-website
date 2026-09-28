import { benchScores } from "./benches";
import { modelPricing } from "./catalog";

const seen = new Set<string>();
for (const provider of modelPricing.providers) {
  for (const model of provider.models) {
    const key = `${provider.id}/${model.id}`;
    if (seen.has(key)) {
      throw new Error(`Duplicate model id ${key}`);
    }
    seen.add(key);
    const scores = benchScores[model.id];
    if (scores) model.scores = scores;
    const tiers = [model.standard, model.batch, model.fast];
    for (const tier of tiers) {
      if (!tier) continue;
      for (const list of [tier.input, tier.cachedInput, tier.cacheWrite, tier.output]) {
        for (const entry of list ?? []) {
          if (!Number.isFinite(entry.usd) || entry.usd < 0) {
            throw new Error(`Invalid price on ${key}`);
          }
        }
      }
    }
    for (const entry of model.scores ?? []) {
      const bench = modelPricing.benches.find((item) => item.id === entry.bench);
      if (!bench) throw new Error(`Unknown bench ${entry.bench} on ${key}`);
      if (!Number.isFinite(entry.value)) throw new Error(`Invalid score on ${key}`);
      if (bench.unit === "percent" && (entry.value < 0 || entry.value > 100)) {
        throw new Error(`Percent score out of range on ${key}`);
      }
      for (const level of entry.levels ?? []) {
        if (!level.effort || !Number.isFinite(level.value)) throw new Error(`Invalid level on ${key}`);
        if (bench.unit === "percent" && (level.value < 0 || level.value > 100)) {
          throw new Error(`Percent level out of range on ${key}`);
        }
        if (level.usd !== undefined && (!Number.isFinite(level.usd) || level.usd < 0)) {
          throw new Error(`Invalid level cost on ${key}`);
        }
      }
      if (entry.usd !== undefined && (!Number.isFinite(entry.usd) || entry.usd < 0)) {
        throw new Error(`Invalid score cost on ${key}`);
      }
      if (entry.runUsd !== undefined && (!Number.isFinite(entry.runUsd) || entry.runUsd < 0)) {
        throw new Error(`Invalid run cost on ${key}`);
      }
    }
  }
}

const modelIds = new Set(
  modelPricing.providers.flatMap((provider) => provider.models.map((model) => model.id)),
);
for (const id of Object.keys(benchScores)) {
  if (!modelIds.has(id)) throw new Error(`Bench score for unknown model ${id}`);
}

export { modelPricing } from "./catalog";
export { formatPrice, formatUsd, unitLabel } from "./format";
export { parsePricingQuery, providerIds, queryCatalog } from "./query";
export type { PricingQuery, PricingQueryResult } from "./query";
export { CATEGORIES, TIERS } from "./types";
export type {
  Bench,
  BenchLevel,
  BenchScore,
  Category,
  Gateway,
  ModelPricingCatalog,
  ModelQuote,
  Price,
  PriceTier,
  PriceUnit,
  Provider,
  TierName,
} from "./types";
