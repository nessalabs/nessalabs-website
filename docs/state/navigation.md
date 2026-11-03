---
id: navigation
title: Navigate the site
kind: guide
status: implemented
summary: "Site navigation, documentation navigation and coming-soon pages have different owners."
parent: website
sourceRevision: "34c39ddd2b31050611e209296ea9b2db7cf91023"
diagramLinks: {}
sources:
  - components/site/site-nav.tsx
  - components/site/docs-nav.tsx
  - components/site/nav-bar.tsx
  - app/not-found.tsx
  - app/agents/page.tsx
  - app/courses/page.tsx
  - app/research/page.tsx
---

# Find a route and close the menu

Use the top navigation for Components, Tools, Courses, Research and Agents. The harness deliberately hides this site bar and supplies its own app surface. Unknown component slugs call Next’s notFound; route existence is not inferred from a similar name.

The documentation rail groups the registry’s eight component families. On small screens its button opens a drawer over the page. While open it sets body overflow to hidden, focuses the panel and listens for Escape. Closing or a pathname change removes that listener, restores the previously observed overflow style and returns focus to the trigger. This describes focus entry/return, not a claim of a complete focus trap or screen-reader qualification.

```mermaid
stateDiagram-v2
    Closed --> Open: Open component menu
    Open --> Closed: Escape, close control or route change
    Open --> Removed: Owner unmounts and restores prior overflow
```

The site’s own responsive top menu lives in nav-bar.tsx; it is separate from the component drawer. Courses, Research and Agents explicitly say coming soon. Tools links to the implemented pricing table. External GitHub links leave this application; the site does not administer a repository or authenticate a provider.
