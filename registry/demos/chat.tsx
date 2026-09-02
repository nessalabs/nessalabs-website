"use client";

import * as React from "react";
import { Mic, Plus } from "lucide-react";
import {
  ChatAnnotationBadge,
  ChatAnnotationList,
  ChatAnnotationThread,
  ChatBubble,
  ChatComposerAction,
  ChatComposerInput,
  ChatComposerSubmit,
  ChatMessage,
  ChatMessageQuote,
  ChatMessageReceipt,
  ChatOverlay,
  ChatOverlayBack,
  ChatOverlayBody,
  ChatOverlaySummary,
  ChatTabs,
  ChatTray,
  ChatTypingIndicator,
  PillComposer,
  PillComposerRow,
  type ChatAnnotation,
  type ChatTabItem,
  type ChatTrayItem,
} from "@nessa-ui/react";

/** The rounded window every chat-surface preview sits in. */
function ChatFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        className ??
        "flex h-96 w-full max-w-sm flex-col gap-2 rounded-[1.75rem] border border-border bg-background p-3"
      }
    >
      {children}
    </div>
  );
}

export function ChatBubblesDemo() {
  return (
    <ChatFrame className="flex w-full max-w-sm flex-col gap-2 rounded-[1.75rem] border border-border bg-background p-4">
      <ChatMessage tone="sent" animateIn={false}>
        <ChatBubble>Ship the release notes</ChatBubble>
      </ChatMessage>
      <ChatMessage tone="received" animateIn={false}>
        <ChatBubble>On it — I&apos;ll take a look and report back.</ChatBubble>
      </ChatMessage>
      <ChatMessage tone="sent" animateIn={false}>
        <ChatMessageQuote>
          On it — I&apos;ll take a look and report back.
        </ChatMessageQuote>
        <ChatBubble reaction="👍">thanks</ChatBubble>
        <ChatMessageReceipt>Delivered</ChatMessageReceipt>
      </ChatMessage>
    </ChatFrame>
  );
}

export function ChatBubblesTypingDemo() {
  return (
    <ChatFrame className="flex w-full max-w-sm flex-col gap-2 rounded-[1.75rem] border border-border bg-background p-4">
      <ChatMessage tone="sent" animateIn={false}>
        <ChatBubble>Summarise the audit in one line.</ChatBubble>
      </ChatMessage>
      <ChatMessage tone="received" animateIn={false}>
        <ChatTypingIndicator />
      </ChatMessage>
    </ChatFrame>
  );
}

export function ChatTabsDemo() {
  const [tabs, setTabs] = React.useState<ChatTabItem[]>([
    { id: "release", title: "Release notes", loading: true },
    { id: "triage", title: "Bug triage", closeable: true, badgeCount: 2 },
    { id: "scratch", title: "Scratchpad", closeable: true },
  ]);
  const [activeId, setActiveId] = React.useState("release");
  const nextTab = React.useRef(1);
  const active = tabs.find((tab) => tab.id === activeId);

  return (
    <ChatFrame className="flex h-64 w-full flex-col gap-3 rounded-[1.75rem] border border-border bg-background p-3">
      <ChatTabs
        tabs={tabs}
        value={activeId}
        onValueChange={setActiveId}
        onClose={(id) =>
          setTabs((current) => {
            const next = current.filter((tab) => tab.id !== id);
            if (id === activeId && next.length > 0) setActiveId(next[0]!.id);
            return next;
          })
        }
        onNew={() => {
          const id = `chat-${nextTab.current++}`;
          setTabs((current) => [
            ...current,
            { id, title: "New chat", closeable: true },
          ]);
          setActiveId(id);
        }}
        className="px-1"
      />
      <div
        id={`chat-tab-panel-${activeId}`}
        role="tabpanel"
        aria-labelledby={`chat-tab-${activeId}`}
        className="flex min-h-0 flex-1 items-center justify-center rounded-3xl bg-card text-sm text-muted-foreground"
      >
        {active?.title ?? "No tab"}
      </div>
    </ChatFrame>
  );
}

const trayItems: ChatTrayItem[] = [
  {
    id: "quote",
    kind: "quote",
    label: "Report the result back into the thread.",
    detail:
      "Report the result back into the thread. The report should stay short enough to read in the transcript.",
  },
  { id: "paste", kind: "pasted-text", label: "Pasted text (2,481 chars)" },
  { id: "diff", kind: "file", label: "transcript-virtualization.diff" },
  { id: "review", kind: "skill", label: "Code Review" },
];

function TrayExample({ collapseAfter }: { collapseAfter?: number }) {
  const [pending, setPending] = React.useState(trayItems);
  const [opened, setOpened] = React.useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2 rounded-3xl border border-border bg-background p-3">
      <ChatTray
        items={pending}
        collapseAfter={collapseAfter}
        onOpenItem={(item) => setOpened(item.label)}
        onOpenAll={() => setOpened(`All ${pending.length}`)}
        onClear={() => setPending([])}
      />
      <div className="w-full rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
        Ask me anything
      </div>
      <p className="m-0 text-xs text-muted-foreground">
        {opened ? `Opened: ${opened}` : "Nothing opened yet"}
      </p>
    </div>
  );
}

export function ChatTrayDemo() {
  return <TrayExample />;
}

export function ChatTrayCollapseDemo() {
  return <TrayExample collapseAfter={3} />;
}

const overlayTranscript = [
  { tone: "sent", text: "Where do we compose the chat composer today?" },
  { tone: "received", text: "Nine call sites. Full table in the report." },
] as const;

export function ChatOverlayDemo() {
  const [tab, setTab] = React.useState("audit");
  const [open, setOpen] = React.useState(false);

  return (
    <ChatFrame>
      <ChatTabs
        className="px-1"
        tabs={[
          { id: "audit", title: "Repo audit" },
          { id: "notes", title: "Release notes" },
        ]}
        value={tab}
        onValueChange={setTab}
      />
      {/* The positioned ancestor: the overlay fills exactly this box, so the
          tab strip above and the composer below stay in use. */}
      <div
        id={`chat-tab-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`chat-tab-${tab}`}
        className="relative flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-1"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-y-auto">
          {overlayTranscript.map((entry) => (
            <ChatMessage key={entry.text} tone={entry.tone} animateIn={false}>
              <ChatBubble>{entry.text}</ChatBubble>
            </ChatMessage>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="self-start rounded-full px-1 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Open the skill
        </button>
        {open ? (
          <ChatOverlay label="Skill Creator" onClose={() => setOpen(false)}>
            <ChatOverlayBody className="px-1">
              <p className="m-0 text-sm leading-6">
                Draft a reusable skill from this conversation. Invoke it with
                /skill-creator from any chat, and it gathers the context it
                needs before writing anything.
              </p>
            </ChatOverlayBody>
            <ChatOverlaySummary>Added 12 minutes ago</ChatOverlaySummary>
            <ChatOverlayBack />
          </ChatOverlay>
        ) : null}
      </div>
      <div className="shrink-0 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
        Ask me anything
      </div>
    </ChatFrame>
  );
}

const seededAnnotations: ChatAnnotation[] = [
  {
    id: "gather",
    text: "Gather the relevant context from the current chat.",
    comments: ["This should spell out how much history counts as relevant."],
    sourceLabel: "SKILL.md",
  },
  {
    id: "checklist",
    text: "Apply the checklist this skill carries.",
    sourceLabel: "SKILL.md",
  },
  {
    id: "report",
    text: "Report the result back into the thread, short enough to read in the transcript.",
    comments: ["Split the summary rule and the linking rule."],
    sourceLabel: "SKILL.md",
  },
];

export function ChatAnnotationsDemo() {
  const [annotations, setAnnotations] = React.useState(seededAnnotations);
  const [selected, setSelected] = React.useState<string | null>(null);

  return (
    <div className="flex w-full max-w-md flex-col gap-2 rounded-3xl border border-border bg-background p-3">
      <ChatAnnotationList>
        {annotations.map((annotation) => (
          <ChatAnnotationThread
            key={annotation.id}
            annotation={annotation}
            selected={selected === annotation.id}
            onSelect={() =>
              setSelected((current) =>
                current === annotation.id ? null : annotation.id
              )
            }
            onRemove={() =>
              setAnnotations((current) =>
                current.filter((entry) => entry.id !== annotation.id)
              )
            }
          />
        ))}
      </ChatAnnotationList>
    </div>
  );
}

export function ChatAnnotationsSentDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 rounded-3xl border border-border bg-background p-4">
      <ChatMessage tone="sent" animateIn={false}>
        <ChatAnnotationBadge count={seededAnnotations.length} />
        <ChatBubble>Take another pass at these three steps.</ChatBubble>
      </ChatMessage>
    </div>
  );
}

export function PillComposerDemo() {
  const [generating, setGenerating] = React.useState(false);
  const [sent, setSent] = React.useState("");
  const [message, setMessage] = React.useState("");

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {sent ? (
        <p role="status" className="text-sm text-muted-foreground">
          Sent: {sent}
        </p>
      ) : null}
      <PillComposer
        generating={generating}
        onSubmit={(event) => {
          event.preventDefault();
          if (!message.trim()) return;
          setSent(message.trim());
          setMessage("");
          setGenerating(true);
          window.setTimeout(() => setGenerating(false), 4000);
        }}
      >
        <PillComposerRow>
          <ChatComposerAction aria-label="Add attachment" title="Add attachment">
            <Plus aria-hidden="true" />
          </ChatComposerAction>
          <ChatComposerInput
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask me anything"
          />
          <ChatComposerAction aria-label="Start voice input" title="Start voice input">
            <Mic aria-hidden="true" />
          </ChatComposerAction>
          <ChatComposerSubmit aria-label="Send message" disabled={!message.trim()} />
        </PillComposerRow>
      </PillComposer>
    </div>
  );
}
