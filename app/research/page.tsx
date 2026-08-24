import type { Metadata } from "next";
import { ComingSoon } from "@/components/site/coming-soon";

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  return (
    <ComingSoon
      title="Research"
      blurb="Papers, evals, and open weights from the lab. We publish what we can, when it is reproducible."
    />
  );
}
