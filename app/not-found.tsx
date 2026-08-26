import Link from "next/link";
import { Button } from "@nessa-ui/react";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-28 sm:px-10">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">404</h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        That page does not exist.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button variant="outline">Back home</Button>
        </Link>
      </div>
    </section>
  );
}
