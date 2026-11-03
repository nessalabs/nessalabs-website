---
id: authoring
title: Update source and examples
kind: guide
status: implemented
summary: "Source sync replaces vendored trees and regenerates story/catalogue data; snippet generation is separate."
parent: website
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks: {}
sources:
  - scripts/sync-nessa-ui.mjs
  - scripts/build-registry.mjs
  - scripts/extract-story-docs.mjs
  - scripts/extract-preview-source.mjs
  - registry/index.ts
---

# Update the upstream library and examples

For a component implementation change, edit the upstream nessa-ui repository first. From a clean website checkout run `npm run sync:ui -- /absolute/path/to/nessa-ui`. The argument must name a checkout with packages/react/src and packages/agent-stream/src. The script’s default path is a developer-specific directory, so do not rely on it.

The script checks both source directories exist, then deletes/replaces this checkout’s nessa-ui and agent-stream directories. It rewrites package-local imports, writes vendoring markers and regenerates story and catalogue outputs through child scripts. Snippets are a separate step: run `npm run preview-source` or `npm run build` after sync. A later failure can leave partial changes; source validation is not an atomic multi-output publication. Inspect git diff and rerun from a known upstream checkout before committing. The React source copy currently includes pure test files; agent-stream excludes test files.

For a website example, change registry/demos and its preview entry. The authored registry list controls which generated components get pages and which example IDs appear. Run preview-source/build and verify the route and snippets. Missing generated catalogue entries fail module construction; missing previews/source have explicit runtime fallbacks. A generated snippet is not automatically standalone compilable code.

The website’s marketing/navigation/pricing code belongs in components/site, app and lib. Do not add components to the old nonexistent components/nessa-ui path. The upstream owns library behavior; this site owns how it is demonstrated and documented.
