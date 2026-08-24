"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface ChatAttachment {
  id: string;
  name: string;
  kind?: "file" | "image" | "code";
  size?: string;
}

export interface ChatToolCall {
  id: string;
  name: string;
  /** "skill" renders with the skill affordance, "tool" is a plain call. */
  kind?: "tool" | "skill";
  status: "running" | "done" | "error";
  detail?: string;
  output?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: ChatAttachment[];
  toolCalls?: ChatToolCall[];
  /** Renders the caret and reveals content progressively. */
  streaming?: boolean;
}

export interface ChatProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: ChatMessage[];
  /** Characters per tick while a message is streaming. 0 shows it all at once. */
  streamSpeed?: number;
  /** Rendered under the last message — typically a Composer. */
  footer?: React.ReactNode;
  renderMessage?: (message: ChatMessage) => React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * A message thread with token streaming, tool and skill calls, and attachments.
 * The streaming animation is presentational: pass `streaming: true` on a message
 * and it reveals progressively, so the same component works with a real token
 * stream or with a completed transcript.
 */
export function Chat({
  messages,
  streamSpeed = 2,
  footer,
  renderMessage,
  emptyState,
  className,
  ...props
}: ChatProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-col rounded-xl border border-line bg-surface",
        className
      )}
      {...props}
    >
      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {messages.length === 0 && emptyState ? emptyState : null}
        {messages.map((message) =>
          renderMessage ? (
            <React.Fragment key={message.id}>
              {renderMessage(message)}
            </React.Fragment>
          ) : (
            <Message
              key={message.id}
              message={message}
              streamSpeed={streamSpeed}
            />
          )
        )}
      </div>
      {footer ? <div className="border-t border-line p-3">{footer}</div> : null}
    </div>
  );
}

function Message({
  message,
  streamSpeed,
}: {
  message: ChatMessage;
  streamSpeed: number;
}) {
  const text = useStreamedText(
    message.content,
    Boolean(message.streaming),
    streamSpeed
  );
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[85%] space-y-2", isUser && "items-end")}>
        {message.attachments?.length ? (
          <div className={cn("flex flex-wrap gap-1.5", isUser && "justify-end")}>
            {message.attachments.map((file) => (
              <AttachmentChip key={file.id} attachment={file} />
            ))}
          </div>
        ) : null}

        {message.toolCalls?.length ? (
          <div className="space-y-1.5">
            {message.toolCalls.map((call) => (
              <ToolCallRow key={call.id} call={call} />
            ))}
          </div>
        ) : null}

        {text || !message.streaming ? (
          <div
            className={cn(
              "rounded-xl px-3.5 py-2.5 text-sm leading-6",
              isUser
                ? "bg-fg text-ink"
                : "border border-line bg-ink text-fg"
            )}
          >
            <span className="whitespace-pre-wrap">{text}</span>
            {message.streaming ? (
              <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-current align-baseline" />
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Reveals text progressively; respects reduced motion by showing it at once. */
function useStreamedText(full: string, streaming: boolean, speed: number) {
  const [shown, setShown] = React.useState(streaming ? "" : full);

  React.useEffect(() => {
    if (!streaming || speed <= 0) {
      setShown(full);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(full);
      return;
    }
    let i = 0;
    setShown("");
    const id = window.setInterval(() => {
      i += speed;
      setShown(full.slice(0, i));
      if (i >= full.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [full, streaming, speed]);

  return shown;
}

export function AttachmentChip({
  attachment,
  onRemove,
}: {
  attachment: ChatAttachment;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-raised px-2 py-1 text-xs text-muted">
      <span aria-hidden className="text-dim">
        {attachment.kind === "image" ? "▣" : attachment.kind === "code" ? "{ }" : "▤"}
      </span>
      <span className="max-w-40 truncate text-fg">{attachment.name}</span>
      {attachment.size ? <span className="text-dim">{attachment.size}</span> : null}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${attachment.name}`}
          className="ml-0.5 text-dim transition-colors hover:text-fg"
        >
          ×
        </button>
      ) : null}
    </span>
  );
}

function ToolCallRow({ call }: { call: ChatToolCall }) {
  const [open, setOpen] = React.useState(false);
  const isSkill = call.kind === "skill";

  return (
    <div className="rounded-lg border border-line bg-ink">
      <button
        type="button"
        onClick={() => call.output && setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs"
      >
        <StatusDot status={call.status} />
        <span className="text-dim">{isSkill ? "Skill" : "Tool"}</span>
        <code className="text-fg">{call.name}</code>
        {call.detail ? (
          <span className="truncate text-dim">{call.detail}</span>
        ) : null}
        {call.output ? (
          <span className="ml-auto text-dim">{open ? "Hide" : "Show"}</span>
        ) : null}
      </button>
      {open && call.output ? (
        <pre className="overflow-x-auto border-t border-line px-3 py-2 text-xs leading-5 text-muted">
          {call.output}
        </pre>
      ) : null}
    </div>
  );
}

function StatusDot({ status }: { status: ChatToolCall["status"] }) {
  return (
    <span
      className={cn(
        "h-1.5 w-1.5 shrink-0 rounded-full",
        status === "running" && "animate-pulse bg-warn",
        status === "done" && "bg-success",
        status === "error" && "bg-danger"
      )}
    />
  );
}
