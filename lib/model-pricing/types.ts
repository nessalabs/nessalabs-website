/**
 * Published list prices for model APIs. Amounts are USD. A token rate is per
 * 1,000,000 tokens unless `unit` says otherwise.
 */

export type Category = "language" | "voice" | "image" | "embedding" | "tool";

export type PriceUnit =
  | "per_million_tokens"
  | "per_minute"
  | "per_hour"
  | "per_million_characters"
  | "per_thousand_characters"
  | "per_image"
  | "per_second"
  | "per_thousand_calls"
  | "per_message"
  | "per_gib_day";

export interface Price {
  usd: number;
  unit: PriceUnit;
  /** Condition the rate applies under, such as "≤272k" or "audio". */
  when?: string;
}

export interface PriceTier {
  input?: Price[];
  cachedInput?: Price[];
  cacheWrite?: Price[];
  output?: Price[];
}

export interface ModelQuote {
  id: string;
  name: string;
  category: Category;
  /** Context window as published, such as "1M" or "262k". */
  context?: string;
  standard: PriceTier;
  batch?: PriceTier;
  /** OpenAI Fast mode, Anthropic fast mode, Google priority, xAI priority. */
  fast?: PriceTier;
  note?: string;
  /** Set when the provider has announced an API shutdown date. */
  retiring?: string;
}

export interface Provider {
  id: string;
  name: string;
  docsUrl: string;
  /** How this provider bills, in a sentence or two. Shown in the JSON. */
  billing: string;
  /** One sentence on the page, when the table headings do not carry it. */
  line?: string;
  models: ModelQuote[];
}

export interface GatewayFee {
  name: string;
  detail: string;
}

export interface Gateway {
  id: string;
  name: string;
  docsUrl: string;
  summary: string;
  fees: GatewayFee[];
}

export interface ModelPricingCatalog {
  /** ISO date the figures were checked against provider docs. */
  updated: string;
  currency: "USD";
  providers: Provider[];
  gateways: Gateway[];
}

export type TierName = "standard" | "batch" | "fast";

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "language", label: "Language" },
  { id: "voice", label: "Voice" },
  { id: "image", label: "Image" },
  { id: "embedding", label: "Embeddings" },
  { id: "tool", label: "Tools" },
];

export const TIERS: { id: TierName; label: string }[] = [
  { id: "standard", label: "Standard" },
  { id: "batch", label: "Batch" },
  { id: "fast", label: "Fast" },
];
