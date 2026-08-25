"use client";

import * as React from "react";
import { FileSearch, Mic, Plus, Shield, Terminal } from "lucide-react";
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
  ToolCall,
  ToolCallContent,
  ToolCallFile,
  ToolCallTabs,
  ToolCallTrigger,
  type ModelPickerValue,
} from "@nessa-ui/react";

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

const modelGroups = [
  {
    id: "nessa",
    label: "Nessa",
    models: [
      { id: "large", label: "nessa-1-large", description: "Best for reasoning" },
      { id: "base", label: "nessa-1-base", description: "Balanced" },
      { id: "mini", label: "nessa-1-mini", description: "Fastest" },
    ],
  },
];

export function ChatComposerDemo() {
  const [message, setMessage] = React.useState("");
  const [submitted, setSubmitted] = React.useState("");
  const [model, setModel] = React.useState<ModelPickerValue>({
    providerId: "nessa",
    modelId: "large",
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

export function ComposerQueueDemo() {
  const [items, setItems] = React.useState([
    { id: "q1", text: "Also compare against checkpoint 4188" },
    { id: "q2", text: "Then open a PR with the fix" },
  ]);

  return (
    <div className="w-full max-w-2xl">
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
            onRemove={() =>
              setItems((current) => current.filter((q) => q.id !== item.id))
            }
          />
        ))}
      </ComposerQueue>
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
