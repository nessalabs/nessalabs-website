---
id: components
title: Find a component
kind: guide
status: implemented
summary: "Registry entries drive the sidebar, generated routes, examples and previous/next navigation."
parent: website
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks: {}
sources:
  - registry/index.ts
  - registry/index.generated.ts
  - app/ui/components/page.tsx
  - app/ui/components/[slug]/page.tsx
  - components/site/docs-nav.tsx
---

# Find a component and its examples

Choose a component from the sidebar. The page shows its description, main preview, installation command, optional examples, authored Storybook behavior names and previous/next links. Layout, Data, Charts, Git and workflow-canvas use wider pages; that is presentation rather than a different component contract.

The authored `documented` list chooses the site’s entries and descriptions. The generated catalogue supplies export names and story metadata. Module construction throws when a documented slug has no generated entry. `generateStaticParams` builds routes from this same registry; `getComponent` resolves exact slugs. A story name on the page means the source lists that behavior, not that this website build executed Storybook tests.

The installation snippet names `https://nessalabs.ai/r/<slug>.json`. This checkout has no app route or checked-in public files serving `/r`, and build-registry writes TypeScript catalogue data rather than installable registry JSON. Treat that install endpoint as a separate deployment dependency; the local verification record states what was actually observed. Do not infer a published package or working external registry from a rendered command.

[The complete inventory](inventory.md) lists all 71 component routes and examples. [Preview behavior](previews.md) explains why switching to Code can reset local demo state.
