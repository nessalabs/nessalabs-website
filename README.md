# nessalabs-website

The Nessa Labs website — homepage plus the **nessa-ui** component documentation
at `/ui/components`.

The site is built from nessa-ui itself. Every section on the homepage — the nav,
the hero field, the marquee, the cell grids, the footer — is a component that is
also documented in the registry. If a primitive is missing from the docs, it
should not be on the page.

## Stack

- Next.js (App Router) + React 19
- TypeScript
- Tailwind CSS v4 (tokens defined in `app/globals.css` under `@theme`)
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
  page.tsx                      homepage
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

- Everything sits on a monospace grid.
- Frames are box-drawing characters, not shadows.
- No animation without a `prefers-reduced-motion` path.
- The source is the package: components are copied into consuming apps, not
  installed as a runtime dependency.

## Deploy

Push to `main` and Vercel builds it. Locally:

```bash
npm run build
```
