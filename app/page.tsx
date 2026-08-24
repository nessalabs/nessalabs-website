import Link from "next/link";
import {
  Announce,
  AsciiArt,
  AsciiBox,
  Badge,
  Button,
  Cell,
  CellGrid,
  Section,
  Terminal,
  Ticker,
} from "@/components/nessa-ui";
import { Subscribe } from "@/components/site/subscribe";
import { registry } from "@/registry";

const surfaces = [
  { name: "Nessa Research", note: "Papers, evals, and open weights." },
  { name: "Nessa Agents", note: "Long-running agents with real memory." },
  { name: "nessa-ui", note: "The component layer we ship on." },
];

const partners = ["Apple", "NVIDIA", "Google", "OpenAI"];

export default function HomePage() {
  const featured = registry.slice(0, 6);

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden border-b border-line">
        <AsciiArt
          className="absolute inset-x-0 top-0 h-[420px] w-full opacity-40"
          cols={220}
          rows={30}
          density={0.7}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/70 to-ink" />

        <div className="relative mx-auto w-full max-w-6xl px-6 py-24 text-center sm:px-10 sm:py-32">
          <div className="animate-fade-up flex justify-center">
            <Announce label="coming soon" href="/agents">
              Nessa Agents enters private preview
            </Announce>
          </div>

          <h1 className="animate-fade-up mx-auto mt-10 max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-fg sm:text-6xl">
            Wherever life happens,
            <br />
            our AI is there.
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-xl font-mono text-sm leading-7 text-muted">
            The AI stack for modern humans. Research, agents, and the interface
            layer in between.
          </p>

          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/ui/components">
              <Button variant="solid" size="lg">
                browse nessa-ui
              </Button>
            </Link>
            <Link href="/research">
              <Button variant="ghost" size="lg" brackets>
                read the research
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Ticker
        items={[
          "applied research",
          "agent runtime",
          "nessa-ui v0.1.0",
          "open source",
          "built in the open",
        ]}
      />

      {/* what we build */}
      <Section
        eyebrow="surfaces"
        title="Across your life and work."
        description="One superintelligent layer, exposed through three surfaces. Each one ships on the same primitives."
      >
        <CellGrid cols={3}>
          {surfaces.map((s) => (
            <Cell key={s.name} className="min-h-40">
              <div className="text-lg tracking-tight text-fg">{s.name}</div>
              <p className="mt-2 font-mono text-xs leading-6 text-dim">
                {s.note}
              </p>
            </Cell>
          ))}
        </CellGrid>
      </Section>

      {/* nessa-ui */}
      <Section
        eyebrow="nessa-ui"
        title="The components this page is made of."
        description="A monospace, ASCII-first component library. Copy the source into your app — no runtime dependency, no theme lock-in."
        action={
          <Link href="/ui/components">
            <Button variant="accent" brackets>
              view components
            </Button>
          </Link>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Terminal
            typing
            title="nessa@labs — install"
            lines={[
              "$ npx nessa-ui@latest add button",
              "  ↳ resolving registry…",
              "  ↳ writing components/nessa-ui/button.tsx",
              "✔ installed in 412ms",
            ]}
          />
          <AsciiBox
            title="principles"
            footer="v0.1.0"
            className="border border-line p-4"
          >
            <ul className="space-y-3 font-mono text-xs leading-6 text-muted">
              <li>— Everything sits on a monospace grid.</li>
              <li>— Frames are characters, not shadows.</li>
              <li>— No animation without a reduced-motion path.</li>
              <li>— The source is the package.</li>
            </ul>
          </AsciiBox>
        </div>

        <div className="mt-6">
          <CellGrid cols={3}>
            {featured.map((c) => (
              <Cell key={c.slug} className="min-h-32">
                <Link href={`/ui/components/${c.slug}`} className="block">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm text-fg">{c.name}</span>
                    <Badge tone={c.status === "stable" ? "accent" : "warn"}>
                      {c.status}
                    </Badge>
                  </div>
                  <p className="mt-2 font-mono text-xs leading-6 text-dim">
                    {c.description}
                  </p>
                </Link>
              </Cell>
            ))}
          </CellGrid>
        </div>
      </Section>

      {/* trusted by */}
      <Section eyebrow="adoption" title="Trusted by teams at">
        <CellGrid cols={4}>
          {partners.map((p) => (
            <Cell
              key={p}
              className="flex min-h-28 items-center justify-center text-lg tracking-tight text-muted"
            >
              {p}
            </Cell>
          ))}
        </CellGrid>
      </Section>

      {/* cta */}
      <Section
        className="border-b-0"
        eyebrow="access"
        title="Sync with us."
        description="Early access to the agent runtime, plus release notes for nessa-ui."
      >
        <Subscribe />
      </Section>
    </>
  );
}
