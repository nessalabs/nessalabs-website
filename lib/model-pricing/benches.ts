import type { Bench, BenchScore } from "./types";

const ANTHROPIC = "https://www.anthropic.com/claude-fable-and-mythos-5-1";
const OPENAI = "https://openai.com/index/gpt-6-astra/";

/**
 * Task-bench scores checked on 2026-09-27.
 * A column is one published comparison. A cell from a different lab's run
 * carries `note` and is not treated as the same setup.
 */
export const benches: Bench[] = [
  {
    id: "osworld-strict",
    name: "OSWorld 2.0 strict",
    task: "Computer use",
    summary: "A desktop task counts only when the whole task finishes.",
    unit: "percent",
    url: ANTHROPIC,
    protocol:
      "Anthropic's run on the authors' August 2026 task release. Safeguards scored a zero where they stopped Fable. Not the same set as the offline column.",
  },
  {
    id: "osworld-offline",
    name: "OSWorld 2.0 offline",
    task: "Computer use",
    summary: "A desktop task without internet, with partial credit.",
    unit: "percent",
    url: OPENAI,
    protocol: "OpenAI's v2026.08.08 offline set, partial score.",
  },
  {
    id: "terminal-bench-4",
    name: "Terminal-Bench 4.0",
    task: "Terminal agent",
    summary: "Terminal tasks covering software, configuration and data analysis.",
    unit: "percent",
    url: OPENAI,
    protocol:
      "OpenAI's comparison at maximum effort. Anthropic's own post reports the same 55.8% for Fable 5.1, and 42.0% and 52.3% for Fable 5 and Opus 5.",
  },
  {
    id: "deepswe",
    name: "DeepSWE v1.1",
    task: "Coding agent",
    summary: "Long-horizon changes in real repositories.",
    unit: "percent",
    url: OPENAI,
    protocol: "OpenAI's comparison.",
  },
  {
    id: "terminal-bench-science",
    name: "Terminal-Bench Science 0.1",
    task: "Research agent",
    summary: "Scientific workflows that analyse data, run simulations and fit models.",
    unit: "percent",
    url: ANTHROPIC,
    protocol:
      "Anthropic's setup, with a standard error of about 4 points, unless the cell names another run.",
  },
  {
    id: "automation-bench",
    name: "AutomationBench",
    task: "Workflow agent",
    summary: "Multi-step business workflows.",
    unit: "percent",
    url: ANTHROPIC,
    protocol: "Anthropic's comparison, unless the cell names another run.",
  },
  {
    id: "cursorbench",
    name: "CursorBench 3.2",
    task: "Coding agent",
    summary: "Agentic coding tasks in Cursor.",
    unit: "percent",
    url: ANTHROPIC,
    protocol: "Anthropic's comparison.",
  },
  {
    id: "gdpval",
    name: "GDPval-AA v2",
    task: "Knowledge work",
    summary: "Professional knowledge-work tasks, scored as Elo.",
    unit: "elo",
    url: ANTHROPIC,
    protocol: "Anthropic's comparison.",
  },
];

function score(
  bench: string,
  value: number,
  source: string,
  reportedBy: string,
  note?: string,
): BenchScore {
  return note ? { bench, value, source, reportedBy, note } : { bench, value, source, reportedBy };
}

const A = ANTHROPIC;
const O = OPENAI;

/** Keyed by model id. Models with no entry have no published score in this catalog. */
export const benchScores: Record<string, BenchScore[]> = {
  "claude-fable-5-1": [
    score("osworld-strict", 41.7, A, "Anthropic", "Partial 77.9%."),
    score("terminal-bench-4", 55.8, O, "OpenAI"),
    score("deepswe", 67.4, O, "OpenAI"),
    score("terminal-bench-science", 52.6, A, "Anthropic"),
    score("automation-bench", 31.4, A, "Anthropic"),
    score("cursorbench", 73.4, A, "Anthropic"),
    score("gdpval", 1853, A, "Anthropic"),
  ],
  "claude-fable-5": [
    score("osworld-strict", 36.1, A, "Anthropic", "Partial 72.9%."),
    score("terminal-bench-4", 44.5, O, "OpenAI"),
    score("deepswe", 69.9, O, "OpenAI"),
    score("terminal-bench-science", 24.7, A, "Anthropic"),
    score("automation-bench", 17.1, A, "Anthropic"),
    score("cursorbench", 70.5, A, "Anthropic"),
    score("gdpval", 1723, A, "Anthropic"),
  ],
  "claude-opus-5": [
    score("osworld-strict", 39.6, A, "Anthropic", "Partial 75.4%."),
    score("terminal-bench-4", 52.6, O, "OpenAI"),
    score("deepswe", 73.7, O, "OpenAI"),
    score("terminal-bench-science", 29.0, A, "Anthropic"),
    score("automation-bench", 26.9, A, "Anthropic"),
    score("cursorbench", 70.0, A, "Anthropic"),
    score("gdpval", 1824, A, "Anthropic"),
  ],
  "gpt-6-astra": [
    score("osworld-offline", 72.6, O, "OpenAI"),
    score("terminal-bench-4", 57.9, O, "OpenAI"),
    score("deepswe", 74.1, O, "OpenAI"),
    score("terminal-bench-science", 64.6, O, "OpenAI", "OpenAI's run."),
    score("automation-bench", 41.4, O, "OpenAI", "OpenAI's run."),
  ],
  "gpt-5.6-sol": [
    score("osworld-offline", 65.7, O, "OpenAI"),
    score("terminal-bench-4", 37.3, O, "OpenAI"),
    score("deepswe", 72.7, O, "OpenAI"),
    score("terminal-bench-science", 22.4, A, "Anthropic"),
    score("automation-bench", 19.6, A, "Anthropic"),
    score("cursorbench", 67.2, A, "Anthropic"),
    score("gdpval", 1711, A, "Anthropic"),
  ],
  "gemini-3.8-flash": [
    score("terminal-bench-4", 19.1, O, "OpenAI"),
    score("deepswe", 73.8, O, "OpenAI"),
  ],
};
