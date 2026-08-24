import Link from "next/link";
import { AsciiArt, Badge, Button } from "@/components/nessa-ui";

export function ComingSoon({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <AsciiArt
        className="absolute inset-x-0 top-0 h-64 w-full opacity-20"
        cols={200}
        rows={18}
        density={0.6}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent to-ink" />
      <div className="relative mx-auto w-full max-w-3xl px-6 py-28 sm:px-10">
        <Badge tone="warn">Coming soon</Badge>
        <h1 className="mt-6 text-3xl font-medium tracking-tight text-fg sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">{blurb}</p>
        <div className="mt-8">
          <Link href="/ui/components">
            <Button>Browse components</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
