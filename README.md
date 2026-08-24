# nessalabs-website

The Nessa Labs website — homepage plus the **nessa-ui** component documentation
at `/ui/components`.

The site is built from nessa-ui itself: the nav, hero, buttons, and footer are
the same components the docs document. The homepage is a single hero over an
ASCII-art background with a route into the component docs — the ASCII treatment
is background texture only, not the UI language.

## Stack

- Next.js (App Router) + React 19
- TypeScript
- Tailwind CSS v4 — semantic tokens in `app/globals.css`; light is the `@theme`
  default and dark swaps the same variables via `prefers-color-scheme` or
  `data-theme` on `<html>`
- JetBrains Mono / Inter via `next/font`
- Deployed on Vercel

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
  site/                         site-only composition of those components
registry/
  index.ts                      docs metadata: usage, props, examples
  previews.tsx                  live preview node for each slug and example id
```

## Adding a component

1. Write it in `components/nessa-ui/<name>.tsx` and export it from
   `components/nessa-ui/index.ts`.
2. Add an entry to `registry/index.ts` — slug, group, description, usage code,
   props, and any extra examples.
3. Add the live preview node to `registry/previews.tsx`, keyed by the slug (and
   by each example id).

The docs page, the sidebar, and the static params all come from the registry, so
there is nothing else to wire up.

## Design rules

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
