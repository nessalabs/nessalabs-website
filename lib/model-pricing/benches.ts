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
      "Snorkel's Harbor run of terminal-bench/terminal-bench@4.0.0, 66 tasks. The note names the effort, the agent and the cost of that full run. The board does not publish a cost per task.",
  },
  {
    id: "deepswe",
    name: "DeepSWE v1.1",
    task: "Coding agent",
    summary: "Long-horizon changes in real repositories.",
    unit: "percent",
    url: DEEPSWE,
    protocol:
      "Datacurve's board, 113 tasks, mini-swe-agent, four runs, dated 22 September 2026. Where that board published several thinking levels, each one is listed with its mean cost per task. The marked number is the best score. The board prints a whole percent. These figures keep one decimal from the same pass rate.",
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
  levels?: BenchScore["levels"],
  usd?: number,
): BenchScore {
  return {
    bench,
    value,
    source,
    reportedBy,
    ...(note ? { note } : {}),
    ...(levels ? { levels } : {}),
    ...(usd !== undefined ? { usd } : {}),
  };
}

function levels(...rows: [string, number, number][]): NonNullable<BenchScore["levels"]> {
  return rows.map(([effort, value, usd]) => ({ effort, value, usd }));
}

const A = ANTHROPIC;
const O = OPENAI;
const T = TERMINAL;
const D = DEEPSWE;

/** Keyed by model id. Models with no entry have no published score in this catalog. */
export const benchScores: Record<string, BenchScore[]> = {
  "claude-fable-5-1": [
    score("osworld-strict", 41.7, A, "Anthropic", "Partial 77.9%."),
    score("terminal-bench-4", 57.9, T, "Snorkel", "max, Claude Code. Run $6.2k."),
    score("terminal-bench-science", 52.6, A, "Anthropic"),
    score("automation-bench", 31.4, A, "Anthropic"),
    score("cursorbench", 73.4, A, "Anthropic"),
    score("gdpval", 1853, A, "Anthropic"),
  ],
  "claude-fable-5": [
    score("osworld-strict", 36.1, A, "Anthropic", "Partial 72.9%."),
    score("terminal-bench-4", 44.5, T, "Snorkel", "max, Claude Code. Run $7.3k."),
    score("deepswe", 69.9, D, "Datacurve", undefined, levels(
      ["max", 69.7, 21.63],
      ["xhigh", 69.9, 13.41],
      ["high", 68.6, 9.18],
      ["medium", 65.4, 6.09],
      ["low", 59.6, 3.76],
    )),
    score("terminal-bench-science", 24.7, A, "Anthropic"),
    score("automation-bench", 17.1, A, "Anthropic"),
    score("cursorbench", 70.5, A, "Anthropic"),
    score("gdpval", 1723, A, "Anthropic"),
  ],
  "claude-opus-5": [
    score("osworld-strict", 39.6, A, "Anthropic", "Partial 75.4%."),
    score("terminal-bench-4", 53.9, T, "Snorkel", "xhigh, Claude Code. Run $6.1k."),
    score("deepswe", 73.6, D, "Datacurve", undefined, levels(
      ["max", 73.6, 11.84],
      ["xhigh", 73.2, 9.07],
      ["high", 72.8, 6.08],
      ["medium", 68.9, 3.29],
      ["low", 58.1, 1.66],
    )),
    score("terminal-bench-science", 29.0, A, "Anthropic"),
    score("automation-bench", 26.9, A, "Anthropic"),
    score("cursorbench", 70.0, A, "Anthropic"),
    score("gdpval", 1824, A, "Anthropic"),
  ],
  "claude-opus-4-8": [
    score("terminal-bench-4", 23.6, T, "Snorkel", "max, Claude Code. Run $6.5k."),
    score("deepswe", 59.0, D, "Datacurve", undefined, levels(
      ["max", 59.0, 13.22],
      ["xhigh", 54.4, 8.01],
      ["high", 51.8, 4.28],
      ["medium", 48.7, 3.44],
      ["low", 40.8, 2.29],
    )),
  ],
  "claude-sonnet-5": [
    score("terminal-bench-4", 12.4, T, "Snorkel", "max, Claude Code. Run $9.6k."),
    score("deepswe", 53.8, D, "Datacurve", undefined, levels(
      ["max", 53.8, 26.4],
      ["xhigh", 49.7, 11.89],
      ["high", 48.2, 7.43],
      ["medium", 39.8, 4.08],
      ["low", 30.5, 2.19],
    )),
  ],
  "gpt-6-astra": [
    score("osworld-offline", 72.6, O, "OpenAI"),
    score("terminal-bench-4", 58.2, T, "Snorkel", "max, Codex. Run $3.3k."),
    score("deepswe", 74.1, D, "Datacurve", undefined, levels(
      ["max", 73.2, 7.5],
      ["xhigh", 74.1, 4.43],
      ["high", 73.2, 3.92],
      ["medium", 72.8, 3.08],
      ["low", 67.0, 1.6],
    )),
    score("terminal-bench-science", 64.6, O, "OpenAI", "OpenAI's run."),
    score("automation-bench", 41.4, O, "OpenAI", "OpenAI's run."),
  ],
  "gpt-5.6-sol": [
    score("osworld-offline", 65.7, O, "OpenAI"),
    score("terminal-bench-4", 37.3, T, "Snorkel", "max, Codex. Run $2.5k."),
    score("deepswe", 72.7, D, "Datacurve", undefined, levels(
      ["max", 72.7, 6.46],
      ["xhigh", 70.7, 3.6],
      ["high", 69.4, 2.66],
      ["medium", 61.1, 1.42],
      ["low", 45.4, 0.82],
    )),
    score("terminal-bench-science", 22.4, A, "Anthropic"),
    score("automation-bench", 19.6, A, "Anthropic"),
    score("cursorbench", 67.2, A, "Anthropic"),
    score("gdpval", 1711, A, "Anthropic"),
  ],
  "gpt-5.6-terra": [
    score("terminal-bench-4", 21.5, T, "Snorkel", "max, Codex. Run $1.7k."),
    score("deepswe", 69.6, D, "Datacurve", undefined, levels(
      ["max", 69.6, 3.96],
      ["xhigh", 60.2, 1.7],
      ["high", 53.8, 0.91],
      ["medium", 35.1, 0.47],
      ["low", 24.1, 0.34],
    )),
  ],
  "gpt-5.6-luna": [
    score("terminal-bench-4", 17.3, T, "Snorkel", "max, Codex. Run $0.3k."),
    score("deepswe", 67.2, D, "Datacurve", undefined, levels(
      ["max", 67.2, 0.61],
      ["xhigh", 56.9, 0.31],
      ["high", 44.2, 0.16],
      ["medium", 11.3, 0.04],
      ["low", 1.5, 0.01],
    )),
  ],
  "gemini-3.8-flash": [
    score("terminal-bench-4", 19.1, T, "Snorkel", "high, mini-SWE-agent. Run $1.8k."),
    score("deepswe", 73.8, D, "Datacurve", undefined, levels(
      ["high", 73.8, 2.36],
      ["medium", 71.0, 1.97],
    )),
  ],
  "grok-4.7": [
    score("terminal-bench-4", 37.6, T, "Snorkel", "xhigh, Grok Build. Run $3.7k."),
  ],
  "grok-4.6": [
    score("terminal-bench-4", 20.3, T, "Snorkel", "high, Grok Build. Run $3.6k."),
    score("deepswe", 67.5, D, "Datacurve", undefined, levels(
      ["xhigh", 66.7, 5.5],
      ["high", 65.2, 4.38],
      ["medium", 67.5, 3.45],
      ["low", 41.6, 1.04],
    )),
  ],
  "grok-4.5": [
    score("terminal-bench-4", 12.4, T, "Snorkel", "high, Grok Build. Run $2.1k."),
    score("deepswe", 53.8, D, "Datacurve", "high.", undefined, 2.42),
  ],
  "kimi-k2.7-code": [
    score("deepswe", 30.5, D, "Datacurve", "No effort setting.", undefined, 2.82),
  ],
  "deepseek-v4-pro": [
    score("deepswe", 62.8, D, "Datacurve", "max.", undefined, 1.67),
  ],
};
