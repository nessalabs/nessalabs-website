import type { Metadata } from "next";
import { ComingSoon } from "@/components/site/coming-soon";

export const metadata: Metadata = { title: "Agents" };

export default function AgentsPage() {
  return (
    <ComingSoon
      title="Agents"
      blurb="Long-running agents with real memory, wired into the surfaces you already use. Private preview."
    />
  );
}
