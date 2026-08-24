import Link from "next/link";
import { Button, Terminal } from "@/components/nessa-ui";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-28 sm:px-10">
      <h1 className="text-3xl font-medium tracking-tight text-fg">404</h1>
      <p className="mt-4 font-mono text-xs leading-6 text-muted">
        That page is not in the registry.
      </p>
      <div className="mt-8">
        <Terminal
          title="nessa@labs"
          lines={["$ nessa route resolve", "✗ no such path"]}
        />
      </div>
      <div className="mt-8">
        <Link href="/">
          <Button variant="outline" brackets>
            back home
          </Button>
        </Link>
      </div>
    </section>
  );
}
