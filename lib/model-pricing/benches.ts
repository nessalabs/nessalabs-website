import type { Bench, BenchScore } from "./types";

const ANTHROPIC = "https://www.anthropic.com/claude-fable-and-mythos-5-1";
const OPENAI = "https://openai.com/index/gpt-6-astra/";
const TERMINAL = "https://snorkel.ai/leaderboard/terminal-bench-4-0/";
const DEEPSWE = "https://deepswe.datacurve.ai/";

/**
 * Task-bench scores read from the linked boards on 2026-09-28.
 * A column is one board and one protocol. A cell from a different lab's run
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
      "Anthropic's run on the authors' August 2026 task release. Safeguards scored a zero where they stopped Fable. Not the same set as the offline row.",
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
    url: TERMINAL,
    protocol:
      "Snorkel's Harbor run of terminal-bench/terminal-bench@4.0.0, 66 tasks. The note is the effort and agent on that row.",
  },
  {
    id: "deepswe",
    name: "DeepSWE v1.1",
    task: "Coding agent",
    summary: "Long-horizon changes in real repositories.",
    unit: "percent",
    url: DEEPSWE,
    protocol:
      "Datacurve's board, 113 tasks, mini-swe-agent, four runs, dated 22 September 2026. The cell is the best effort on that board, named in the note. The board prints a whole percent. The cell keeps one decimal from the same pass rate.",
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
const T = TERMINAL;
const D = DEEPSWE;

/** Keyed by model id. Models with no entry have no published score in this catalog. */
export const benchScores: Record<string, BenchScore[]> = {
  "claude-fable-5-1": [
    score("osworld-strict", 41.7, A, "Anthropic", "Partial 77.9%."),
    score("terminal-bench-4", 57.9, T, "Snorkel", "max, Claude Code."),
    score("terminal-bench-science", 52.6, A, "Anthropic"),
    score("automation-bench", 31.4, A, "Anthropic"),
    score("cursorbench", 73.4, A, "Anthropic"),
    score("gdpval", 1853, A, "Anthropic"),
  ],
  "claude-fable-5": [
    score("osworld-strict", 36.1, A, "Anthropic", "Partial 72.9%."),
    score("terminal-bench-4", 44.5, T, "Snorkel", "max, Claude Code."),
    score("deepswe", 69.9, D, "Datacurve", "xhigh."),
    score("terminal-bench-science", 24.7, A, "Anthropic"),
    score("automation-bench", 17.1, A, "Anthropic"),
    score("cursorbench", 70.5, A, "Anthropic"),
    score("gdpval", 1723, A, "Anthropic"),
  ],
  "claude-opus-5": [
    score("osworld-strict", 39.6, A, "Anthropic", "Partial 75.4%."),
    score("terminal-bench-4", 53.9, T, "Snorkel", "xhigh, Claude Code."),
    score("deepswe", 73.6, D, "Datacurve", "max."),
    score("terminal-bench-science", 29.0, A, "Anthropic"),
    score("automation-bench", 26.9, A, "Anthropic"),
    score("cursorbench", 70.0, A, "Anthropic"),
    score("gdpval", 1824, A, "Anthropic"),
  ],
  "claude-opus-4-8": [
    score("terminal-bench-4", 23.6, T, "Snorkel", "max, Claude Code."),
    score("deepswe", 59.0, D, "Datacurve", "max."),
  ],
  "claude-sonnet-5": [
    score("terminal-bench-4", 12.4, T, "Snorkel", "max, Claude Code."),
    score("deepswe", 53.8, D, "Datacurve", "max."),
  ],
  "gpt-6-astra": [
    score("osworld-offline", 72.6, O, "OpenAI"),
    score("terminal-bench-4", 58.2, T, "Snorkel", "max, Codex."),
    score("deepswe", 74.1, D, "Datacurve", "xhigh."),
    score("terminal-bench-science", 64.6, O, "OpenAI", "OpenAI's run."),
    score("automation-bench", 41.4, O, "OpenAI", "OpenAI's run."),
  ],
  "gpt-5.6-sol": [
    score("osworld-offline", 65.7, O, "OpenAI"),
    score("terminal-bench-4", 37.3, T, "Snorkel", "max, Codex."),
    score("deepswe", 72.7, D, "Datacurve", "max."),
    score("terminal-bench-science", 22.4, A, "Anthropic"),
    score("automation-bench", 19.6, A, "Anthropic"),
    score("cursorbench", 67.2, A, "Anthropic"),
    score("gdpval", 1711, A, "Anthropic"),
  ],
  "gpt-5.6-terra": [
    score("terminal-bench-4", 21.5, T, "Snorkel", "max, Codex."),
    score("deepswe", 69.6, D, "Datacurve", "max."),
  ],
  "gpt-5.6-luna": [
    score("terminal-bench-4", 17.3, T, "Snorkel", "max, Codex."),
    score("deepswe", 67.2, D, "Datacurve", "max."),
  ],
  "gemini-3.8-flash": [
    score("terminal-bench-4", 19.1, T, "Snorkel", "high, mini-SWE-agent."),
    score("deepswe", 73.8, D, "Datacurve", "high."),
  ],
  "grok-4.7": [
    score("terminal-bench-4", 37.6, T, "Snorkel", "xhigh, Grok Build."),
  ],
  "grok-4.6": [
    score("terminal-bench-4", 20.3, T, "Snorkel", "high, Grok Build."),
    score("deepswe", 67.5, D, "Datacurve", "medium."),
  ],
  "grok-4.5": [
    score("terminal-bench-4", 12.4, T, "Snorkel", "high, Grok Build."),
    score("deepswe", 53.8, D, "Datacurve", "high."),
  ],
  "kimi-k2.7-code": [
    score("deepswe", 30.5, D, "Datacurve", "No effort setting."),
  ],
  "deepseek-v4-pro": [
    score("deepswe", 62.8, D, "Datacurve", "max."),
  ],
};
