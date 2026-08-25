"use client";

import * as React from "react";
import {
  EventCalendarDemo,
  GanttChartDemo,
  KanbanDemo,
  WorkflowCanvasDemo,
} from "./demos/composites";
import {
  ChatComposerDemo,
  ComposerQueueDemo,
  MessageDemo,
  ToolApprovalDemo,
  ToolCallDemo,
  ToolCallStatesDemo,
  ModelPickerDemo,
  SelectionTooltipDemo,
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
  "tool-call": <ToolCallDemo />,
  "tool-call-states": <ToolCallStatesDemo />,
  "tool-approval": <ToolApprovalDemo />,
  "chat-composer": <ChatComposerDemo />,
  "composer-queue": <ComposerQueueDemo />,
  "model-picker": <ModelPickerDemo />,
  "selection-tooltip": <SelectionTooltipDemo />,

  // composites
  "event-calendar": <EventCalendarDemo />,
  "event-calendar-day": <EventCalendarDemo defaultView="day" />,
  "event-calendar-month": <EventCalendarDemo defaultView="month" />,
  "gantt-chart": <GanttChartDemo />,
  "gantt-chart-day": <GanttChartDemo scale="day" />,
  "gantt-chart-month": <GanttChartDemo scale="month" />,
  kanban: <KanbanDemo />,
  "workflow-canvas": <WorkflowCanvasDemo />,
};
