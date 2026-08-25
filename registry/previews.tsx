"use client";

import * as React from "react";
import {
  EventCalendarDemo,
  GanttChartDemo,
  KanbanDemo,
  WorkflowCanvasDemo,
  WorkflowCanvasNestedDemo,
} from "./demos/composites";
import {
  ChatComposerDemo,
  ComposerQueueDemo,
  MessageDemo,
  MessageStreamDemo,
  ToolApprovalDemo,
  ToolCallDemo,
  ToolCallStatesDemo,
  ModelPickerDemo,
  SelectionTooltipDemo,
  SelectionTooltipShelfDemo,
} from "./demos/agent";
import {
  BadgeDemo,
  ButtonDemo,
  CardDemo,
  CodeBlockDemo,
  FileDiffDemo,
  InputDemo,
  JsonTreeDemo,
  MathBlockDemo,
  MessageMarkdownDemo,
  ReferenceDemo,
  SegmentedControlDemo,
} from "./demos/content";

/**
 * Live previews, keyed by component slug and by example id. Every one renders
 * the real @nessa-ui/react component — the docs never re-implement anything.
 */
export const previews: Record<string, React.ReactNode> = {
  // primitives
  button: <ButtonDemo />,
  badge: <BadgeDemo />,
  card: <CardDemo />,
  input: <InputDemo />,
  "segmented-control": <SegmentedControlDemo />,

  // content
  "code-block": <CodeBlockDemo />,
  "json-tree": <JsonTreeDemo />,
  "json-tree-collapsible": <JsonTreeDemo collapsible />,
  "math-block": <MathBlockDemo />,
  "message-markdown": <MessageMarkdownDemo />,
  reference: <ReferenceDemo />,
  "file-diff-list": <FileDiffDemo />,

  // agent surfaces
  message: <MessageDemo />,
  "message-streaming": <MessageStreamDemo />,
  "tool-call": <ToolCallDemo />,
  "tool-call-states": <ToolCallStatesDemo />,
  "tool-approval": <ToolApprovalDemo />,
  "chat-composer": <ChatComposerDemo />,
  "composer-queue": <ComposerQueueDemo />,
  "model-picker": <ModelPickerDemo />,
  "selection-tooltip": <SelectionTooltipDemo />,
  "selection-tooltip-shelf": <SelectionTooltipShelfDemo />,

  // composites
  "event-calendar": <EventCalendarDemo />,
  "gantt-chart": <GanttChartDemo />,
  kanban: <KanbanDemo />,
  "workflow-canvas": <WorkflowCanvasDemo />,
  "workflow-canvas-nested": <WorkflowCanvasNestedDemo />,
};
