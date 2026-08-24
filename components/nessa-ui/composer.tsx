"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { AttachmentChip, type ChatAttachment } from "./chat";
import {
  ComposerEditor,
  type ComposerChip,
  type ComposerContent,
  type ComposerEditorHandle,
  type ComposerSuggestion,
} from "./composer-editor";

export interface ComposerSkill {
  id: string;
  name: string;
  description?: string;
}

export interface ComposerSubmit {
  text: string;
  attachments: ChatAttachment[];
  skills: string[];
  /** Inline chips in document order: files, mentions, skills, commands. */
  chips: ComposerChip[];
}

export interface ComposerProps
  extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  placeholder?: string;
  /** While true the send button becomes Stop and new sends go to the queue. */
  running?: boolean;
  onSend?: (payload: ComposerSubmit) => void;
  onStop?: () => void;

  attachments?: ChatAttachment[];
  onAttachmentsChange?: (attachments: ChatAttachment[]) => void;

  skills?: ComposerSkill[];
  activeSkills?: string[];
  onActiveSkillsChange?: (skills: string[]) => void;

  /**
   * Messages waiting to be sent while a turn is running. Users can edit,
   * reorder, promote or drop them before they reach the model — steering the
   * conversation mid-flight instead of waiting for it to finish.
   */
  queue?: string[];
  onQueueChange?: (queue: string[]) => void;

  models?: { value: string; label: string }[];
  model?: string;
  onModelChange?: (model: string) => void;

  /** Suggestions offered after "/" in the editor. Defaults to `skills`. */
  commands?: ComposerSuggestion[];
  /** Suggestions offered after "@" — files, runs, people. */
  mentions?: ComposerSuggestion[];

  maxRows?: number;
}

export function Composer({
  placeholder = "Ask anything…",
  running = false,
  onSend,
  onStop,
  attachments,
  onAttachmentsChange,
  skills = [],
  activeSkills,
  onActiveSkillsChange,
  queue,
  onQueueChange,
  models,
  model,
  onModelChange,
  commands,
  mentions = [],
  maxRows = 8,
  className,
  ...props
}: ComposerProps) {
  const [content, setContent] = React.useState<ComposerContent>({
    text: "",
    chips: [],
  });
  const [internalAttachments, setInternalAttachments] = React.useState<
    ChatAttachment[]
  >([]);
  const [internalSkills, setInternalSkills] = React.useState<string[]>([]);
  const [internalQueue, setInternalQueue] = React.useState<string[]>([]);
  const [skillsOpen, setSkillsOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<number | null>(null);

  const files = attachments ?? internalAttachments;
  const chosenSkills = activeSkills ?? internalSkills;
  const pending = queue ?? internalQueue;

  const editorRef = React.useRef<ComposerEditorHandle>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  function setFiles(next: ChatAttachment[]) {
    if (onAttachmentsChange) onAttachmentsChange(next);
    else setInternalAttachments(next);
  }

  function setSkills(next: string[]) {
    if (onActiveSkillsChange) onActiveSkillsChange(next);
    else setInternalSkills(next);
  }

  function setQueue(next: string[]) {
    if (onQueueChange) onQueueChange(next);
    else setInternalQueue(next);
  }

  function submit() {
    const value = content.text.trim();
    if (!value) return;

    if (running) {
      setQueue([...pending, value]);
    } else {
      onSend?.({
        text: value,
        attachments: files,
        skills: chosenSkills,
        chips: content.chips,
      });
      setFiles([]);
    }
    editorRef.current?.clear();
    setContent({ text: "", chips: [] });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn("rounded-xl border border-line bg-ink", className)}
      {...props}
    >
      {pending.length ? (
        <div className="space-y-1.5 border-b border-line p-2">
          <div className="flex items-center gap-2 px-1 text-xs text-dim">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warn" />
            {pending.length} queued — edit or reorder before it is sent
          </div>
          {pending.map((item, i) => (
            <div
              key={`${item}-${i}`}
              className="flex items-center gap-2 rounded-lg border border-line bg-surface px-2 py-1.5"
            >
              <span className="text-xs text-dim">{i + 1}</span>
              {editing === i ? (
                <input
                  autoFocus
                  value={item}
                  onChange={(e) => {
                    const next = [...pending];
                    next[i] = e.target.value;
                    setQueue(next);
                  }}
                  onBlur={() => setEditing(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "Escape") {
                      e.preventDefault();
                      setEditing(null);
                    }
                  }}
                  className="flex-1 bg-transparent text-sm text-fg outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setEditing(i)}
                  className="flex-1 truncate text-left text-sm text-fg"
                >
                  {item}
                </button>
              )}
              <QueueAction
                label="Move up"
                disabled={i === 0}
                onClick={() => {
                  const next = [...pending];
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  setQueue(next);
                }}
              >
                ↑
              </QueueAction>
              <QueueAction
                label="Send now"
                onClick={() => {
                  onStop?.();
                  onSend?.({
                    text: item,
                    attachments: [],
                    skills: chosenSkills,
                    chips: [],
                  });
                  setQueue(pending.filter((_, j) => j !== i));
                }}
              >
                ⏎
              </QueueAction>
              <QueueAction
                label="Remove"
                onClick={() => setQueue(pending.filter((_, j) => j !== i))}
              >
                ×
              </QueueAction>
            </div>
          ))}
        </div>
      ) : null}

      {files.length || chosenSkills.length ? (
        <div className="flex flex-wrap gap-1.5 border-b border-line p-2">
          {files.map((file) => (
            <AttachmentChip
              key={file.id}
              attachment={file}
              onRemove={() => setFiles(files.filter((f) => f.id !== file.id))}
            />
          ))}
          {chosenSkills.map((id) => {
            const skill = skills.find((s) => s.id === id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-raised px-2 py-1 text-xs"
              >
                <span aria-hidden className="text-dim">
                  ◆
                </span>
                <span className="text-fg">{skill?.name ?? id}</span>
                <button
                  type="button"
                  onClick={() => setSkills(chosenSkills.filter((s) => s !== id))}
                  aria-label={`Remove ${skill?.name ?? id}`}
                  className="text-dim transition-colors hover:text-fg"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      ) : null}

      <ComposerEditor
        ref={editorRef}
        placeholder={running ? "Queue a follow-up…" : placeholder}
        maxHeight={maxRows * 24}
        commands={
          commands ??
          skills.map((skill) => ({
            id: skill.id,
            label: skill.name,
            description: skill.description,
            kind: "skill" as const,
          }))
        }
        mentions={mentions}
        onContentChange={setContent}
        onSubmit={submit}
        onKeyDown={(e) => {
          if (e.key === "Escape" && running) {
            e.preventDefault();
            onStop?.();
          }
        }}
      />

      <div className="flex items-center justify-between gap-2 px-2 pb-2">
        <div className="flex items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              const picked = Array.from(e.target.files ?? []).map((file, i) => ({
                id: `${file.name}-${i}`,
                name: file.name,
                size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
                kind: file.type.startsWith("image/")
                  ? ("image" as const)
                  : ("file" as const),
              }));
              setFiles([...files, ...picked]);
              e.target.value = "";
            }}
          />
          <IconButton
            label="Attach files"
            onClick={() => fileRef.current?.click()}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8-8a3.5 3.5 0 1 1 5 5l-8 8a2 2 0 0 1-3-3l7.5-7.5" />
            </svg>
          </IconButton>

          {skills.length ? (
            <div className="relative">
              <IconButton
                label="Skills"
                onClick={() => setSkillsOpen((v) => !v)}
                active={skillsOpen}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                  <path d="m12 3 2.6 5.6 6.4.9-4.6 4.4 1.1 6.1L12 17.8 6.5 20l1.1-6.1L3 9.5l6.4-.9z" />
                </svg>
              </IconButton>
              {skillsOpen ? (
                <div className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-lg border border-line bg-ink p-1 shadow-xl">
                  {skills.map((skill) => {
                    const on = chosenSkills.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() =>
                          setSkills(
                            on
                              ? chosenSkills.filter((s) => s !== skill.id)
                              : [...chosenSkills, skill.id]
                          )
                        }
                        className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-raised"
                      >
                        <span
                          className={cn(
                            "mt-0.5 text-xs",
                            on ? "text-fg" : "text-dim"
                          )}
                        >
                          {on ? "◆" : "◇"}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-sm text-fg">
                            {skill.name}
                          </span>
                          {skill.description ? (
                            <span className="block truncate text-xs text-dim">
                              {skill.description}
                            </span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ) : null}

          {models?.length ? (
            <select
              value={model}
              onChange={(e) => onModelChange?.(e.target.value)}
              aria-label="Model"
              className="rounded-md bg-transparent px-1.5 py-1 text-xs text-dim outline-none transition-colors hover:text-fg"
            >
              {models.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-dim sm:inline">
            {running ? "Esc to stop" : "/ for skills · @ to mention · ⏎ to send"}
          </span>
          {running ? (
            <button
              type="button"
              onClick={onStop}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-fg transition-colors hover:bg-raised"
            >
              <span className="h-2.5 w-2.5 rounded-[2px] bg-fg" />
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!content.text.trim()}
              className="inline-flex h-8 items-center rounded-lg bg-fg px-3 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function IconButton({
  label,
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "rounded-md p-1.5 transition-colors hover:bg-raised hover:text-fg",
        active ? "bg-raised text-fg" : "text-dim",
        className
      )}
      {...props}
    />
  );
}

function QueueAction({
  label,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "rounded px-1.5 text-xs text-dim transition-colors hover:bg-raised hover:text-fg disabled:opacity-30",
        className
      )}
      {...props}
    />
  );
}
