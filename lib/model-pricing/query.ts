import { modelPricing } from "./catalog";
import type {
  Category,
  Gateway,
  ModelPricingCatalog,
  ModelQuote,
  Provider,
} from "./types";
import { CATEGORIES } from "./types";

export interface PricingQuery {
  provider?: string;
  category?: Category;
  q?: string;
}

export interface PricingQueryResult {
  updated: string;
  currency: "USD";
  query: PricingQuery;
  providers: Provider[];
  gateways: Gateway[];
  modelCount: number;
}

const CATEGORY_IDS = new Set(
  CATEGORIES.map((category) => category.id).filter((id) => id !== "all"),
);

export function parsePricingQuery(
  params: URLSearchParams,
): { ok: true; query: PricingQuery } | { ok: false; error: string; status: number } {
  const provider = params.get("provider")?.trim().toLowerCase() || undefined;
  const categoryParam = params.get("category")?.trim().toLowerCase() || undefined;
  const q = params.get("q")?.trim() || undefined;

  if (provider && !knownProvider(provider)) {
    return {
      ok: false,
      status: 404,
      error: `Unknown provider "${provider}".`,
    };
  }

  if (categoryParam && !CATEGORY_IDS.has(categoryParam as Category)) {
    return {
      ok: false,
      status: 400,
      error: `Unknown category "${categoryParam}".`,
    };
  }

  return {
    ok: true,
    query: {
      provider,
      category: categoryParam as Category | undefined,
      q,
    },
  };
}

function knownProvider(id: string): boolean {
  return (
    modelPricing.providers.some((provider) => provider.id === id) ||
    modelPricing.gateways.some((gateway) => gateway.id === id)
  );
}

function matchesText(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function modelMatches(provider: Provider, model: ModelQuote, query: PricingQuery): boolean {
  if (query.category && model.category !== query.category) return false;
  if (!query.q) return true;
  const blob = [
    provider.name,
    provider.id,
    model.name,
    model.id,
    model.category,
    model.note,
    model.retiring,
  ]
    .filter(Boolean)
    .join(" ");
  return matchesText(blob, query.q);
}

export function queryCatalog(
  catalog: ModelPricingCatalog,
  query: PricingQuery,
): PricingQueryResult {
  const providers = catalog.providers
    .filter((provider) => !query.provider || provider.id === query.provider)
    .map((provider) => ({
      ...provider,
      models: provider.models.filter((model) => modelMatches(provider, model, query)),
    }))
    .filter((provider) => provider.models.length > 0);

  const gateways = catalog.gateways.filter((gateway) => {
    if (query.category && query.category !== "tool") return false;
    if (query.provider && gateway.id !== query.provider) return false;
    if (!query.q) return !query.provider || gateway.id === query.provider;
    const blob = [
      gateway.name,
      gateway.id,
      gateway.summary,
      ...gateway.fees.flatMap((fee) => [fee.name, fee.detail]),
    ].join(" ");
    return matchesText(blob, query.q);
  });

  // A category or text filter with no provider should still be able to hide
  // gateways. An explicit provider=openrouter keeps the gateway even when the
  // text does not match a fee, which the filter above already handles.
  return {
    updated: catalog.updated,
    currency: catalog.currency,
    query,
    providers,
    gateways,
    modelCount: providers.reduce((sum, provider) => sum + provider.models.length, 0),
  };
}

export function providerIds(): string[] {
  return [
    ...modelPricing.providers.map((provider) => provider.id),
    ...modelPricing.gateways.map((gateway) => gateway.id),
  ];
}
