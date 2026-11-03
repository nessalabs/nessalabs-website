---
id: library
title: Vendored library
kind: guide
status: implemented
summary: "Vendored component behavior belongs upstream; website demos wire controlled state and sample data."
parent: website
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks: {}
sources:
  - nessa-ui/VENDORED.md
  - agent-stream/VENDORED.md
  - tsconfig.json
  - registry/demos/composites.tsx
  - registry/demos/chat.tsx
  - registry/demos/agent.tsx
  - registry/demos/git.tsx
---

# Distinguish the website from the UI library

The site imports `@nessa-ui/react` and `@nessa-ui/agent-stream` through TypeScript aliases pointing to local vendored source. The React marker says version 0.1.0; these markers do not pin an upstream commit SHA. Edit upstream and sync explicitly instead of changing a copied component here.

| Family       | What the website demonstrates                            | Ownership limit                                                        |
| ------------ | -------------------------------------------------------- | ---------------------------------------------------------------------- |
| Primitives   | Inputs, buttons, menus, avatars and appearance surfaces  | Local callbacks do not persist application data                        |
| Layout       | Shells, splits, decks, drawers, sheets and virtual lists | Demo layout state is not a desktop window manager                      |
| Data         | Tables, boards, calendar, outline and JSON               | Sample row mutations are not database transactions                     |
| Charts       | Price, pie, radar, flow, Gantt and workflow interactions | Geometry and selections do not validate external business data         |
| Files        | Code, markdown, math, Mermaid, previews and diffs        | Rendering is distinct from file authorization or safe remote transport |
| Conversation | Messages, composer, scroll/rail and rich streaming       | Simulated content is not a provider session                            |
| Agent        | Tool displays, approvals and execution surfaces          | Clicking a demo approval does not grant production tool authority      |
| Git          | History and details                                      | Sample commits do not operate a repository                             |

Demo modules under registry/demos own controlled state and sample data. Vendored components own interaction mechanics. The site’s build and selected pure tests cover the copied checkpoint only; they do not rerun every upstream Storybook/browser/adapter suite. [Inventory](inventory.md) makes the route mapping exhaustive without claiming every copied component was requalified.

The root README retains known FileDiffList scroller and CodeBlock/Pierre integration notes. This atlas does not mark those historical reports fixed merely because the build and pure tests pass; the custom SourceBlock is a separate docs-chrome renderer.
