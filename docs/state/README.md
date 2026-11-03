---
id: website
title: Website features
kind: system
status: implemented
summary: "Find the website\u2019s real routes, local examples and checked-in data before treating them as live services."
parent: null
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks:
  Docs: components
  Harness: harness
  Prices: pricing
  Browser: pricing
  API: pricing-api
  Vendor: library
  Examples: previews
sources:
  - app/layout.tsx
  - app/page.tsx
  - registry/index.ts
  - lib/model-pricing/catalog.ts
---

# Explore the website and its examples

Start with a component example or the model-price table. The site renders a vendored React library and authored examples; its harness is a local demonstration, and its pricing data is a source snapshot. It does not connect your chat to a model provider or make the listed prices current automatically.

| Task                                           | Read next                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| Find a page or use the mobile menu             | [Navigation](navigation.md)                                        |
| Find a component, preview it and copy its code | [Component browser](components.md), [preview/source](previews.md)  |
| Identify every published component family      | [Registry inventory](inventory.md), [vendored library](library.md) |
| Try the full agent interface                   | [Harness](harness.md)                                              |
| Filter prices or benchmark boards              | [Price browser](pricing.md), [JSON API](pricing-api.md)            |
| Keep a light/dark preference                   | [Theme](theme.md)                                                  |
| Change the library or its examples             | [Source generation](authoring.md)                                  |
| Build and understand deployment boundaries     | [Build](build.md), [verification](verification.md)                 |

```mermaid
flowchart TD
    Site[Website routes] --> Docs[Component catalogue]
    Site --> Harness[Local harness demo]
    Site --> Prices[Checked-in pricing catalogue]
    Docs --> Vendor[Vendored UI and stream library]
    Docs --> Examples[Authored examples and extracted source]
    Prices --> Browser[Browser filters and charts]
    Prices --> API[Read-only JSON API]
```

Courses, Research and Agents are visible coming-soon pages. They are not working course enrollment, research hosting or agent execution services. The atlas distinguishes source mapping, actual checks and bounded model results; no single passing model qualifies the entire website or upstream library.
