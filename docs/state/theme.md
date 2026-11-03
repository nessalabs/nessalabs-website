---
id: theme
title: Change the theme
kind: statechart
status: implemented
summary: "Visible theme can change even when saving the preference fails."
parent: website
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks: {}
diagramDetails:
  - diagram: 0
    node: Defaults
    section: Visible choice and saved preference
  - diagram: 0
    node: VisibleChoice
    section: Visible choice and saved preference
  - diagram: 0
    node: Unsaved
    section: Visible choice and saved preference
sources:
  - components/site/theme.tsx
  - app/layout.tsx
  - components/site/code-surface.tsx
model: { spec: "tla/ThemePublication.tla", config: "tla/ThemePublication.cfg" }
modelCheck:
  sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
  checker: tlc-1.7.4
  date: 2026-11-03T09:47:08.186Z
  config: tla/ThemePublication.cfg
  modelDigest: 288e824def5cf189cbe27b9111e29498ec79b0609d28db0ae1e4e0c7dfc5038a
  states: 4
  held:
    - ConsistentSurfaces
    - VisibleDespiteStorage
  broke: []
  unchecked: []
---

# Change the theme when storage is unavailable

Use Toggle theme to switch light/dark. The owner applies the same choice to root data-theme, the dark class and colorScheme, and passes it to code surfaces. It then tries to save `nessa-theme`; a storage exception is caught, so the current page still changes.

Before paint, the bootstrap script reads a valid saved choice or uses the OS preference. That OS fallback only runs if reading storage succeeds. If the read itself throws, the whole bootstrap try/catch leaves the root defaults unchanged. The mounted provider reads the resulting root class. It does not subscribe to subsequent OS theme changes.

```mermaid
stateDiagram-v2
    Defaults --> Resolved: Storage read succeeds, saved choice or OS
    Defaults --> Defaults: Storage read throws
    Resolved --> VisibleChoice: Toggle applies DOM choice
    Defaults --> VisibleChoice: Toggle applies DOM choice
    VisibleChoice --> Saved: Storage write succeeds
    VisibleChoice --> Unsaved: Storage write fails, page still changes
    Saved --> VisibleChoice: Toggle again
    Unsaved --> VisibleChoice: Toggle again
```

## Visible choice and saved preference

If the choice reverts after a reload, inspect storage availability rather than assuming the button failed. Persistence is local to the browser origin; there is no server account setting or cross-tab synchronization in this owner. The toggle hides its icon until mount to keep server/client markup aligned.

ThemePublication models light/dark, independent root surfaces and optional persistence success for one toggle. It checks consistent visible surfaces and applies the requested theme despite a failed write. Negative controls update only one surface or gate visible application on persistence. Bootstrap, CSS contrast, media-query behavior and cross-tab races are excluded.
