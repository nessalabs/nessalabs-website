import Link from "next/link";
import { Button } from "@/components/nessa-ui";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-28 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">404</h1>
      <p className="mt-4 text-base leading-7 text-muted">
        We could not find that page.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button variant="outline">Back home</Button>
        </Link>
      </div>
    </section>
  );
}
