/**
 * A faint motif behind each overview card, hinting at what the component does.
 * Drawn in currentColor at low opacity, lifting slightly on hover.
 */
const motifs: Record<string, React.ReactNode> = {
  button: (
    <>
      <rect x="14" y="26" width="46" height="18" rx="9" />
      <rect x="66" y="26" width="30" height="18" rx="9" />
    </>
  ),
  badge: (
    <>
      <rect x="14" y="28" width="34" height="14" rx="7" />
      <rect x="54" y="28" width="24" height="14" rx="7" />
    </>
  ),
  card: (
    <>
      <rect x="14" y="16" width="80" height="40" rx="6" />
      <path d="M14 30h80" />
      <path d="M24 42h34" />
    </>
  ),
  input: (
    <>
      <rect x="14" y="26" width="80" height="18" rx="6" />
      <path d="M24 30v10" />
    </>
  ),
  segmented: (
    <>
      <rect x="14" y="24" width="80" height="22" rx="8" />
      <path d="M40 24v22M67 24v22" />
    </>
  ),
  avatar: (
    <>
      <circle cx="54" cy="34" r="24" />
      <ellipse cx="45" cy="28" rx="13" ry="10" transform="rotate(-18 45 28)" />
      <ellipse cx="63" cy="40" rx="15" ry="11" transform="rotate(12 63 40)" />
    </>
  ),
  code: (
    <>
      <path d="M30 24l-12 11 12 11M78 24l12 11-12 11" />
      <path d="M60 20l-12 30" />
    </>
  ),
  tree: (
    <>
      <path d="M22 18v34h14M22 30h14M40 18h44M36 30h48M36 44h34" />
    </>
  ),
  math: (
    <>
      <path d="M32 20h32l-22 15 22 15H32" />
      <path d="M74 28h16M82 20v16" />
    </>
  ),
  markdown: (
    <>
      <path d="M16 22h56M16 32h72M16 42h40" />
      <rect x="76" y="38" width="16" height="10" rx="3" />
    </>
  ),
  citation: (
    <>
      <rect x="18" y="18" width="46" height="34" rx="5" />
      <path d="M26 28h30M26 38h20" />
      <circle cx="80" cy="26" r="8" />
    </>
  ),
  selection: (
    <>
      <path d="M16 24h44M16 34h30" />
      <rect x="46" y="30" width="46" height="18" rx="9" />
    </>
  ),
  diff: (
    <>
      <path d="M16 22h48M16 32h64M16 42h34" />
      <path d="M84 24v12M78 30h12" />
      <path d="M78 46h12" />
    </>
  ),
  message: (
    <>
      <rect x="14" y="16" width="52" height="20" rx="8" />
      <rect x="44" y="40" width="50" height="18" rx="8" />
    </>
  ),
  tool: (
    <>
      <rect x="14" y="18" width="80" height="16" rx="5" />
      <path d="M24 26l6 4-6 4" />
      <rect x="14" y="40" width="52" height="12" rx="4" />
    </>
  ),
  approval: (
    <>
      <path d="M54 14l24 8v14c0 12-10 20-24 24-14-4-24-12-24-24V22z" />
      <path d="M44 34l7 7 15-15" />
    </>
  ),
  composer: (
    <>
      <rect x="12" y="16" width="84" height="34" rx="10" />
      <path d="M22 28h44" />
      <circle cx="84" cy="40" r="6" />
    </>
  ),
  queue: (
    <>
      <path d="M16 22h60M16 34h60M16 46h38" />
      <circle cx="88" cy="22" r="3" />
      <circle cx="88" cy="34" r="3" />
    </>
  ),
  models: (
    <>
      <circle cx="30" cy="34" r="10" />
      <circle cx="54" cy="34" r="10" />
      <circle cx="78" cy="34" r="10" />
    </>
  ),
  calendar: (
    <>
      <rect x="14" y="14" width="80" height="44" rx="6" />
      <path d="M14 26h80M38 26v32M62 26v32M14 42h80" />
    </>
  ),
  gantt: (
    <>
      <rect x="16" y="18" width="40" height="8" rx="4" />
      <rect x="34" y="32" width="46" height="8" rx="4" />
      <rect x="52" y="46" width="34" height="8" rx="4" />
    </>
  ),
  board: (
    <>
      <rect x="14" y="14" width="24" height="44" rx="5" />
      <rect x="43" y="14" width="24" height="30" rx="5" />
      <rect x="72" y="14" width="24" height="38" rx="5" />
    </>
  ),
  canvas: (
    <>
      <rect x="12" y="18" width="28" height="18" rx="5" />
      <rect x="66" y="34" width="28" height="18" rx="5" />
      <path d="M40 27h13c6 0 6 16 13 16" />
      <circle cx="53" cy="18" r="3" />
    </>
  ),
};

const bySlug: Record<string, keyof typeof motifs> = {
  button: "button",
  badge: "badge",
  card: "card",
  input: "input",
  "segmented-control": "segmented",
  "random-avatar": "avatar",
  "code-block": "code",
  "json-tree": "tree",
  "math-block": "math",
  "mermaid-diagram": "canvas",
  "message-markdown": "markdown",
  reference: "citation",
  "selection-tooltip": "selection",
  "file-diff-list": "diff",
  message: "message",
  "tool-call": "tool",
  "tool-approval": "approval",
  "chat-composer": "composer",
  "composer-queue": "queue",
  "model-picker": "models",
  "event-calendar": "calendar",
  "gantt-chart": "gantt",
  kanban: "board",
  "workflow-canvas": "canvas",
};

export function CardArt({ slug }: { slug: string }) {
  const motif = motifs[bySlug[slug] ?? "card"];

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 108 72"
      className="pointer-events-none absolute -right-6 -top-4 h-28 w-44 text-foreground opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.09]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        // Fades toward the text so the motif never competes with it.
        maskImage:
          "radial-gradient(120% 120% at 85% 15%, #000 15%, transparent 72%)",
        WebkitMaskImage:
          "radial-gradient(120% 120% at 85% 15%, #000 15%, transparent 72%)",
      }}
    >
      {motif}
    </svg>
  );
}
