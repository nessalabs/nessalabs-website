import Link from "next/link";
import { Button } from "@nessa-ui/react";
import { Announce } from "@/components/site/announce";
import { AsciiArt } from "@/components/site/ascii-art";

export default function HomePage() {
  return (
    <section className="relative flex min-h-[calc(100vh-3.5rem)] items-center overflow-hidden">
      {/* background art */}
      <AsciiArt
        className="absolute inset-0 h-full w-full opacity-60"
        cols={240}
        rows={60}
        density={0.6}
        fade={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-radial-fade" />

      <div className="relative mx-auto w-full max-w-3xl px-6 py-24 text-center sm:px-8">
        <div className="animate-fade-up flex justify-center">
          <Announce label="New" href="/ui/components">
            nessa-ui v0.1.0 is available
          </Announce>
        </div>

        <h1 className="animate-fade-up mt-8 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl">
          Research for systems
          <br />
          that think.
        </h1>

        <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-base text-muted-foreground">
          Nessa Labs builds agents and the interfaces they run in. nessa-ui,
          the React component system behind them, is documented here.
        </p>

        <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/ui/components">
            <Button size="lg">Browse components</Button>
          </Link>
          <Link href="/ui/components/button">
            <Button size="lg" variant="outline">
              View an example
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
