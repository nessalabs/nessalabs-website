import type { Bench, BenchScore } from "./types";

const ANTHROPIC = "https://www.anthropic.com/claude-fable-and-mythos-5-1";
const OPENAI = "https://openai.com/index/gpt-6-astra/";
const OSWORLD = "https://osworld-v2.xlang.ai/";
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
    reading:
      "A desktop task scores only when it finishes completely. Each cell is that model's latest run on XLANG's full set at 500 steps, and partial credit is named in the note.",
    unit: "percent",
    url: OSWORLD,
    protocol:
      "XLANG's official board, full set, 500-step budget, binary accuracy. Read on 28 September 2026 from the board dated 17 September 2026. Where a model has several thinking levels, each one is listed and the marked number is the best binary score. The board prints one or two decimals. These figures keep one. A note names the partial score and, where the row is not from the original runs, the release. v2.1, the August 2026 release and the original runs are not one task list. Not the same set as the offline row.",
  },
  {
    id: "osworld-offline",
    name: "OSWorld 2.0 offline",
    task: "Computer use",
    summary: "A desktop task without internet, with partial credit.",
    reading:
      "Desktop tasks with no internet, scored with partial credit. This is OpenAI's offline set, so it is a different task list from the strict row.",
    unit: "percent",
    url: OPENAI,
    protocol: "OpenAI's v2026.08.08 offline set, partial score.",
  },
  {
    id: "terminal-bench-4",
    name: "Terminal-Bench 4.0",
    task: "Terminal agent",
    summary: "Terminal tasks covering software, configuration and data analysis.",
    reading:
      "Terminal tasks in software, configuration and data analysis. Each point is one model, and the dollar amount is the cost of the full 66-task run.",
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
    reading:
      "Long coding tasks in real repositories. A line joins one model's thinking levels, and each point is that level's mean cost per task.",
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
    reading: "Agentic coding tasks run in Cursor. The bar is the score published for that model.",
    unit: "percent",
    url: ANTHROPIC,
    protocol: "Anthropic's comparison.",
  },
  {
    id: "terminal-bench-science",
    name: "Terminal-Bench Science 0.1",
    task: "Research agent",
    summary: "Scientific workflows that analyse data, run simulations and fit models.",
    reading:
      "Scientific workflows that analyse data, run simulations and fit models. A note names a score from another lab's run.",
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
    reading: "Multi-step business workflows. A note names a score from another lab's run.",
    unit: "percent",
    url: ANTHROPIC,
    protocol: "Anthropic's comparison, unless the cell names another run.",
  },
  {
    id: "gdpval",
    name: "GDPval-AA v2",
    task: "Knowledge work",
    summary: "Professional knowledge-work tasks, scored as Elo.",
    reading:
      "Professional knowledge-work tasks, scored as Elo. A longer bar is a higher score, and the axis runs from the lowest score here to the highest.",
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
  runUsd?: number,
): BenchScore {
  return {
    bench,
    value,
    source,
    reportedBy,
    ...(note ? { note } : {}),
    ...(levels ? { levels } : {}),
    ...(usd !== undefined ? { usd } : {}),
    ...(runUsd !== undefined ? { runUsd } : {}),
  };
}

function terminal(value: number, note: string, runUsd: number) {
  return score("terminal-bench-4", value, T, "Snorkel", note, undefined, undefined, runUsd);
}

function levels(...rows: [string, number, number][]): NonNullable<BenchScore["levels"]> {
  return rows.map(([effort, value, usd]) => ({ effort, value, usd }));
}

const A = ANTHROPIC;
const O = OPENAI;
const W = OSWORLD;
const T = TERMINAL;
const D = DEEPSWE;

/** Keyed by model id. Models with no entry have no published score in this catalog. */
export const benchScores: Record<string, BenchScore[]> = {
  "claude-fable-5-1": [
    terminal(57.9, "max, Claude Code. Run $6.2k.", 6200),
    score("terminal-bench-science", 52.6, A, "Anthropic"),
    score("automation-bench", 31.4, A, "Anthropic"),
    score("cursorbench", 73.4, A, "Anthropic"),
    score("gdpval", 1853, A, "Anthropic"),
  ],
  "claude-fable-5": [
    terminal(44.5, "max, Claude Code. Run $7.3k.", 7300),
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
    score("osworld-strict", 44.3, W, "XLANG", "v2.1. Partial 77.7%.", [
      { effort: "max", value: 44.3 },
      { effort: "xhigh", value: 33.3 },
      { effort: "high", value: 36.9 },
      { effort: "medium", value: 33.0 },
      { effort: "low", value: 18.8 },
    ]),
    terminal(53.9, "xhigh, Claude Code. Run $6.1k.", 6100),
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
    score("osworld-strict", 20.6, W, "XLANG", "Partial 54.8%. Batched tools.", [
      { effort: "max", value: 20.6 },
    ]),
    terminal(23.6, "max, Claude Code. Run $6.5k.", 6500),
    score("deepswe", 59.0, D, "Datacurve", undefined, levels(
      ["max", 59.0, 13.22],
      ["xhigh", 54.4, 8.01],
      ["high", 51.8, 4.28],
      ["medium", 48.7, 3.44],
      ["low", 40.8, 2.29],
    )),
  ],
  "claude-opus-4-7": [
    score("osworld-strict", 18.2, W, "XLANG", "Partial 48.9%. Batched tools.", [
      { effort: "max", value: 18.2 },
    ]),
  ],
  "claude-sonnet-4-6": [
    score("osworld-strict", 9.3, W, "XLANG", "Partial 33.9% at medium.", [
      { effort: "max", value: 8.3 },
      { effort: "medium", value: 9.3 },
    ]),
  ],
  "claude-sonnet-5": [
    terminal(12.4, "max, Claude Code. Run $9.6k.", 9600),
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
    terminal(58.2, "max, Codex. Run $3.3k.", 3300),
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
    score("osworld-strict", 27.3, W, "XLANG", "v2026.08.08. Partial 62.7%.", [
      { effort: "max", value: 27.3 },
    ]),
    score("osworld-offline", 65.7, O, "OpenAI"),
    terminal(37.3, "max, Codex. Run $2.5k.", 2500),
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
    terminal(21.5, "max, Codex. Run $1.7k.", 1700),
    score("deepswe", 69.6, D, "Datacurve", undefined, levels(
      ["max", 69.6, 3.96],
      ["xhigh", 60.2, 1.7],
      ["high", 53.8, 0.91],
      ["medium", 35.1, 0.47],
      ["low", 24.1, 0.34],
    )),
  ],
  "gpt-5.6-luna": [
    terminal(17.3, "max, Codex. Run $0.3k.", 300),
    score("deepswe", 67.2, D, "Datacurve", undefined, levels(
      ["max", 67.2, 0.61],
      ["xhigh", 56.9, 0.31],
      ["high", 44.2, 0.16],
      ["medium", 11.3, 0.04],
      ["low", 1.5, 0.01],
    )),
  ],
  "gemini-3.8-flash": [
    terminal(19.1, "high, mini-SWE-agent. Run $1.8k.", 1800),
    score("deepswe", 73.8, D, "Datacurve", undefined, levels(
      ["high", 73.8, 2.36],
      ["medium", 71.0, 1.97],
    )),
  ],
  "grok-4.7": [
    terminal(37.6, "xhigh, Grok Build. Run $3.7k.", 3700),
  ],
  "grok-4.6": [
    terminal(20.3, "high, Grok Build. Run $3.6k.", 3600),
    score("deepswe", 67.5, D, "Datacurve", undefined, levels(
      ["xhigh", 66.7, 5.5],
      ["high", 65.2, 4.38],
      ["medium", 67.5, 3.45],
      ["low", 41.6, 1.04],
    )),
  ],
  "grok-4.5": [
    terminal(12.4, "high, Grok Build. Run $2.1k.", 2100),
    score("deepswe", 53.8, D, "Datacurve", "high.", undefined, 2.42),
  ],
  "gpt-5.5": [
    score("osworld-strict", 13.0, W, "XLANG", "Partial 49.5%.", [
      { effort: "xhigh", value: 13.0 },
    ]),
  ],
  "kimi-k2.6": [
    score("osworld-strict", 4.6, W, "XLANG", "Partial 22.1%.", [
      { effort: "enabled", value: 4.6 },
    ]),
  ],
  "qwen3.7-plus": [
    score("osworld-strict", 2.8, W, "XLANG", "Partial 21.5%.", [
      { effort: "thinking", value: 2.8 },
    ]),
  ],
  "minimax-m3": [
    score("osworld-strict", 4.6, W, "XLANG", "Partial 22.3%.", [
      { effort: "enabled", value: 4.6 },
    ]),
  ],
  "kimi-k2.7-code": [
    score("deepswe", 30.5, D, "Datacurve", "No effort setting.", undefined, 2.82),
  ],
  "deepseek-v4-pro": [
    score("deepswe", 62.8, D, "Datacurve", "max.", undefined, 1.67),
  ],
};
