import type { Price, PriceUnit } from "./types";

const UNIT_LABEL: Record<PriceUnit, string> = {
  per_million_tokens: "/ MTok",
  per_minute: "/ min",
  per_hour: "/ hr",
  per_million_characters: "/ M chars",
  per_thousand_characters: "/ 1k chars",
  per_image: "/ image",
  per_second: "/ sec",
  per_thousand_calls: "/ 1k calls",
  per_message: "/ message",
  per_gib_day: "/ GiB-day",
};

export function unitLabel(unit: PriceUnit): string {
  return UNIT_LABEL[unit];
}

/** `$10.00`, `$0.125`, `$0.003`. At least two decimal places. */
export function formatUsd(usd: number): string {
  const negative = usd < 0;
  const abs = Math.abs(usd);
  const text = abs.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
  const [whole, frac = ""] = text.split(".");
  const padded = frac.length < 2 ? frac.padEnd(2, "0") : frac;
  return `${negative ? "-" : ""}$${whole}.${padded}`;
}

export function formatPrice(price: Price): string {
  return formatUsd(price.usd);
}
