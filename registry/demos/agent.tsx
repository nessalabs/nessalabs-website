"use client";

import * as React from "react";
import { ThinkingIcon } from "../story-support/icons/nucleo";
import {
  AtSign,
  Bookmark,
  Copy,
  FileCode,
  FileSearch,
  Flag,
  HelpCircle,
  Languages,
  ListTree,
  MessageSquare,
  MessageSquarePlus,
  Mic,
  Plus,
  Shield,
  Quote,
  Search,
  Share2,
  Sparkles,
  RotateCcw,
  Terminal,
  TextQuote,
  Wand2,
} from "lucide-react";
import {
  ChatComposer,
  ChatComposerAction,
  ChatComposerActions,
  ChatComposerAttachment,
  ChatComposerAttachments,
  ChatComposerEditor,
  ChatComposerTrigger,
  ConversationRail,
  ConversationRailItem,
  ConversationRailMarker,
  ConversationRailPreview,
  ConversationRailTrigger,
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerViewport,
  ChatComposerFooter,
  ChatComposerInput,
  ChatComposerSubmit,
  ComposerQueue,
  ComposerQueueItem,
  Message,
  MessageAvatar,
  MessageBubble,
  MessageContent,
  MessageFooter,
  MessageHeader,
  MessageMarkdown,
  MessageStreamText,
  MermaidDiagram,
  ModelPicker,
  ModelThinkingControl,
  Reference,
  ReferenceCard,
  ReferenceContent,
  ReferenceTrigger,
  ToolApproval,
  ToolApprovalAction,
  ToolApprovalActionMenu,
  ToolApprovalActionMenuItem,
  ToolApprovalActions,
  ToolApprovalCommand,
  ToolApprovalDescription,
  ToolApprovalHeader,
  ToolApprovalHeading,
  ToolApprovalIcon,
  ToolApprovalTitle,
  Button,
  ToolCall,
  ToolCallContent,
  ToolCallFile,
  ToolCallTabs,
  ToolCallTrigger,
  SelectionTooltip,
  SelectionTooltipAction,
  SelectionTooltipLabel,
  SelectionTooltipMore,
  SelectionTooltipSeparator,
  SelectionTooltipShelf,
  type ChatComposerEditorHandle,
  type ModelPickerGroup,
  type ModelPickerValue,
} from "@nessa-ui/react";
import { KimiModelIcon } from "../story-support/icons/model/kimi-model-icon";

const readInput = `{
  "file_path": "packages/react/src/lib/utils.ts",
  "limit": 40
}`;

const readOutput = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`;

export function ToolCallDemo() {
  return (
    <div className="w-full max-w-2xl">
      <ToolCall>
        <ToolCallTrigger
          icon={<FileSearch />}
          meta="packages/react/src/lib/utils.ts"
        >
          Read
        </ToolCallTrigger>
        <ToolCallContent>
          <ToolCallTabs input={readInput} output={readOutput} />
        </ToolCallContent>
      </ToolCall>
    </div>
  );
}

export function ToolCallStatesDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-1">
      <ToolCall status="running">
        <ToolCallTrigger icon={<FileSearch />} meta="useMessageStreamText">
          Searching the codebase
        </ToolCallTrigger>
        <ToolCallContent>
          <ToolCallTabs input={`{ "pattern": "useMessageStreamText" }`} />
        </ToolCallContent>
      </ToolCall>
      <ToolCall>
        <ToolCallTrigger icon={<Terminal />} meta="pnpm validate">
          Ran validation
        </ToolCallTrigger>
        <ToolCallContent>
          <ToolCallFile name="packages/react/src/lib/utils.ts" />
        </ToolCallContent>
      </ToolCall>
      <ToolCall status="error">
        <ToolCallTrigger icon={<Terminal />} meta="EACCES">
          Write blocked
        </ToolCallTrigger>
      </ToolCall>
    </div>
  );
}

export function ToolApprovalDemo() {
  const [resolution, setResolution] = React.useState<
    "allowed" | "denied" | null
  >(null);

  return (
    <div className="w-full max-w-2xl">
      <ToolApproval resolution={resolution}>
        <ToolApprovalHeader>
          <ToolApprovalIcon>
            <Terminal aria-hidden="true" />
          </ToolApprovalIcon>
          <ToolApprovalHeading>
            <ToolApprovalTitle>Run a shell command</ToolApprovalTitle>
            <ToolApprovalDescription>
              The agent wants to run the eval harness against run 4192.
            </ToolApprovalDescription>
          </ToolApprovalHeading>
        </ToolApprovalHeader>
        <ToolApprovalCommand>
          npx nessa eval --suite retrieval --run 4192
        </ToolApprovalCommand>
        <ToolApprovalActions>
          <ToolApprovalAction onClick={() => setResolution("denied")}>
            Deny
          </ToolApprovalAction>
          <ToolApprovalAction
            variant="default"
            onClick={() => setResolution("allowed")}
          >
            Allow once
          </ToolApprovalAction>
        </ToolApprovalActions>
      </ToolApproval>
    </div>
  );
}

/** Provider marks, served from public/model-icons. */
function ModelAsset({ name, invert = false }: { name: string; invert?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/model-icons/${name}.svg`}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={invert ? "size-4 dark:invert" : "size-4"}
    />
  );
}

const modelGroups: ModelPickerGroup[] = [
  {
    id: "anthropic",
    label: "Anthropic",
    shortLabel: "Claude",
    icon: <ModelAsset name="claude-color" />,
    models: [
      {
        id: "opus",
        label: "Opus 5",
        description: "Deep reasoning and long tasks",
        icon: <ModelAsset name="claude-color" />,
      },
      {
        id: "sonnet",
        label: "Sonnet 5",
        description: "Balanced everyday work",
        icon: <ModelAsset name="claude-color" />,
      },
    ],
  },
  {
    id: "openai",
    label: "OpenAI",
    shortLabel: "GPT",
    icon: <ModelAsset name="openai" invert />,
    models: [
      {
        id: "gpt-5.6-sol",
        label: "GPT-5.6 Sol",
        description: "Planning and code review",
        icon: <ModelAsset name="openai" invert />,
      },
      {
        id: "codex",
        label: "Codex",
        description: "Agentic implementation",
        icon: <ModelAsset name="openai" invert />,
      },
    ],
  },
  {
    id: "moonshot",
    label: "Moonshot AI",
    shortLabel: "Kimi",
    icon: <KimiModelIcon />,
    models: [
      {
        id: "kimi-k3",
        label: "Kimi K3",
        description: "Connected reasoning",
        icon: <KimiModelIcon />,
      },
    ],
  },
];

export function ChatComposerDemo() {
  const [message, setMessage] = React.useState("");
  const [submitted, setSubmitted] = React.useState("");
  const [model, setModel] = React.useState<ModelPickerValue>({
    providerId: "anthropic",
    modelId: "opus",
  });

  return (
    <div className="grid w-full min-w-0 gap-3">
      {submitted ? (
        <p role="status" className="text-sm text-muted-foreground">
          Sent: {submitted}
        </p>
      ) : null}
      <ChatComposer
        onSubmit={(event) => {
          event.preventDefault();
          if (!message.trim()) return;
          setSubmitted(message.trim());
          setMessage("");
        }}
      >
        <ChatComposerInput
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Do anything"
        />
        <ChatComposerFooter>
          <ChatComposerActions>
            <ChatComposerAction aria-label="Add attachment" title="Add attachment">
              <Plus aria-hidden="true" />
            </ChatComposerAction>
            <ChatComposerAction aria-label="Configure access" title="Configure access">
              <Shield aria-hidden="true" />
            </ChatComposerAction>
          </ChatComposerActions>
          <ChatComposerActions className="justify-end">
            <ModelPicker
              groups={modelGroups}
              value={model}
              onValueChange={setModel}
            />
            <ChatComposerAction aria-label="Start voice input" title="Start voice input">
              <Mic aria-hidden="true" />
            </ChatComposerAction>
            <ChatComposerSubmit disabled={!message.trim()} />
          </ChatComposerActions>
        </ChatComposerFooter>
      </ChatComposer>
    </div>
  );
}

/**
 * A turn is running, so what you type queues instead of sending. Each pending
 * message can be steered, opened through its "…" menu, or dropped — press Send
 * below to add another and watch it land at the end of the queue.
 */
export function ComposerQueueDemo() {
  const [items, setItems] = React.useState([
    { id: "q1", text: "Also compare against checkpoint 4188" },
    { id: "q2", text: "Then open a PR with the fix" },
  ]);
  const [message, setMessage] = React.useState("");
  const [note, setNote] = React.useState("");

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <ComposerQueue
        itemIds={items.map((item) => item.id)}
        onReorder={(ids) =>
          setItems((current) =>
            ids.map((id) => current.find((item) => item.id === id)!)
          )
        }
      >
        {items.map((item) => (
          <ComposerQueueItem
            key={item.id}
            id={item.id}
            itemLabel={item.text}
            onSteer={() => setNote(`Steering: ${item.text}`)}
            onMore={() => setNote(`More actions for: ${item.text}`)}
            onRemove={() => {
              setItems((current) => current.filter((q) => q.id !== item.id));
              setNote(`Removed: ${item.text}`);
            }}
          >
            {item.text}
          </ComposerQueueItem>
        ))}
      </ComposerQueue>

      <ChatComposer
        onSubmit={(event) => {
          event.preventDefault();
          const text = message.trim();
          if (!text) return;
          setItems((current) => [
            ...current,
            { id: `q${current.length + 1}-${text.length}`, text },
          ]);
          setMessage("");
          setNote(`Queued: ${text}`);
        }}
      >
        <ChatComposerInput
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Queue a follow-up…"
        />
        <ChatComposerFooter>
          <ChatComposerActions>
            <ChatComposerAction aria-label="Add attachment" title="Add attachment">
              <Plus aria-hidden="true" />
            </ChatComposerAction>
          </ChatComposerActions>
          <ChatComposerActions className="justify-end">
            <ChatComposerSubmit disabled={!message.trim()} />
          </ChatComposerActions>
        </ChatComposerFooter>
      </ChatComposer>

      {note ? (
        <p role="status" className="text-sm text-muted-foreground">
          {note}
        </p>
      ) : null}
    </div>
  );
}

const streamedReply = `The retrieval regression traces back to last night's index rebuild.

At 02:14 the index was rebuilt against checkpoint 4188 while the query encoder had already moved to 4189. The two halves of the pair no longer agree, so nearest-neighbour lookups drift on long-tail queries where the margin between candidates is small.

Three cases fail as a result: 4189, 4191 and 4193. The first two return the right document at rank 4 or 5 instead of rank 1; the third times out because the reranker keeps widening its window looking for a match that is not there.

The fix is to pin the encoder to the checkpoint that wrote the index, then re-run the suite. I can rebuild the index against 4189 instead, which costs about nine minutes.`;

/** A long reply arriving as a stream. Replay to watch the reveal pace itself. */
export function MessageStreamDemo() {
  const [received, setReceived] = React.useState("");
  const [run, setRun] = React.useState(0);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReceived(streamedReply);
      return;
    }
    let i = 0;
    setReceived("");
    // Chunky, uneven arrivals, the way a real stream lands.
    const id = window.setInterval(() => {
      i += 12 + ((i * 7) % 23);
      setReceived(streamedReply.slice(0, i));
      if (i >= streamedReply.length) window.clearInterval(id);
    }, 90);
    return () => window.clearInterval(id);
  }, [run]);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Message from="assistant">
        <MessageAvatar fallback="N" alt="Nessa" />
        <MessageContent>
          <MessageHeader>Nessa</MessageHeader>
          <MessageBubble>
            <MessageStreamText text={received} />
          </MessageBubble>
        </MessageContent>
      </Message>
      <div>
        <Button variant="outline" size="sm" onClick={() => setRun((n) => n + 1)}>
          <RotateCcw aria-hidden="true" />
          Replay
        </Button>
      </div>
    </div>
  );
}

export function MessageDemo() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Message from="assistant">
        <MessageAvatar fallback="N" alt="Nessa" />
        <MessageContent>
          <MessageHeader>Nessa</MessageHeader>
          <MessageBubble>
            I pushed the sidebar refactor. Want me to walk you through the
            composition changes?
          </MessageBubble>
        </MessageContent>
      </Message>
      <Message from="user">
        <MessageContent>
          <MessageBubble variant="primary">
            Yes please — start with how the provider owns collapse state.
          </MessageBubble>
          <MessageFooter>Sent</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  );
}

/* ── SelectionTooltip ──────────────────────────────────────────────────── */

export function SelectionTooltipDemo() {
  return (
    <SelectionTooltip>
      <SelectionTooltipAction aria-label="Comment" tooltip="Comment">
        <MessageSquare aria-hidden="true" />
        <SelectionTooltipLabel>Comment</SelectionTooltipLabel>
      </SelectionTooltipAction>
      <SelectionTooltipSeparator />
      <SelectionTooltipAction aria-label="Add to chat" tooltip="Add to chat">
        <MessageSquarePlus aria-hidden="true" />
        <SelectionTooltipLabel>Add to chat</SelectionTooltipLabel>
      </SelectionTooltipAction>
      <SelectionTooltipSeparator />
      <SelectionTooltipMore />
      <SelectionTooltipShelf>
        <SelectionTooltipAction aria-label="Copy" tooltip="Copy">
          <Copy aria-hidden="true" />
        </SelectionTooltipAction>
        <SelectionTooltipAction aria-label="Quote" tooltip="Quote">
          <TextQuote aria-hidden="true" />
        </SelectionTooltipAction>
        <SelectionTooltipAction aria-label="Improve" tooltip="Improve">
          <Sparkles aria-hidden="true" />
        </SelectionTooltipAction>
        <SelectionTooltipAction aria-label="Explain" tooltip="Explain">
          <HelpCircle aria-hidden="true" />
        </SelectionTooltipAction>
      </SelectionTooltipShelf>
    </SelectionTooltip>
  );
}

const shelfActions = [
  { label: "Copy", icon: Copy },
  { label: "Quote", icon: TextQuote },
  { label: "Improve", icon: Sparkles },
  { label: "Explain", icon: HelpCircle },
  { label: "Translate", icon: Languages },
  { label: "Summarize", icon: ListTree },
  { label: "Find similar", icon: Search },
  { label: "Cite", icon: Quote },
  { label: "Rewrite", icon: Wand2 },
  { label: "Share", icon: Share2 },
  { label: "Bookmark", icon: Bookmark },
  { label: "Report", icon: Flag },
];

/**
 * Twelve shelf actions behind the chevron. Expanding keeps the pill at its
 * collapsed width: the labels hide, the shelf fills the freed space and
 * scrolls, and the chevron stays put, so collapsing again needs no cursor
 * travel.
 */
export function SelectionTooltipShelfDemo() {
  return (
    <SelectionTooltip>
      <SelectionTooltipAction aria-label="Comment" tooltip="Comment">
        <MessageSquare aria-hidden="true" />
        <SelectionTooltipLabel>Comment</SelectionTooltipLabel>
      </SelectionTooltipAction>
      <SelectionTooltipSeparator />
      <SelectionTooltipAction aria-label="Add to chat" tooltip="Add to chat">
        <MessageSquarePlus aria-hidden="true" />
        <SelectionTooltipLabel>Add to chat</SelectionTooltipLabel>
      </SelectionTooltipAction>
      <SelectionTooltipSeparator />
      <SelectionTooltipMore />
      <SelectionTooltipShelf>
        {shelfActions.map(({ label, icon: Icon }) => (
          <SelectionTooltipAction key={label} aria-label={label} tooltip={label}>
            <Icon aria-hidden="true" />
          </SelectionTooltipAction>
        ))}
      </SelectionTooltipShelf>
    </SelectionTooltip>
  );
}

/* ── ModelPicker ───────────────────────────────────────────────────────── */

export function ModelPickerDemo() {
  const [value, setValue] = React.useState<ModelPickerValue>({
    providerId: "anthropic",
    modelId: "opus",
  });

  return (
    <div className="flex min-h-72 w-full items-end justify-end rounded-2xl border border-border bg-card p-6">
      <ModelPicker groups={modelGroups} value={value} onValueChange={setValue} />
    </div>
  );
}

const richReply = `The drift is a **similarity mismatch**, not a ranking bug.

Cosine similarity between a query and a document is

$$\\text{sim}(q, d) = \\frac{q \\cdot d}{\\lVert q \\rVert \\, \\lVert d \\rVert}$$

Both vectors have to come from the same encoder for that quantity to mean anything. After the rebuild they did not, so the numerator drifted while both norms stayed stable, and the ordering moved for candidates that were already close.`;

/** Streaming markdown: prose, math, a citation and a diagram in one turn. */
export function MessageRichStreamDemo() {
  const [received, setReceived] = React.useState("");
  const [run, setRun] = React.useState(0);
  const done = received.length >= richReply.length;

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReceived(richReply);
      return;
    }
    let i = 0;
    setReceived("");
    const id = window.setInterval(() => {
      i += 9 + ((i * 5) % 17);
      setReceived(richReply.slice(0, i));
      if (i >= richReply.length) window.clearInterval(id);
    }, 80);
    return () => window.clearInterval(id);
  }, [run]);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <Message from="assistant">
        <MessageAvatar fallback="N" alt="Nessa" />
        <MessageContent>
          <MessageHeader>Nessa</MessageHeader>
          <MessageBubble>
            <MessageMarkdown>{received}</MessageMarkdown>
            {done ? (
              <>
                <p className="mt-3 text-sm">
                  Traced through the rebuild log
                  <Reference>
                    <ReferenceTrigger>1</ReferenceTrigger>
                    <ReferenceContent>
                      <ReferenceCard
                        sources={[
                          {
                            title: "run-4189.json",
                            excerpt:
                              "step 7: index.rebuild(checkpoint=4188) — step 8: encoder=4189",
                            meta: "step 7-8",
                          },
                        ]}
                      />
                    </ReferenceContent>
                  </Reference>
                  , which pins the mismatch to 02:14.
                </p>
                <MermaidDiagram
                  className="mt-3"
                  chart={`flowchart LR
  Q[Query] --> E1[Encoder 4189]
  D[(Index)] --> E2[Encoder 4188]
  E1 --> S{Compare}
  E2 --> S
  S --> R[Drifted ranking]`}
                />
              </>
            ) : null}
          </MessageBubble>
        </MessageContent>
      </Message>
      <div>
        <Button variant="outline" size="sm" onClick={() => setRun((n) => n + 1)}>
          <RotateCcw aria-hidden="true" />
          Replay
        </Button>
      </div>
    </div>
  );
}

const approvalPayload = {
  command: "npx nessa eval --suite retrieval --run 4192",
  cwd: "/srv/nessa",
  timeout_ms: 900000,
  env: { NESSA_TOKEN: "***" },
};

function ApprovalHeader() {
  return (
    <ToolApprovalHeader>
      <ToolApprovalIcon>
        <Terminal aria-hidden="true" />
      </ToolApprovalIcon>
      <ToolApprovalHeading>
        <ToolApprovalTitle>Run a shell command</ToolApprovalTitle>
        <ToolApprovalDescription>
          The agent wants to run the eval harness against run 4192.
        </ToolApprovalDescription>
      </ToolApprovalHeading>
    </ToolApprovalHeader>
  );
}

/**
 * Granting end to end: choosing a scope sets `resolution`, the card goes inert
 * and plays its exit, and `onExited` hands off to the running ToolCall row.
 */
export function ToolApprovalFlowDemo() {
  const [resolution, setResolution] = React.useState<
    "allowed" | "denied" | null
  >(null);
  const [handedOff, setHandedOff] = React.useState(false);

  if (handedOff) {
    return (
      <div className="flex w-full max-w-2xl flex-col gap-3">
        <ToolCall status={resolution === "denied" ? "error" : "running"}>
          <ToolCallTrigger icon={<Terminal />} meta="run 4192">
            {resolution === "denied" ? "Denied by you" : "Running the eval harness"}
          </ToolCallTrigger>
        </ToolCall>
        <p className="text-sm text-muted-foreground">
          {resolution === "denied"
            ? "Nothing ran."
            : "Bash is allowed for the rest of this session."}
        </p>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setHandedOff(false);
              setResolution(null);
            }}
          >
            <RotateCcw aria-hidden="true" />
            Reset
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <ToolApproval
        resolution={resolution}
        onExited={() => setHandedOff(true)}
      >
        <ApprovalHeader />
        <ToolApprovalCommand>
          npx nessa eval --suite retrieval --run 4192
        </ToolApprovalCommand>
        <ToolApprovalActions>
          <ToolApprovalAction
            variant="ghost"
            onClick={() => setResolution("denied")}
          >
            Deny
          </ToolApprovalAction>
          <ToolApprovalActionMenu label="Always allow">
            <ToolApprovalActionMenuItem onSelect={() => setResolution("allowed")}>
              Allow for this session
            </ToolApprovalActionMenuItem>
            <ToolApprovalActionMenuItem onSelect={() => setResolution("allowed")}>
              Always allow
            </ToolApprovalActionMenuItem>
          </ToolApprovalActionMenu>
          <ToolApprovalAction onClick={() => setResolution("allowed")}>
            Allow once
          </ToolApprovalAction>
        </ToolApprovalActions>
      </ToolApproval>
    </div>
  );
}

/** The notch variant, hanging from the display's camera housing. */
export function ToolApprovalNotchDemo() {
  return (
    <div className="dark w-full max-w-2xl overflow-hidden rounded-2xl bg-black p-0">
      <div className="relative flex justify-center pb-8">
        <div className="absolute inset-x-0 top-0 z-10 h-7 bg-black" />
        <div className="absolute left-1/2 top-0 z-20 h-7 w-40 -translate-x-1/2 rounded-b-2xl bg-black" />
        <ToolApproval variant="notch" className="w-[26rem] max-w-full">
          <ApprovalHeader />
          <ToolApprovalCommand json={approvalPayload} label="Tool input" />
          <ToolApprovalActions>
            <ToolApprovalAction variant="ghost">Deny</ToolApprovalAction>
            <ToolApprovalAction>Allow once</ToolApprovalAction>
          </ToolApprovalActions>
        </ToolApproval>
      </div>
    </div>
  );
}

/** A phone viewport: the payload scrolls and the actions restack. */
export function ToolApprovalMobileDemo() {
  return (
    <div className="flex w-[23.4375rem] max-w-full flex-col justify-end gap-3 rounded-[2.5rem] border border-border bg-background p-3 pt-24">
      <ToolApproval variant="floating" className="w-full">
        <ApprovalHeader />
        <ToolApprovalCommand json={approvalPayload} label="Tool input" />
        <ToolApprovalActions className="flex-col-reverse items-stretch">
          <ToolApprovalAction variant="ghost" size="default">
            Deny
          </ToolApprovalAction>
          <ToolApprovalActionMenu label="Always allow" size="default">
            <ToolApprovalActionMenuItem>
              Allow for this session
            </ToolApprovalActionMenuItem>
            <ToolApprovalActionMenuItem>Always allow</ToolApprovalActionMenuItem>
          </ToolApprovalActionMenu>
          <ToolApprovalAction size="default">Allow once</ToolApprovalAction>
        </ToolApprovalActions>
      </ToolApproval>
    </div>
  );
}

/* ── ChatComposer, full surface ────────────────────────────────────────── */

const thinkingLevels = [
  { value: "off", label: "Off" },
  { value: "light", label: "Light" },
  { value: "standard", label: "Standard" },
  { value: "deep", label: "Deep" },
];

interface Attachment {
  id: string;
  name: string;
  kind: "file" | "skill" | "mention" | "pasted-text";
}

/**
 * Everything the composer offers at once: attachment pills, a "/" menu for
 * skills, "@" for people and files, model and thinking controls, and submit.
 */
export function ChatComposerFullDemo() {
  const [message, setMessage] = React.useState("");
  const editorRef = React.useRef<ChatComposerEditorHandle>(null);
  const [sent, setSent] = React.useState("");
  const [model, setModel] = React.useState<ModelPickerValue>({
    providerId: "anthropic",
    modelId: "opus",
  });
  const [thinking, setThinking] = React.useState("standard");
  const [attachments, setAttachments] = React.useState<Attachment[]>([
    { id: "a1", name: "run-4192.json", kind: "file" },
    { id: "a2", name: "Eval suite", kind: "skill" },
    { id: "a3", name: "Ada Lovelace", kind: "mention" },
    { id: "a4", name: "Pasted stack trace", kind: "pasted-text" },
  ]);

  return (
    <div className="grid w-full min-w-0 gap-3">
      {sent ? (
        <p role="status" className="text-sm text-muted-foreground">
          Sent: {sent}
        </p>
      ) : null}

      <ChatComposer
        onSubmit={(event) => {
          event.preventDefault();
          if (!message.trim()) return;
          setSent(message.trim());
          setMessage("");
          editorRef.current?.clear();
        }}
      >
        {attachments.length ? (
          <ChatComposerAttachments>
            {attachments.map((file) => (
              <ChatComposerAttachment
                key={file.id}
                itemLabel={file.name}
                kind={file.kind}
                onRemove={() =>
                  setAttachments((current) =>
                    current.filter((item) => item.id !== file.id)
                  )
                }
              >
                {file.name}
              </ChatComposerAttachment>
            ))}
          </ChatComposerAttachments>
        ) : null}

        {/* ChatComposerEditor turns a chosen skill or mention into an atomic
            inline chip; ChatComposerInput would leave it as plain text. */}
        <ChatComposerEditor
          ref={editorRef}
          placeholder="Type / for skills, @ to mention"
          onContentChange={(content) => setMessage(content.text)}
        />

        <ChatComposerTrigger trigger="/" label="Skills and commands">
          {({ query, clearTrigger }) => (
            <div className="p-1">
              {["Eval suite", "Trace reader", "Warehouse SQL", "Diff"]
                .filter((item) =>
                  item.toLowerCase().includes(query.toLowerCase())
                )
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => clearTrigger(`/${item} `)}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    {item}
                  </button>
                ))}
            </div>
          )}
        </ChatComposerTrigger>

        <ChatComposerTrigger trigger="@" label="Mentions">
          {({ query, clearTrigger }) => (
            <div className="p-1">
              {["run-4192", "encoder.ts", "Ada Lovelace"]
                .filter((item) =>
                  item.toLowerCase().includes(query.toLowerCase())
                )
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    role="option"
                    aria-selected={false}
                    onClick={() => clearTrigger(`@${item} `)}
                    className="block w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent"
                  >
                    {item}
                  </button>
                ))}
            </div>
          )}
        </ChatComposerTrigger>

        <ChatComposerFooter>
          <ChatComposerActions>
            <ChatComposerAction
              aria-label="Add attachment"
              title="Add attachment"
              onClick={() =>
                setAttachments((current) => [
                  ...current,
                  {
                    id: `a${current.length + 1}`,
                    name: `trace-${current.length + 1}.log`,
                    kind: "file",
                  },
                ])
              }
            >
              <Plus aria-hidden="true" />
            </ChatComposerAction>
            <ChatComposerAction aria-label="Configure access" title="Configure access">
              <Shield aria-hidden="true" />
            </ChatComposerAction>
          </ChatComposerActions>

          <ChatComposerActions className="justify-end">
            <ModelPicker
              groups={modelGroups}
              value={model}
              onValueChange={setModel}
            />
            <ModelThinkingControl
              icon={<ThinkingIcon className="size-[18px]" />}
              levels={thinkingLevels}
              value={thinking}
              onValueChange={setThinking}
            />
            <ChatComposerAction aria-label="Start voice input" title="Start voice input">
              <Mic aria-hidden="true" />
            </ChatComposerAction>
            <ChatComposerSubmit disabled={!message.trim()} />
          </ChatComposerActions>
        </ChatComposerFooter>
      </ChatComposer>
    </div>
  );
}

/* ── ConversationRail ──────────────────────────────────────────────────── */

const railTurns = [
  { id: "t1", title: "Retrieval recall drop", preview: "92% to 87% after the rebuild" },
  { id: "t2", title: "Encoder mismatch", preview: "index 4188, encoder 4189" },
  { id: "t3", title: "Chunk size", preview: "512 against v2.2" },
  { id: "t4", title: "Re-run plan", preview: "three cases, matched index" },
];

/**
 * A turn navigator beside a transcript. Markers widen as the pointer
 * approaches, and hover or focus opens the turn's preview.
 */
export function ConversationRailDemo() {
  const [activeId, setActiveId] = React.useState(railTurns[0].id);
  const active = railTurns.find((turn) => turn.id === activeId)!;

  return (
    <div className="flex min-h-64 w-full items-center gap-6 rounded-2xl border border-border bg-card p-6">
      <ConversationRail>
        {railTurns.map((turn) => (
          <ConversationRailItem key={turn.id} active={turn.id === activeId}>
            <ConversationRailTrigger
              aria-label={turn.title}
              onClick={() => setActiveId(turn.id)}
            >
              <ConversationRailMarker />
            </ConversationRailTrigger>
            <ConversationRailPreview>
              <p className="m-0 font-medium text-foreground">{turn.title}</p>
              <p className="m-0 mt-1 text-muted-foreground">{turn.preview}</p>
            </ConversationRailPreview>
          </ConversationRailItem>
        ))}
      </ConversationRail>

      <div className="min-w-0">
        <div className="text-sm font-medium">{active.title}</div>
        <p className="mt-1 text-sm text-muted-foreground">{active.preview}</p>
      </div>
    </div>
  );
}

const scrollerTurns = [
  "How far back does the transcript go?",
  "All of it. The viewport keeps the reader at the live edge while they are there, and lets go the moment they scroll away.",
  "What happens when a reply streams in while I am reading history?",
  "Nothing moves. Following resumes only when the reader returns to the bottom, by scrolling or by pressing the button.",
  "And the button?",
  "It fades in once the reader leaves the live edge, and hands focus back to the viewport when it hides.",
  "Does it fight a fast stream?",
  "No. A return animation retargets as content grows, and any upward move cancels it rather than dragging the reader down.",
  "Keyboard?",
  "The viewport is the tab stop, so arrow keys and Page Up work without a mouse.",
];

/**
 * A transcript that follows new content only while the reader is at the live
 * edge. Scroll up and the return control fades in.
 */
export function MessageScrollerDemo() {
  return (
    <MessageScroller className="h-80 w-full max-w-2xl rounded-2xl border border-border bg-card">
      <MessageScrollerViewport aria-label="Transcript" className="p-4">
        <MessageScrollerContent className="gap-3">
          {scrollerTurns.map((text, index) => (
            <Message key={index} from={index % 2 === 0 ? "user" : "assistant"}>
              <MessageContent>
                <MessageBubble variant={index % 2 === 0 ? "primary" : "plain"}>
                  {text}
                </MessageBubble>
              </MessageContent>
            </Message>
          ))}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton />
    </MessageScroller>
  );
}

const inlineChips = [
  { id: "skill:eval", label: "Eval suite", kind: "skill" as const },
  { id: "file:encoder", label: "encoder.ts", kind: "file" as const },
  { id: "mention:ada", label: "Ada Lovelace", kind: "mention" as const },
];

/**
 * Attachments as inline chips rather than pills above the input. A chip is an
 * atomic island in the sentence: it keeps its place in the text, moves with
 * the words around it, and deletes whole on Backspace. Long pastes become a
 * chip too instead of flooding the field.
 */
export function ChatComposerInlineDemo() {
  const editorRef = React.useRef<ChatComposerEditorHandle>(null);
  const [content, setContent] = React.useState("");
  const pasteCount = React.useRef(0);

  return (
    <div className="grid w-full min-w-0 gap-3">
      <ChatComposer
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <ChatComposerEditor
          ref={editorRef}
          placeholder="Compare @encoder.ts against the /Eval suite baseline"
          onContentChange={(next) => setContent(next.text)}
          // A pasted stack trace belongs in an attachment, not in the field.
          onPasteAttachment={(text) => {
            pasteCount.current += 1;
            editorRef.current?.insertChip({
              id: `paste:${pasteCount.current}`,
              label: `Pasted text (${text.length} chars)`,
              kind: "pasted-text",
              textValue: text,
            });
          }}
        />

        <ChatComposerFooter>
          <ChatComposerActions>
            {inlineChips.map((chip) => (
              <ChatComposerAction
                key={chip.id}
                aria-label={`Insert ${chip.label}`}
                title={`Insert ${chip.label}`}
                onClick={() =>
                  editorRef.current?.insertChip({
                    id: `${chip.id}:${Math.round(performance.now())}`,
                    label: chip.label,
                    kind: chip.kind,
                  })
                }
              >
                {chip.kind === "skill" ? (
                  <Sparkles aria-hidden="true" />
                ) : chip.kind === "file" ? (
                  <FileCode aria-hidden="true" />
                ) : (
                  <AtSign aria-hidden="true" />
                )}
              </ChatComposerAction>
            ))}
          </ChatComposerActions>
          <ChatComposerSubmit aria-label="Send" />
        </ChatComposerFooter>
      </ChatComposer>

      <p className="text-xs text-muted-foreground">
        Serialized: {content ? content : "empty"}
      </p>
    </div>
  );
}
