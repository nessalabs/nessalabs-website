"use client";

import * as React from "react";
import { AtSign, RefreshCw, Send } from "lucide-react";
import {
  Button,
  ChatComposer,
  ChatComposerAction,
  ChatComposerActions,
  ChatComposerEditor,
  ChatComposerFooter,
  ChatComposerSubmit,
  ChatComposerTrigger,
  CodeBlock,
  ComposerAccessMode,
  GeneratingSurface,
  ModelThinkingControl,
  ModelThinkingSlider,
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireHeader,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  SectionedListbox,
  type ChatComposerContent,
  type ChatComposerEditorHandle,
  type ComposerAccessModeValue,
} from "@nessa-ui/react";
import { FastIcon, ThinkingIcon } from "../story-support/icons/nucleo";

/* ------------------------------------------------------------------ */
/* ComposerAccessMode                                                  */
/* ------------------------------------------------------------------ */

export function ComposerAccessModeDemo() {
  const [value, setValue] =
    React.useState<ComposerAccessModeValue>("ask-approval");

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex min-h-32 items-end rounded-3xl border border-border bg-card p-4">
        <ComposerAccessMode value={value} onValueChange={setValue} />
      </div>
      <p className="m-0 text-sm text-muted-foreground">
        Tools run under <span className="font-medium">{value}</span>.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ModelThinkingControl / ModelFastMode                                */
/* ------------------------------------------------------------------ */

const thinkingLevels = [
  { value: "light", label: "Light", description: "Quick, focused reasoning" },
  { value: "medium", label: "Medium", description: "Balanced speed and depth" },
  { value: "high", label: "High", description: "More deliberate reasoning" },
  {
    value: "extra-high",
    label: "Extra High",
    description: "Deep, extended reasoning",
  },
  {
    value: "ultra",
    label: "Ultra",
    description: "Maximum extended reasoning",
    accent: "ultra" as const,
  },
];

export function ModelCapabilityControlsDemo() {
  const [fast, setFast] = React.useState(false);
  const [thinking, setThinking] = React.useState("light");

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 text-card-foreground">
        <ModelThinkingControl
          icon={<ThinkingIcon className="size-4.5" />}
          levels={thinkingLevels}
          value={thinking}
          onValueChange={setThinking}
          fastMode={{
            pressed: fast,
            onPressedChange: setFast,
            icon: ({ pressed }) => (
              <FastIcon active={pressed} className="size-4.5" />
            ),
          }}
        />
      </div>
      <p className="m-0 text-sm text-muted-foreground">
        Thinking is {thinkingLevels.find((l) => l.value === thinking)?.label},
        fast mode is {fast ? "on" : "off"}.
      </p>
    </div>
  );
}

export function ModelThinkingSliderDemo() {
  const [value, setValue] = React.useState("medium");

  return (
    <div className="w-full max-w-xs rounded-xl border border-border bg-popover p-3">
      <ModelThinkingSlider
        levels={thinkingLevels}
        value={value}
        onValueChange={setValue}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ChatComposerEditor                                                  */
/* ------------------------------------------------------------------ */

interface Teammate {
  id: string;
  name: string;
  role: string;
}

const teammateSections = [
  {
    id: "team",
    label: "Teammates",
    items: [
      { id: "mira", name: "Mira Chen", role: "Design engineer" },
      { id: "sasha", name: "Sasha Ortiz", role: "Product engineer" },
      { id: "wren", name: "Wren Alvarez", role: "Researcher" },
    ] satisfies Teammate[],
  },
];

export function ChatComposerEditorDemo() {
  const editorRef = React.useRef<ChatComposerEditorHandle>(null);
  const [content, setContent] = React.useState<ChatComposerContent>({
    text: "",
    parts: [],
  });
  const [sent, setSent] = React.useState("");
  const [pressed, setPressed] = React.useState("");
  const nextChip = React.useRef(0);

  const chips = content.parts.filter((part) => part.type === "chip");

  return (
    <div className="grid w-full min-w-0 gap-3">
      {sent ? (
        <p role="status" className="m-0 text-sm text-muted-foreground">
          Sent: {sent}
        </p>
      ) : null}
      {pressed ? (
        <p className="m-0 text-sm text-muted-foreground">
          Chip pressed: {pressed}
        </p>
      ) : null}

      <ChatComposer
        onSubmit={(event) => {
          event.preventDefault();
          const current = editorRef.current?.getContent();
          if (!current || current.text.trim().length === 0) return;
          setSent(current.text.trim());
          editorRef.current?.clear();
        }}
      >
        {/* Chips are atomic inline text: they keep their place in the
            sentence, delete whole on Backspace, and serialize as their
            textValue. */}
        <ChatComposerEditor
          ref={editorRef}
          placeholder="Message, @ to mention"
          onContentChange={setContent}
          onChipPress={(chip) => setPressed(chip.label)}
        />
        <ChatComposerTrigger trigger="@" label="Mention a teammate">
          {({ query, clearTrigger }) => (
            <SectionedListbox
              sections={teammateSections.map((section) => ({
                ...section,
                items: section.items.filter((teammate) =>
                  teammate.name.toLowerCase().includes(query.toLowerCase())
                ),
              }))}
              getItemId={(teammate) => teammate.id}
              listLabel="Teammates"
              emptyMessage="No teammate matches that."
              onValueChange={(_, teammate) => {
                clearTrigger();
                nextChip.current += 1;
                editorRef.current?.insertChip({
                  id: `chip-${nextChip.current}`,
                  kind: "mention",
                  label: teammate.name,
                  icon: <AtSign aria-hidden />,
                  className: "text-primary",
                });
              }}
              renderItem={(teammate) => (
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <span className="truncate text-sm">{teammate.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {teammate.role}
                  </span>
                </div>
              )}
            />
          )}
        </ChatComposerTrigger>
        <ChatComposerFooter>
          <ChatComposerActions>
            <ChatComposerAction
              aria-label="Mention a teammate"
              title="Mention a teammate"
              onClick={() => editorRef.current?.insertText("@")}
            >
              <AtSign aria-hidden="true" />
            </ChatComposerAction>
          </ChatComposerActions>
          <ChatComposerSubmit
            aria-label="Send message"
            disabled={content.text.trim().length === 0}
          />
        </ChatComposerFooter>
      </ChatComposer>

      <p className="m-0 text-xs text-muted-foreground">
        {chips.length} chip{chips.length === 1 ? "" : "s"} in the message ·
        serializes to &quot;{content.text.trim() || "…"}&quot;
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GeneratingSurface                                                   */
/* ------------------------------------------------------------------ */

const generatedPage = `<section class="hero">
  <h1>Ship the design system</h1>
  <p>One library, two themes, no drift.</p>
</section>`;

export function GeneratingSurfaceDemo() {
  const [generating, setGenerating] = React.useState(true);
  const timer = React.useRef<number | undefined>(undefined);

  // The reveal morph is the subject, so the demo runs it on mount and again
  // on demand rather than parking on a placeholder that never resolves.
  React.useEffect(() => {
    timer.current = window.setTimeout(() => setGenerating(false), 2200);
    return () => window.clearTimeout(timer.current);
  }, []);

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <Button
        variant="outline"
        onClick={() => {
          window.clearTimeout(timer.current);
          setGenerating(true);
          timer.current = window.setTimeout(() => setGenerating(false), 2200);
        }}
      >
        <RefreshCw aria-hidden className="size-4" />
        Generate again
      </Button>
      <div className="w-full min-w-0">
        <GeneratingSurface
          generating={generating}
          label="Generating preview"
          placeholderClassName="min-h-40"
        >
          <CodeBlock code={generatedPage} language="html" />
        </GeneratingSurface>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Questionnaire                                                       */
/* ------------------------------------------------------------------ */

export function QuestionnaireDemo() {
  const [answers, setAnswers] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setAnswers(
            [...data.entries()]
              .map(([key, value]) => `${key}: ${value}`)
              .join(" · ")
          );
        }}
      >
        <Questionnaire>
          <QuestionnaireHeader>
            <QuestionnaireProgress step={1} total={2} />
          </QuestionnaireHeader>
          <QuestionnaireItem name="role">
            <QuestionnaireTitle>
              What best describes your role?
            </QuestionnaireTitle>
            <QuestionnaireDescription>
              We tune the default workspace to how you work.
            </QuestionnaireDescription>
            <QuestionnaireChoices defaultValue={["design-engineer"]}>
              <QuestionnaireChoice value="design-engineer">
                Design engineer
              </QuestionnaireChoice>
              <QuestionnaireChoice value="product-engineer">
                Product engineer
              </QuestionnaireChoice>
              <QuestionnaireChoice value="researcher">
                Researcher
              </QuestionnaireChoice>
            </QuestionnaireChoices>
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnaireSubmit />
          </QuestionnaireActions>
        </Questionnaire>
      </form>
      {answers ? (
        <p role="status" className="mt-4 mb-0 text-sm text-muted-foreground">
          Submitted — {answers}
        </p>
      ) : null}
    </div>
  );
}

export function QuestionnaireMixedDemo() {
  return (
    <div className="w-full max-w-md rounded-3xl border border-border bg-background p-6">
      <form onSubmit={(event) => event.preventDefault()}>
        <Questionnaire>
          <QuestionnaireHeader>
            <QuestionnaireProgress step={2} total={2} variant="bar" />
          </QuestionnaireHeader>
          <QuestionnaireItem name="surfaces">
            <QuestionnaireTitle>Which surfaces do you build?</QuestionnaireTitle>
            <QuestionnaireChoices multiple defaultValue={["chat", "charts"]}>
              <QuestionnaireChoice value="chat">
                Chat and agent transcripts
              </QuestionnaireChoice>
              <QuestionnaireChoice value="charts">
                Charts and dashboards
              </QuestionnaireChoice>
              <QuestionnaireChoice value="editors">
                Editors and canvases
              </QuestionnaireChoice>
            </QuestionnaireChoices>
          </QuestionnaireItem>
          <QuestionnaireItem name="anything-else">
            <QuestionnaireTitle>Anything else?</QuestionnaireTitle>
            <QuestionnaireInput placeholder="What are you building?" />
          </QuestionnaireItem>
          <QuestionnaireActions>
            <Button type="button" variant="ghost">
              Back
            </Button>
            <QuestionnaireSubmit>
              Finish
              <Send aria-hidden className="size-4" />
            </QuestionnaireSubmit>
          </QuestionnaireActions>
        </Questionnaire>
      </form>
    </div>
  );
}
