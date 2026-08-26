---
name: component-copy
description: Write or edit user-facing copy for the Nessa Labs site and nessa-ui docs — component descriptions, page intros, hero and nav text, metadata, section labels, empty states. Use whenever adding a registry entry, adding a page, or when copy reads as generic or overwritten.
---

# Component library copy

House style for every word a visitor reads: registry descriptions, page intros,
headings, button labels, metadata, 404s. Code comments are exempt.

## The one rule

**Describe the thing. Do not sell it.**

A reader arrives at a component page already convinced — they clicked it. Their
question is "what is this and how does it behave", not "why should I care". Copy
that answers the second question instead of the first is the failure mode.

## Component descriptions

One sentence. A **noun phrase naming what the component is**, followed by the
behaviour a reader could not guess from the name. No verb-first marketing, no
feature counts, no adjectives about quality.

The shape is: `A <thing> that <does what>.`

```
✅ A vertically stacked set of headings that each reveal a section of content.
✅ A popup that shows information about an element when it is focused or hovered.
✅ A window overlaid on the page, rendering the content underneath inert.
```

Ours, in the same shape:

```
❌ Action button. Six variants, four sizes, icon-aware spacing.
✅ A button that triggers an action, in six variants and four sizes.

❌ Turn navigator beside a transcript. Markers widen toward the pointer.
✅ A navigator beside a transcript that marks each turn and previews it on hover.

❌ Pan-and-zoom node graph. Drag nodes, draw edges, delete with the keyboard.
✅ A pan-and-zoom canvas of nodes and edges that can be dragged, connected and deleted.
```

Keep it under about 20 words. If a component has more behaviour than one
sentence holds, the extra belongs in a **Behaviour** bullet list, not in a
longer description.

## Behaviour bullets

Short, independent, present-tense sentences. Each states one capability or one
guaranteed behaviour. Terminated with a period. No parallel-structure ceremony,
no "seamlessly", no benefit clause.

```
✅ Supports modal and non-modal modes.
✅ Focus is trapped inside the dialog while it is open.
✅ Can be controlled or uncontrolled.
✅ Escape closes the component.
```

Write what happens, not what the user gets from it happening.

## Page intros

Two sentences at most. Sentence one says plainly what the page or product is.
Sentence two says the one non-obvious thing about it. Then stop.

```
✅ shadcn/ui is a set of beautifully-designed, accessible components and a code
   distribution platform.
✅ An open-source UI component library for building high-quality, accessible
   design systems and web apps.
```

The strongest move in this register is a flat contrast:
`This is not X. It is Y.` Use it once per site, not once per page.

## Instructions

Imperative and bare. `Install the library.` `Add the component.` `Import it.`
Never "Let's get started", never "You'll want to", never "Simply".

## Banned

These are the tells that make copy read as machine-written:

- **Portentous abstractions**: "the interfaces between them", "the future of",
  "reimagining how teams…". Cut them; say the concrete thing. The one exception
  is the homepage hero and the social card, where the brand line is deliberate
  and settled — everything below the hero is held to this rule.
- **Empty intensifiers**: seamlessly, effortlessly, powerful, robust, blazing,
  beautiful (unless literally describing the default styling), simply, just.
- **Benefit clauses tacked onto facts**: "…so you can ship faster",
  "…giving you the flexibility to build anything".
- **Triads for rhythm**: "fast, flexible, and fully accessible". Say the one
  that is true.
- **Em-dash asides that restate the sentence** and rhetorical questions.
- **Colons as drama**: "What ships is the hard part: drag, zoom, streaming."
  A colon introduces a list, not a drumroll.
- **We/our voice on a docs page.** The library is the subject, not the team.
  "We publish what we can" → say what is published.
- **Hedging**: "usually", "generally", "should". If a behaviour is conditional,
  name the condition.

## Voice

- Third person and present tense. The component does things; the reader does not
  "get" things.
- British spelling for behaviour/colour, matching the codebase.
- Sentence case for every heading and button label. `Get started`, not
  `Get Started`.
- Serial comma off, matching the existing prose.
- Backtick prop and part names inline: `renderEvent`, `onCardMove`.

## Checklist before committing copy

1. Could this sentence appear verbatim on a different company's site? Rewrite it.
2. Does any sentence describe a feeling rather than a behaviour? Cut it.
3. Is there an adjective doing no work? Cut it.
4. Does the component description start by naming the thing? Fix it.
5. Read it aloud. If it sounds like a launch tweet, it is wrong.
