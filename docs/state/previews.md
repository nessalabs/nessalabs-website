---
id: previews
title: Preview and source
kind: statechart
status: implemented
summary: "Code is offered only when generated source exists; replacing a preview
  with code can discard its local state."
parent: website
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks: {}
diagramDetails:
  - diagram: 0
    node: Preview
    section: Switching can discard demo state
  - diagram: 0
    node: Code
    section: Switching can discard demo state
  - diagram: 0
    node: Missing
    section: Switching can discard demo state
sources:
  - components/site/component-preview.tsx
  - components/site/source-block.tsx
  - components/site/code-surface.tsx
  - registry/previews.tsx
  - scripts/extract-preview-source.mjs
model:
  { spec: "tla/PreviewAvailability.tla", config: "tla/PreviewAvailability.cfg" }
modelCheck:
  sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
  checker: tlc-1.7.4
  date: 2026-11-03T09:47:06.967Z
  config: tla/PreviewAvailability.cfg
  modelDigest: 4202cffe4dc5d137be5c5bb79f282ee4f275b02e1ea4066b4c4fb0705fe33a2d
  states: 11
  held:
    - CodeNeedsSource
    - PreviewSelection
  broke: []
  unchecked: []
---

# Switch between a live preview and source

Open a component’s Preview and interact with it, then select Code. The tab displays source generated from the preview map and demo modules. When source is missing, Code is not offered and the renderer falls back to the preview; a missing preview displays “No preview registered”.

```mermaid
stateDiagram-v2
    Preview --> Code: Source exists and Code selected
    Code --> Preview: Preview selected
    Code --> Preview: Source unavailable, use fallback
    Preview --> Missing: No preview registered
```

## Switching can discard demo state

The preview and code branches are conditionally rendered. Switching to code unmounts the preview, so local state in that demo is not preserved by the tab owner. Returning can recreate its initial data. The page is not a saved workspace.

SourceBlock folds nested regions and supports reset/all-fold controls. Its lightweight tokenizer is presentation, not a TypeScript compiler. The shared CodeSurfaceProvider supplies two Pierre highlight workers and five preloaded language names to library code surfaces; worker failures are not evidence that a source snippet was validated.

The extractor is a handwritten balanced-text/reference scanner, run before dev/build. It couples snippets to authored examples, but does not prove arbitrary JavaScript parsing, transitive imported helpers or standalone copy/paste compilation. Change the example source, regenerate and inspect the result; do not hand-edit generated snippets.

PreviewAvailability models source present/absent and the selected/rendered branch. Independent rendered-source evidence checks that code is shown only with source; a separate rule requires the selected Preview tab to render the preview. It excludes React lifecycle, source extraction, syntax validity and demo behavior.
