import type { Metadata } from "next";
import { HarnessView } from "@/components/site/harness-view";

export const metadata: Metadata = {
  title: "Harness",
  description:
    "A working agent harness assembled from nessa-ui: shell, panes, chat, board, calendar and canvas.",
};

export default function HarnessPage() {
  return <HarnessView />;
}
