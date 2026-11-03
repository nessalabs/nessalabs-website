---
id: build
title: Build the site
kind: guide
status: implemented
summary: "The production build regenerates preview snippets and statically renders the component registry."
parent: website
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks: {}
sources:
  - package.json
  - next.config.ts
  - tsconfig.json
  - scripts/extract-preview-source.mjs
  - app/layout.tsx
---

# Build the site and inspect deployment inputs

Install the lockfile with `npm ci`, then `npm run build`. Prebuild regenerates preview source before Next compiles, typechecks and renders routes. `npm start` serves the resulting local production build. Dev also runs the extractor first. The current Next configuration only enables React strict mode.

A build proves this checkpoint can compile in the recorded environment; it does not prove every example interaction, a functioning external `/r` registry, provider price freshness or production hosting configuration. The README describes deployment on a main-branch push, but this docs task neither deploys nor changes hosting.

Pure vendored math/helper tests use node:test and can run through a TypeScript loader; the verification page records the exact command used. There is no dedicated website product-test script in package.json. The `lint` command is inherited as `next lint`; its compatibility must be checked separately instead of treating build success as a lint pass.

Keep generated changes reviewable. At the audited checkpoint, a successful prebuild did not change tracked generated files. Model checks and semantic negative controls are separate docs commands and do not run or deploy Next.
