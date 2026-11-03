---
id: pricing-api
title: "Read the pricing JSON API"
kind: guide
status: implemented
summary: "GET validates filters against the local snapshot and OPTIONS declares the read-only CORS contract."
parent: website
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks: {}
sources:
  - app/api/model-pricing/route.ts
  - lib/model-pricing/query.ts
  - lib/model-pricing/types.ts
---

# Read the pricing JSON API

GET `/api/model-pricing` returns updated date, USD currency, normalized query, matching providers/models, gateways, benchmark definitions, modelCount and the docs path. It reads the imported catalogue. No vendor credentials, purchases or provider requests are involved.

| Input                                           | Result                                                          |
| ----------------------------------------------- | --------------------------------------------------------------- |
| provider/category with whitespace or upper case | Trim and lowercase before validation                            |
| Unknown provider                                | 404 JSON error plus known providers/categories                  |
| Unknown category, including `all`               | 400 JSON error; omit category for all                           |
| Empty query fields                              | Treated as absent                                               |
| q                                               | Trimmed, case-insensitive/fuzzy matching in shared query helper |
| tier or another unhandled parameter             | Not a filter; standard/batch/fast data remain where present     |
| OPTIONS                                         | 204 with CORS headers                                           |

The route declares wildcard origin, GET/OPTIONS methods and Content-Type allowed header, with public max-age=3600 caching on its responses. A successful response still carries the catalogue’s source date; HTTP freshness is not price freshness. Model rows and gateway fees have different units/meaning.

The browser’s permissive fallback for unknown provider/category differs from this strict parser. Do not assume a UI URL that displays all rows will produce a successful equivalent API request. There is no pagination or maximum query-length check in this handler; no request-cost or denial-of-service guarantee is claimed.
