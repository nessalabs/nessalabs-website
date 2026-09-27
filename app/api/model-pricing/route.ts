import { NextRequest, NextResponse } from "next/server";
import {
  CATEGORIES,
  modelPricing,
  parsePricingQuery,
  providerIds,
  queryCatalog,
} from "@/lib/model-pricing";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=3600",
};

/**
 * JSON for the model price table.
 *
 *   GET /api/model-pricing
 *   GET /api/model-pricing?provider=anthropic
 *   GET /api/model-pricing?category=voice
 *   GET /api/model-pricing?q=kimi
 *
 * Every model includes standard, batch and fast tiers when the provider
 * publishes them. `tier` is not a filter.
 */
export function GET(request: NextRequest) {
  const parsed = parsePricingQuery(request.nextUrl.searchParams);
  if (!parsed.ok) {
    return NextResponse.json(
      {
        error: parsed.error,
        providers: providerIds(),
        categories: CATEGORIES.filter((category) => category.id !== "all").map(
          (category) => category.id,
        ),
      },
      { status: parsed.status, headers },
    );
  }

  const result = queryCatalog(modelPricing, parsed.query);
  return NextResponse.json(
    {
      ...result,
      docs: "/tools/model-pricing",
    },
    { headers },
  );
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers });
}
