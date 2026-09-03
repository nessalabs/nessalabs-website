/**
 * A faint motif behind each overview card, hinting at what the component does.
 * Drawn in currentColor at low opacity, lifting slightly on hover.
 */
const motifs: Record<string, React.ReactNode> = {
  search: (
    <>
      <rect x="14" y="14" width="80" height="16" rx="8" />
      <circle cx="26" cy="22" r="4" />
      <path d="M14 40h80M14 50h58M14 60h68" />
    </>
  ),
  sections: (
    <>
      <path d="M14 16h30" />
      <path d="M14 26h80M14 34h62" />
      <path d="M14 46h34" />
      <path d="M14 56h80M14 64h50" />
    </>
  ),
  rail: (
    <>
      <rect x="14" y="12" width="30" height="48" rx="6" />
      <path d="M20 22h18M20 30h18M20 38h12" />
      <rect x="52" y="12" width="42" height="48" rx="6" />
    </>
  ),
  shell: (
    <>
      <rect x="14" y="12" width="80" height="48" rx="6" />
      <path d="M14 22h80" />
      <path d="M38 22v38" />
      <path d="M38 46h56" />
    </>
  ),
  questions: (
    <>
      <circle cx="22" cy="20" r="6" />
      <path d="M36 20h58" />
      <circle cx="22" cy="38" r="6" />
      <path d="M36 38h44" />
      <rect x="16" y="52" width="78" height="12" rx="6" />
    </>
  ),
  smoke: (
    <>
      <rect x="14" y="14" width="80" height="44" rx="10" />
      <ellipse cx="38" cy="34" rx="16" ry="10" />
      <ellipse cx="64" cy="40" rx="20" ry="12" />
    </>
  ),
  chips: (
    <>
      <rect x="14" y="20" width="80" height="34" rx="12" />
      <path d="M22 30h12" />
      <rect x="38" y="25" width="26" height="10" rx="5" />
      <path d="M22 44h34" />
    </>
  ),
  shield: (
    <>
      <path d="M54 12l26 8v18c0 14-12 22-26 26-14-4-26-12-26-26V20z" />
      <path d="M44 36l8 8 16-16" />
    </>
  ),
  dial: (
    <>
      <path d="M14 34h80" />
      <circle cx="44" cy="34" r="8" />
      <path d="M24 48h60" />
      <circle cx="66" cy="48" r="6" />
    </>
  ),
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
  checkbox: (
    <>
      <rect x="20" y="20" width="26" height="26" rx="6" />
      <path d="M27 33l5 5 9-11" />
      <path d="M56 26h38M56 40h24" />
    </>
  ),
  menu: (
    <>
      <rect x="22" y="14" width="52" height="44" rx="7" />
      <path d="M32 26h32M32 36h32M32 46h20" />
      <path d="M78 34l8 6-8 6" />
    </>
  ),
  pages: (
    <>
      <rect x="12" y="26" width="18" height="18" rx="6" />
      <rect x="34" y="26" width="18" height="18" rx="6" />
      <rect x="78" y="26" width="18" height="18" rx="6" />
      <path d="M60 35h1M68 35h1" />
    </>
  ),
  ruler: (
    <>
      <path d="M12 22h84" />
      <path d="M12 22v10M33 22v6M54 22v10M75 22v6M96 22v10" />
      <path d="M12 46h30M54 46h20" />
    </>
  ),
  grid: (
    <>
      <rect x="12" y="14" width="84" height="44" rx="6" />
      <path d="M12 26h84M12 40h84M40 14v44M68 14v44" />
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
  tabs: (
    <>
      <path d="M12 30h22a6 6 0 006-6v-6a6 6 0 016-6h14a6 6 0 016 6v6a6 6 0 006 6h22" />
      <path d="M12 44h84" />
    </>
  ),
  checklist: (
    <>
      <circle cx="22" cy="20" r="6" />
      <circle cx="22" cy="36" r="6" />
      <circle cx="22" cy="52" r="6" />
      <path d="M19 20l2 2 4-5" />
      <path d="M38 20h52M38 36h40M38 52h30" />
    </>
  ),
  panel: (
    <>
      <rect x="12" y="14" width="84" height="44" rx="6" />
      <path d="M64 14v44" />
      <path d="M72 26h16M72 34h12" />
    </>
  ),
  sheet: (
    <>
      <rect x="18" y="14" width="72" height="44" rx="8" />
      <path d="M18 32h72" />
      <path d="M46 24h16" />
    </>
  ),
  wash: (
    <>
      <rect x="12" y="14" width="84" height="44" rx="8" />
      <path d="M18 44c14-10 26 4 40-4s20-14 32-8" />
      <path d="M18 52c14-10 26 4 40-4s20-14 32-8" />
    </>
  ),
  outline: (
    <>
      <path d="M22 14v14h10v14h-10v14" />
      <path d="M40 14h44M46 28h38M40 42h34M46 56h30" />
    </>
  ),
  file: (
    <>
      <path d="M30 12h30l16 16v32H30z" />
      <path d="M60 12v16h16" />
      <path d="M38 40h30M38 48h20" />
    </>
  ),
  drop: (
    <>
      <rect x="16" y="14" width="76" height="44" rx="8" strokeDasharray="6 5" />
      <path d="M54 24v18M46 34l8 8 8-8" />
    </>
  ),
  pie: (
    <>
      <circle cx="54" cy="36" r="24" />
      <path d="M54 12v24l20 12" />
    </>
  ),
  radar: (
    <>
      <path d="M54 12l24 18-9 28H39l-9-28z" />
      <path d="M54 22l14 11-5 17H45l-5-17z" />
      <path d="M54 12v46M30 30h48" />
    </>
  ),
  flow: (
    <>
      <rect x="14" y="16" width="8" height="40" rx="3" />
      <rect x="86" y="14" width="8" height="20" rx="3" />
      <rect x="86" y="40" width="8" height="18" rx="3" />
      <path d="M22 26c26 0 38-4 64-4M22 46c26 0 38 4 64 4" />
    </>
  ),
  price: (
    <>
      <path d="M12 48l16-12 12 8 14-20 16 14 14-18 12 10" />
      <path d="M12 58h84" />
    </>
  ),
  quote: (
    <>
      <rect x="12" y="14" width="84" height="44" rx="6" />
      <path d="M20 26h22M20 34h14" />
      <path d="M52 44l10-8 8 6 10-14 8 8" />
    </>
  ),
  activity: (
    <>
      <circle cx="24" cy="24" r="8" />
      <path d="M40 24h54" />
      <rect x="14" y="40" width="80" height="18" rx="8" />
    </>
  ),
  roster: (
    <>
      <rect x="12" y="14" width="84" height="14" rx="7" />
      <circle cx="24" cy="42" r="7" />
      <circle cx="24" cy="58" r="7" />
      <path d="M38 40h56M38 46h34M38 56h56M38 62h30" />
    </>
  ),
  divider: (
    <>
      <path d="M12 36h30M66 36h30" />
      <rect x="44" y="30" width="20" height="12" rx="6" />
      <path d="M20 18h40M48 54h40" />
    </>
  ),
  pill: (
    <>
      <rect x="12" y="22" width="84" height="26" rx="13" />
      <circle cx="26" cy="35" r="4" />
      <path d="M38 35h32" />
      <circle cx="82" cy="35" r="6" />
    </>
  ),
  bubbles: (
    <>
      <rect x="12" y="14" width="46" height="18" rx="9" />
      <rect x="46" y="38" width="48" height="18" rx="9" />
      <circle cx="60" cy="14" r="6" />
    </>
  ),
  tray: (
    <>
      <rect x="12" y="18" width="34" height="16" rx="8" />
      <rect x="52" y="18" width="20" height="16" rx="8" />
      <path d="M80 26h14" />
      <rect x="12" y="42" width="84" height="16" rx="8" />
    </>
  ),
  overlay: (
    <>
      <rect x="12" y="14" width="84" height="44" rx="8" />
      <rect x="24" y="22" width="60" height="24" rx="6" />
      <path d="M46 52h16" />
    </>
  ),
  annotation: (
    <>
      <path d="M16 18v18" />
      <rect x="24" y="14" width="48" height="16" rx="8" />
      <rect x="44" y="38" width="50" height="16" rx="8" />
    </>
  ),
  deck: (
    <>
      <rect x="8" y="20" width="28" height="36" rx="6" />
      <rect x="32" y="12" width="44" height="48" rx="6" />
      <rect x="72" y="20" width="28" height="36" rx="6" />
    </>
  ),
};

const bySlug: Record<string, keyof typeof motifs> = {
  button: "button",
  badge: "badge",
  card: "card",
  input: "input",
  "segmented-control": "segmented",
  checkbox: "checkbox",
  "dropdown-menu": "menu",
  pagination: "pages",
  "timeline-header": "ruler",
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
  table: "grid",
  "workflow-canvas": "canvas",
  tabs: "tabs",
  "task-list": "checklist",
  drawer: "panel",
  sheet: "sheet",
  "gradient-surface": "wash",
  "page-outline": "outline",
  "file-preview": "file",
  "file-drop-zone": "drop",
  "pie-chart": "pie",
  "radar-chart": "radar",
  "flow-chart": "flow",
  "price-chart": "price",
  "stock-quote": "quote",
  "agent-activity": "activity",
  "agent-details": "panel",
  "conversation-history": "roster",
  "transcript-divider": "divider",
  "pill-composer": "pill",
  "chat-bubbles": "bubbles",
  "chat-tabs": "tabs",
  "chat-tray": "tray",
  "chat-overlay": "overlay",
  "chat-annotations": "annotation",
  "context-menu": "menu",
  "popover-surface": "panel",
  "searchable-listbox": "search",
  "sectioned-listbox": "sections",
  sidebar: "rail",
  "app-shell": "shell",
  "window-deck": "deck",
  questionnaire: "questions",
  "generating-surface": "smoke",
  "chat-composer-editor": "chips",
  "composer-access-mode": "shield",
  "model-capability-controls": "dial",
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
