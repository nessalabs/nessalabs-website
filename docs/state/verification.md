---
id: verification
title: Verification evidence
kind: guide
status: implemented
summary: "Compilation, pure vendored tests, browser observations and bounded models cover different scopes."
parent: website
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks: {}
sources:
  - package.json
  - scripts/extract-preview-source.mjs
  - nessa-ui/components/split-view/split-view-math.test.ts
---

# Read the evidence and its limits

The source checkpoint is `34c39ddd2b31050611e209296ea9b2db7cf91023`. This atlas maps the website’s routes and all 71 component catalogue entries, while retaining the upstream ownership of vendored behavior.

| Check                               | Actual result and scope                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Lockfile install / production build | Passed on this macOS checkout; prebuild produced no tracked generated-source drift                                              |
| Vendored pure helpers               | 272 tests, 51 suites passed, zero skipped; geometry/parsing/layout helpers, not browser interactions                            |
| Catalogue / docs browser            | 13 pages, six diagrams rendered without page or diagram errors in headless Chrome                                               |
| Bounded models                      | Three baselines, six distinct invariants, 27 aggregate states; all passed                                                       |
| Semantic negative controls          | Six expected invariant violations; independently rerun with matching mutant digests                                             |
| Product/API browser smoke           | Six routes plus pricing filters/view URL behavior, blocked-storage theme toggle, API 200/404/400/204 and wildcard CORS observed |
| Local install registry route        | `/r/button.json` returned 404; no assertion about the live external deployment                                                  |
| Existing lint command               | Failed: Next interpreted `lint` as a project directory; this checkpoint's `next lint` command is not a working lint gate        |

Reproduce the helper check with `npm exec --yes --package=tsx -- tsx --test 'nessa-ui/**/*.test.ts'`. Build with `npm ci && npm run build`. Documentation commands are in [scripts/state-docs](../../scripts/state-docs/README.md). The helper loader was supplied by npm exec; it is not a new product dependency.

[Build](../../verification/state-models/website-build.txt), [helper tests](../../verification/state-models/website-vendored-tests.txt), [lint failure](../../verification/state-models/website-lint.txt), [baselines](../../verification/state-models/baselines.json), [controls](../../verification/state-models/negative-controls.json), [independent control rerun](../../verification/state-models/independent-controls.json), [docs browser](../../verification/state-models/browser.json), [product smoke](../../verification/state-models/product/results.json) and [pricing interactions](../../verification/state-models/product/pricing-interactions.json) retain actual receipts. npm ci's dependency audit output is retained in [install evidence](../../verification/state-models/website-npm-ci.txt); no dependency upgrade was performed in this docs change.

[Docs-only reader review](../../verification/state-models/reader-review.md) answered seven tasks before source inspection. [Independent source/model review](../../verification/state-models/source-model-review.md) corrected the sync/snippet regeneration claim and verified the distinct preview-selection rule and all six control traces. The model assumptions remain explicit on their owner pages; these results do not qualify source-only guides, arbitrary React scheduling, cryptography, production hosting or every upstream component interaction.

No deployment, live vendor-price verification, live external registry request, mobile-device run or complete upstream Storybook suite was performed. Historical CodeBlock/FileDiffList reports are not closed by these checks. The site remains a local demo and static pricing consumer at this checkpoint.
