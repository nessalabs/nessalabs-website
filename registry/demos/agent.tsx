"use client";

import * as React from "react";
import {
  Bookmark,
  Copy,
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
  MessageStreamText,
  ModelPicker,
  ToolApproval,
  ToolApprovalAction,
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
