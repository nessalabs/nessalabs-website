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
  benches: ModelPricingCatalog["benches"];
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

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9.]+/g, " ").replace(/\s+/g, " ").trim();
}

function compact(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/** Adjacent transpositions count as one change, which covers a swapped pair of letters. */
function editDistance(a: string, b: string) {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        dp[i][j] = Math.min(dp[i][j], dp[i - 2][j - 2] + 1);
      }
    }
  }
  return dp[a.length][b.length];
}

function editLimit(length: number) {
  if (length <= 3) return 0;
  if (length <= 5) return 1;
  return 2;
}

/** One swapped pair, so "gtp" still meets "gpt" when a longer edit is not allowed. */
function adjacentSwap(query: string, candidate: string) {
  if (query.length !== candidate.length) return false;
  for (let i = 0; i < query.length - 1; i++) {
    if (query[i] === candidate[i]) continue;
    return (
      query[i] === candidate[i + 1] &&
      query[i + 1] === candidate[i] &&
      query.slice(i + 2) === candidate.slice(i + 2)
    );
  }
  return false;
}

function tokenClose(query: string, candidate: string) {
  if (query === candidate) return true;
  const limit = editLimit(query.length);
  const gap = Math.abs(query.length - candidate.length);
  // A contained word only counts when the two lengths are already within the edit limit.
  // Otherwise "minimax" matches every "mini", and "opus4.7" matches every "opus".
  if (gap <= limit && candidate.includes(query)) return true;
  if (gap <= limit && query.length >= 4 && candidate.length >= 4 && query.includes(candidate)) return true;
  if (query.length === 3 && candidate.length === 3) return adjacentSwap(query, candidate);
  if (gap > limit) return false;
  return editDistance(query, candidate) <= limit;
}

/** Model names, ids and provider names. A misspelt word still matches when it is one or two edits away. */
function lexicalMatch(haystack: string, query: string) {
  const q = normalize(query);
  const h = normalize(haystack);
  if (!q) return true;
  if (h.includes(q) || compact(h).includes(compact(q))) return true;
  const qTokens = q.split(" ").filter(Boolean);
  const hTokens = h.split(" ").filter((token) => token.length > 1);
  return qTokens.every((token) => {
    // A version such as "5" or "4.6" is not a spelling. It has to occur in the name.
    if (/^\d+(\.\d+)?$/.test(token)) return h.includes(token);
    return hTokens.some((candidate) => tokenClose(token, candidate));
  });
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
    model.retiring,
    ...(model.scores ?? []).flatMap((entry) => {
      const bench = modelPricing.benches.find((item) => item.id === entry.bench);
      return [
        entry.bench,
        entry.note,
        entry.reportedBy,
        ...(entry.levels ?? []).map((level) => level.effort),
        bench?.name,
        bench?.task,
      ];
    }),
  ]
    .filter(Boolean)
    .join(" ");
  const identity = [provider.name, provider.id, model.name, model.id].join(" ");
  if (lexicalMatch(identity, query.q)) return true;
  // A one or two character query is a name fragment. Notes and scores contain too many digits to search.
  if (query.q.trim().length <= 2) return false;
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
    const identity = [gateway.name, gateway.id].join(" ");
    return lexicalMatch(identity, query.q) || matchesText(blob, query.q);
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
    benches: catalog.benches,
    modelCount: providers.reduce((sum, provider) => sum + provider.models.length, 0),
  };
}

export function providerIds(): string[] {
  return [
    ...modelPricing.providers.map((provider) => provider.id),
    ...modelPricing.gateways.map((gateway) => gateway.id),
  ];
}
