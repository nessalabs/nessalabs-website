"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface ComposerChip {
  id: string;
  /** Drives the chip's glyph and how hosts interpret it. */
  kind: "file" | "mention" | "skill" | "command";
  label: string;
}

export interface ComposerContent {
  /** Plain text, with chips serialized as their trigger + label. */
  text: string;
  chips: ComposerChip[];
}

export interface ComposerSuggestion {
  id: string;
  label: string;
  description?: string;
  kind?: ComposerChip["kind"];
}

export interface ComposerEditorHandle {
  focus: () => void;
  clear: () => void;
  insertChip: (chip: ComposerChip) => void;
}

export interface ComposerEditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "children"> {
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: number;
  onContentChange?: (content: ComposerContent) => void;
  onSubmit?: () => void;
  /** Offered after "/" — skills, commands, modes. */
  commands?: ComposerSuggestion[];
  /** Offered after "@" — files, people, runs. */
  mentions?: ComposerSuggestion[];
  onChipPress?: (chip: ComposerChip) => void;
}

const GLYPH: Record<ComposerChip["kind"], string> = {
  file: "▤",
  mention: "@",
  skill: "◆",
  command: "/",
};

/**
 * A rich message input where attachments, mentions and skills are true inline
 * chips: atomic, non-editable islands that flow with the text and delete with
 * a single Backspace. Typing "/" or "@" opens the matching suggestion menu at
 * the caret; the menu owns ↑/↓/Enter/Escape while it is open.
 */
export const ComposerEditor = React.forwardRef<
  ComposerEditorHandle,
  ComposerEditorProps
>(function ComposerEditor(
  {
    placeholder = "Ask anything…",
    disabled,
    maxHeight = 240,
    onContentChange,
    onSubmit,
    commands = [],
    mentions = [],
    onChipPress,
    className,
    ...props
  },
  ref
) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [empty, setEmpty] = React.useState(true);
  const [menu, setMenu] = React.useState<{
    trigger: "/" | "@";
    query: string;
  } | null>(null);
  const [active, setActive] = React.useState(0);

  const items = React.useMemo(() => {
    if (!menu) return [];
    const source = menu.trigger === "/" ? commands : mentions;
    const q = menu.query.toLowerCase();
    return source.filter(
      (item) =>
        !q ||
        item.label.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [menu, commands, mentions]);

  /** Walk the editor and serialize text and chips in document order. */
  const serialize = React.useCallback((): ComposerContent => {
    const root = editorRef.current;
    if (!root) return { text: "", chips: [] };
    const chips: ComposerChip[] = [];
    let text = "";

    root.childNodes.forEach(function walk(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent ?? "";
        return;
      }
      const el = node as HTMLElement;
      if (el.dataset?.chip) {
        const chip: ComposerChip = {
          id: el.dataset.chip,
          kind: (el.dataset.chipKind as ComposerChip["kind"]) ?? "file",
          label: el.dataset.chipLabel ?? el.textContent ?? "",
        };
        chips.push(chip);
        text += `${chip.kind === "mention" ? "@" : chip.kind === "skill" || chip.kind === "command" ? "/" : ""}${chip.label}`;
        return;
      }
      if (el.tagName === "BR") text += "\n";
      else el.childNodes.forEach(walk);
    });

    return { text, chips };
  }, []);

  const emit = React.useCallback(() => {
    const content = serialize();
    setEmpty(!content.text.trim() && content.chips.length === 0);
    onContentChange?.(content);
  }, [serialize, onContentChange]);

  function chipElement(chip: ComposerChip) {
    const span = document.createElement("span");
    span.contentEditable = "false";
    span.dataset.chip = chip.id;
    span.dataset.chipKind = chip.kind;
    span.dataset.chipLabel = chip.label;
    span.className =
      "mx-0.5 inline-flex items-center gap-1 rounded-md border border-line bg-raised px-1.5 align-baseline text-[13px] text-fg";
    span.textContent = `${GLYPH[chip.kind]} ${chip.label}`;
    return span;
  }

  /** Insert a chip at the caret, replacing `replaceLength` characters before it. */
  function insertChip(chip: ComposerChip, replaceLength = 0) {
    const root = editorRef.current;
    const selection = window.getSelection();
    if (!root || !selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    if (replaceLength > 0) {
      range.setStart(range.endContainer, range.endOffset - replaceLength);
    }
    range.deleteContents();

    const node = chipElement(chip);
    range.insertNode(node);

    const space = document.createTextNode(" ");
    node.after(space);

    const next = document.createRange();
    next.setStartAfter(space);
    next.collapse(true);
    selection.removeAllRanges();
    selection.addRange(next);

    setMenu(null);
    emit();
  }

  React.useImperativeHandle(ref, () => ({
    focus: () => editorRef.current?.focus(),
    clear: () => {
      if (editorRef.current) editorRef.current.innerHTML = "";
      setMenu(null);
      emit();
    },
    insertChip: (chip) => insertChip(chip),
  }));

  /** Detect a "/" or "@" token immediately before the caret. */
  function syncMenu() {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return setMenu(null);
    const range = selection.getRangeAt(0);
    if (range.endContainer.nodeType !== Node.TEXT_NODE) return setMenu(null);

    const before = (range.endContainer.textContent ?? "").slice(
      0,
      range.endOffset
    );
    const match = /(^|\s)([/@])([\w-]*)$/.exec(before.replace(/ /g, " "));
    if (!match) return setMenu(null);
    setMenu({ trigger: match[2] as "/" | "@", query: match[3] });
    setActive(0);
  }

  function choose(item: ComposerSuggestion) {
    if (!menu) return;
    insertChip(
      {
        id: item.id,
        kind: item.kind ?? (menu.trigger === "@" ? "mention" : "skill"),
        label: item.label,
      },
      menu.query.length + 1
    );
  }

  return (
    <div className="relative">
      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-slot="composer-editor"
        style={{ maxHeight }}
        onInput={() => {
          emit();
          syncMenu();
        }}
        onKeyUp={syncMenu}
        onClick={(e) => {
          const chip = (e.target as HTMLElement).closest?.(
            "[data-chip]"
          ) as HTMLElement | null;
          if (chip && onChipPress) {
            onChipPress({
              id: chip.dataset.chip!,
              kind: (chip.dataset.chipKind as ComposerChip["kind"]) ?? "file",
              label: chip.dataset.chipLabel ?? "",
            });
          }
          syncMenu();
        }}
        onKeyDown={(e) => {
          if (menu && items.length) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(items.length - 1, i + 1));
              return;
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(0, i - 1));
              return;
            }
            if (e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
              choose(items[active]);
              return;
            }
            if (e.key === "Escape") {
              e.preventDefault();
              setMenu(null);
              return;
            }
          }
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit?.();
          }
        }}
        className={cn(
          "w-full overflow-y-auto px-3.5 py-3 text-sm leading-6 text-fg outline-none",
          "empty:before:text-dim empty:before:content-[attr(data-placeholder)]",
          disabled && "opacity-50",
          className
        )}
        data-placeholder={empty ? placeholder : undefined}
        {...props}
      />

      {menu && items.length ? (
        <div className="absolute bottom-full left-3 z-30 mb-2 w-72 overflow-hidden rounded-lg border border-line bg-ink shadow-xl">
          <div className="border-b border-line px-2 py-1 text-xs text-dim">
            {menu.trigger === "/" ? "Skills and commands" : "Mention"}
            {menu.query ? ` · ${menu.query}` : ""}
          </div>
          <div className="max-h-56 overflow-y-auto p-1">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(item);
                }}
                className={cn(
                  "flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors",
                  i === active && "bg-raised"
                )}
              >
                <span className="mt-0.5 text-xs text-dim">
                  {GLYPH[item.kind ?? (menu.trigger === "@" ? "mention" : "skill")]}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm text-fg">
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="block truncate text-xs text-dim">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
});
