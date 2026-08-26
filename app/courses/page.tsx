import type { Metadata } from "next";
import { Badge } from "@nessa-ui/react";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Free courses on building agents: the loop, tools, memory, evaluation and the interfaces around them.",
};

export default function CoursesPage() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-24 sm:px-8">
      <Badge variant="secondary">Coming soon</Badge>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Courses
      </h1>
      <p className="mt-4 text-base leading-7 text-muted-foreground">
        Free, practical courses on building agents: the loop, tools, memory,
        evaluation, and the interfaces around them.
      </p>
    </section>
  );
}
