import { modelPricing } from "./catalog";

const seen = new Set<string>();
for (const provider of modelPricing.providers) {
  for (const model of provider.models) {
    const key = `${provider.id}/${model.id}`;
    if (seen.has(key)) {
      throw new Error(`Duplicate model id ${key}`);
    }
    seen.add(key);
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
  }
}

export { modelPricing } from "./catalog";
export { formatPrice, formatUsd, unitLabel } from "./format";
export { parsePricingQuery, providerIds, queryCatalog } from "./query";
export type { PricingQuery, PricingQueryResult } from "./query";
export { CATEGORIES, TIERS } from "./types";
export type {
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
