# nessalabs-website

The Nessa Labs website — homepage plus the **nessa-ui** component documentation
at `/ui/components`.

nessa-ui is a behaviour-first React component system: primitives (button, input,
select, switch, badge, avatar, tooltip, tabs, drawer, sheet…) plus the
composites that usually cost a week each — a resizable application shell, split
panes, a sortable/searchable data table, a pointer-driven board, a
day/week/month/year calendar, a pan-and-zoom node canvas, a Gantt chart, the
chart kit (pie, radar, flow, price, stock quote), the agent surfaces (streaming
chat, composer with queue steering, tool calls, permission prompts, JSON trees,
diff summaries, model picker, activity cues, conversation history) and the
iMessage-style chat surfaces (pill composer, bubbles, tabs, tray, overlay,
annotations).

What ships is the interaction model. Styling is the consumer's: every component
takes `className`, the interactive ones take `classNames` for their parts and a
render prop (`renderNode`, `renderCard`, `renderMessage`) that replaces the look
while drag, zoom, selection, streaming and keyboard behaviour stay intact.

The website is a consumer of the library, not the subject of it. Anything that
exists only for this site — the hero ASCII field, the announcement pill, the
marketing nav — lives in `components/site` and is deliberately not in the
registry.

## The library

The site documents **@nessa-ui/react**, the real package from the nessa-ui
repo. Its source is vendored into `nessa-ui/` by `npm run sync:ui`, which
copies `packages/react/src` and rewrites the package's own `@/…` imports.
Nothing in this repo re-implements a component.

The same script vendors `@nessa-ui/agent-stream` into `agent-stream/`, because
the React package re-exports it. Both are resolved through tsconfig paths of
the same name, so the app imports them exactly as a published consumer would.

Publishing `@nessa-ui/react` to npm would replace the vendoring with a plain
dependency — that is the intended end state, and the only reason it is vendored
today is that the package is unpublished and this app deploys standalone.

## Stack

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Layout

```
app/
  page.tsx                      homepage (hero only)
  ui/components/                nessa-ui docs
    page.tsx                    overview + install
    [slug]/page.tsx             generated per registry entry
  research/, agents/            placeholders for the next surfaces
components/
  nessa-ui/                     the component library (the published source)
  site/                         site-only pieces: nav, brand, hero art, docs shell
registry/
  index.ts                      docs metadata: usage, props, examples
  previews.tsx                  live preview node for each slug and example id
```

## Known issue: FileDiffList escapes its scroller

`FileDiffList` scrolls with `overflow-y-auto` but is not a containing block, so
the `sr-only` diff labels inside it (position: absolute) escape the scroller,
land past the fold and stretch the page. `app/globals.css` patches it with
`[data-slot="file-diff-list"] { position: relative }`. The fix belongs upstream.

## Known issue: CodeBlock

nessa-ui renders code through Pierre's worker-backed engine. Inside this app the
`<diffs-container>` mounts but never paints — no highlighter work is requested,
under both Turbopack and webpack, with and without an explicit
`WorkerPoolContextProvider`. Storybook renders it fine, so it is an integration
gap worth chasing in the library.

Until it is fixed, documentation chrome uses `components/site/source-block.tsx`,
a small local renderer, so install commands and preview code stay readable. The
CodeBlock page still demos the real component.

## Docs code blocks are generated

Each component page shows the code that actually renders the preview above it.
`scripts/extract-preview-source.mjs` reads `registry/previews.tsx`, pulls out
each preview's JSX plus every helper it references, and writes
`registry/preview-source.generated.ts`. It runs on `predev` and `prebuild`, so
the snippet and the running preview can never drift — never hand-write a code
sample in the registry.

## Adding a component

1. Write it in `components/nessa-ui/<name>.tsx` and export it from
   `components/nessa-ui/index.ts`.
2. Add an entry to `registry/index.ts` — slug, group, description, usage code,
   props, and any extra examples.
3. Add the live preview node to `registry/previews.tsx`, keyed by the slug (and
   by each example id). The code tab is generated from it.

The docs page, the sidebar, and the static params all come from the registry, so
there is nothing else to wire up.

## Design rules

- Behaviour is the product; visual defaults are a starting point.
- Quiet and legible: sans for interface text, mono only for code.
- Neutral by default — no accent hue. Emphasis comes from contrast.
- Light and dark are equal citizens; never hard-code a color outside the tokens.
- ASCII art is decoration, never chrome.
- No animation without a `prefers-reduced-motion` path.
- The source is the package: components are copied into consuming apps, not
  installed as a runtime dependency.

## Deploy

Push to `main` and Vercel builds it. Locally:

```bash
npm run build
```

## Theming

Colors are semantic CSS variables (`--color-ink`, `--color-fg`, `--color-line`,
…). Light values live in the `@theme` block; dark redefines the same variables
twice — once under `prefers-color-scheme: dark` for visitors who have not
chosen, and once under `[data-theme="dark"]` so an explicit choice wins.

`ThemeToggle` writes that choice to `localStorage`, and `themeScript` (rendered
into `<head>` in `app/layout.tsx`) reapplies it before first paint so there is
no flash of the wrong palette.

## Syntax highlighting

`CodeBlock` highlights with `lib/highlight.ts` — a small regex tokenizer for the
languages the docs actually use (TS/TSX and shell). Token colors are theme
variables (`--color-code-keyword`, `--color-code-string`, …), so highlighting
follows light and dark like everything else. There is no grammar engine in the
client bundle.

## Attribution

Credits for the open-source work nessa-ui builds on — React/Next.js, Tailwind,
the copy-the-source distribution model from shadcn/ui, headless API patterns
from Radix UI, the WAI-ARIA Authoring Practices, and the Inter and JetBrains
Mono typefaces — are listed on the docs overview at `/ui/components`, and that
list is the one to update when we take on anything new.
