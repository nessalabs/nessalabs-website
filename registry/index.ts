import type { PropRow } from "@/components/nessa-ui/prop-table";

export interface ComponentDoc {
  slug: string;
  name: string;
  description: string;
  status: "stable" | "beta";
  group: "Layout" | "Primitives" | "Display" | "Navigation";
  usage: string;
  props: PropRow[];
  /** Extra worked examples, each mapped to a preview id in registry/previews. */
  examples?: { id: string; title: string; code: string }[];
}

export const registry: ComponentDoc[] = [
  {
    slug: "ascii-box",
    name: "AsciiBox",
    description:
      "A container framed with box-drawing characters instead of CSS borders, so the frame sits on the monospace grid.",
    status: "stable",
    group: "Layout",
    usage: `import { AsciiBox } from "@/components/nessa-ui"

<AsciiBox title="manifest" footer="v0.1.0">
  Wherever life happens, our AI is there.
</AsciiBox>`,
    props: [
      {
        name: "title",
        type: "string",
        description: "Rendered into the top rule.",
      },
      {
        name: "footer",
        type: "string",
        description: "Rendered into the bottom rule, right aligned.",
      },
      { name: "dense", type: "boolean", default: "false" },
    ],
    examples: [
      {
        id: "ascii-box-dense",
        title: "Dense",
        code: `<AsciiBox title="log" dense>
  build ok — 412ms
</AsciiBox>`,
      },
    ],
  },
  {
    slug: "button",
    name: "Button",
    description:
      "The terminal button. Four variants, three sizes, and an optional bracket affordance.",
    status: "stable",
    group: "Primitives",
    usage: `import { Button } from "@/components/nessa-ui"

<Button variant="accent" brackets>
  sync with us
</Button>`,
    props: [
      {
        name: "variant",
        type: '"solid" | "outline" | "ghost" | "accent"',
        default: '"outline"',
      },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"' },
      {
        name: "brackets",
        type: "boolean",
        default: "false",
        description: "Wraps the label in square brackets.",
      },
    ],
    examples: [
      {
        id: "button-variants",
        title: "Variants",
        code: `<Button variant="solid">solid</Button>
<Button variant="outline">outline</Button>
<Button variant="ghost">ghost</Button>
<Button variant="accent">accent</Button>`,
      },
      {
        id: "button-sizes",
        title: "Sizes",
        code: `<Button size="sm">sm</Button>
<Button size="md">md</Button>
<Button size="lg">lg</Button>`,
      },
    ],
  },
  {
    slug: "badge",
    name: "Badge",
    description: "A compact status marker in four tones.",
    status: "stable",
    group: "Display",
    usage: `import { Badge } from "@/components/nessa-ui"

<Badge tone="accent">stable</Badge>`,
    props: [
      {
        name: "tone",
        type: '"neutral" | "accent" | "warn" | "outline"',
        default: '"neutral"',
      },
    ],
  },
  {
    slug: "terminal",
    name: "Terminal",
    description:
      "A framed console window that can type its contents out on mount. Respects prefers-reduced-motion.",
    status: "stable",
    group: "Display",
    usage: `import { Terminal } from "@/components/nessa-ui"

<Terminal
  title="nessa@labs"
  typing
  lines={["$ npx nessa-ui add button", "✔ installed"]}
/>`,
    props: [
      { name: "lines", type: "string[]", description: "Required." },
      { name: "title", type: "string", default: '"nessa@labs"' },
      { name: "typing", type: "boolean", default: "false" },
      {
        name: "speed",
        type: "number",
        default: "18",
        description: "Milliseconds per character.",
      },
    ],
  },
  {
    slug: "ascii-art",
    name: "AsciiArt",
    description:
      "A deterministic dithered character field. The value of each cell is an integer hash of its coordinates, so it renders identically on server and client.",
    status: "beta",
    group: "Display",
    usage: `import { AsciiArt } from "@/components/nessa-ui"

<AsciiArt cols={120} rows={18} density={0.6} />`,
    props: [
      { name: "cols", type: "number", default: "120" },
      { name: "rows", type: "number", default: "22" },
      { name: "seed", type: "number", default: "7" },
      { name: "ramp", type: "string", default: '" ·:-=+*#%@"' },
      {
        name: "density",
        type: "number",
        default: "0.55",
        description: "0 is sparse, 1 is packed.",
      },
      { name: "fade", type: "boolean", default: "true" },
    ],
  },
  {
    slug: "ticker",
    name: "Ticker",
    description:
      "An infinite marquee rail. Contents are duplicated for a seamless loop and pause on hover.",
    status: "stable",
    group: "Display",
    usage: `import { Ticker } from "@/components/nessa-ui"

<Ticker items={["research", "agents", "infrastructure"]} />`,
    props: [
      { name: "items", type: "string[]", description: "Required." },
      { name: "separator", type: "string", default: '"◆"' },
    ],
  },
  {
    slug: "code-block",
    name: "CodeBlock",
    description:
      "A copyable code surface with an optional filename bar and line numbers.",
    status: "stable",
    group: "Display",
    usage: `import { CodeBlock } from "@/components/nessa-ui"

<CodeBlock filename="page.tsx" code={source} showLineNumbers />`,
    props: [
      { name: "code", type: "string", description: "Required." },
      { name: "lang", type: "string", default: '"tsx"' },
      { name: "filename", type: "string" },
      { name: "showLineNumbers", type: "boolean", default: "false" },
      { name: "copyable", type: "boolean", default: "true" },
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    description: "Underlined tab strip driven by a flat array of items.",
    status: "stable",
    group: "Navigation",
    usage: `import { Tabs } from "@/components/nessa-ui"

<Tabs
  items={[
    { value: "preview", label: "Preview", content: <Demo /> },
    { value: "code", label: "Code", content: <CodeBlock code={src} /> },
  ]}
/>`,
    props: [
      { name: "items", type: "TabItem[]", description: "Required." },
      {
        name: "defaultValue",
        type: "string",
        description: "Falls back to the first item.",
      },
    ],
  },
  {
    slug: "input",
    name: "Input",
    description: "A single-line field with an optional prompt glyph.",
    status: "stable",
    group: "Primitives",
    usage: `import { Input } from "@/components/nessa-ui"

<Input prompt="$" placeholder="your@email.com" />`,
    props: [
      { name: "prompt", type: "string", description: 'Leading glyph, e.g. "$".' },
    ],
  },
  {
    slug: "cell-grid",
    name: "CellGrid",
    description:
      "A hairline grid whose cells share single-pixel dividers. Pairs with Cell.",
    status: "stable",
    group: "Layout",
    usage: `import { CellGrid, Cell } from "@/components/nessa-ui"

<CellGrid cols={3}>
  <Cell>research</Cell>
  <Cell>agents</Cell>
  <Cell>infrastructure</Cell>
</CellGrid>`,
    props: [{ name: "cols", type: "2 | 3 | 4", default: "3" }],
  },
  {
    slug: "announce",
    name: "Announce",
    description: "The pill-shaped announcement link used above the hero.",
    status: "stable",
    group: "Display",
    usage: `import { Announce } from "@/components/nessa-ui"

<Announce label="coming soon" href="/research">
  Nessa Agents enters private preview
</Announce>`,
    props: [{ name: "label", type: "string", description: "Required." }],
  },
  {
    slug: "section",
    name: "Section",
    description:
      "Page section shell with an eyebrow, title, description, and action slot.",
    status: "stable",
    group: "Layout",
    usage: `import { Section } from "@/components/nessa-ui"

<Section eyebrow="nessa-ui" title="Components" description="…">
  {children}
</Section>`,
    props: [
      { name: "eyebrow", type: "string" },
      { name: "title", type: "ReactNode" },
      { name: "description", type: "ReactNode" },
      { name: "action", type: "ReactNode" },
    ],
  },
];

export function getComponent(slug: string) {
  return registry.find((c) => c.slug === slug);
}

export const groups = ["Primitives", "Layout", "Display", "Navigation"] as const;
