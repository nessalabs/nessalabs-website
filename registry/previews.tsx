"use client";

import * as React from "react";
import {
  EventCalendarDemo,
  GanttChartDemo,
  GanttChartPlanningDemo,
  KanbanDemo,
  SplitViewDemo,
  SplitViewWorkspaceDemo,
  WorkflowCanvasDemo,
  WorkflowCanvasNestedDemo,
  WorkflowCanvasPaletteDemo,
} from "./demos/composites";
import {
  ChatComposerDemo,
  ConversationRailDemo,
  ChatComposerFullDemo,
  ChatComposerInlineDemo,
  ComposerQueueDemo,
  MessageDemo,
  MessageScrollerDemo,
  MessageRichStreamDemo,
  MessageStreamDemo,
  ToolApprovalDemo,
  ToolApprovalFlowDemo,
  ToolApprovalMobileDemo,
  ToolApprovalNotchDemo,
  ToolCallDemo,
  ToolCallStatesDemo,
  ModelPickerDemo,
  SelectionTooltipDemo,
  SelectionTooltipShelfDemo,
} from "./demos/agent";
import { AgentHarness } from "./demos/harness";
import {
  BadgeDemo,
  ButtonDemo,
  CardDemo,
  CodeBlockDemo,
  FileDiffDemo,
  FileDiffScrollDemo,
  MermaidDiagramDemo,
  InputDemo,
  JsonTreeDemo,
  MathBlockDemo,
  MessageMarkdownDemo,
  RandomAvatarDemo,
  RandomAvatarGroupDemo,
  RandomAvatarToneDemo,
  RandomAvatarWorkingDemo,
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
  "random-avatar": <RandomAvatarDemo />,
  "random-avatar-group": <RandomAvatarGroupDemo />,
  "random-avatar-working": <RandomAvatarWorkingDemo />,
  "random-avatar-tones": <RandomAvatarToneDemo />,

  // content
  "code-block": <CodeBlockDemo />,
  "json-tree": <JsonTreeDemo />,
  "json-tree-collapsible": <JsonTreeDemo collapsible />,
  "math-block": <MathBlockDemo />,
  "message-markdown": <MessageMarkdownDemo />,
  reference: <ReferenceDemo />,
  "file-diff-list": <FileDiffDemo />,
  "file-diff-scroll": <FileDiffScrollDemo />,
  "mermaid-diagram": <MermaidDiagramDemo />,

  // agent surfaces
  "conversation-rail": <ConversationRailDemo />,
  "message-scroller": <MessageScrollerDemo />,
  message: <MessageDemo />,
  "message-streaming": <MessageStreamDemo />,
  "message-rich-streaming": <MessageRichStreamDemo />,
  "tool-call": <ToolCallDemo />,
  "tool-call-states": <ToolCallStatesDemo />,
  "tool-approval": <ToolApprovalDemo />,
  "tool-approval-flow": <ToolApprovalFlowDemo />,
  "tool-approval-notch": <ToolApprovalNotchDemo />,
  "tool-approval-mobile": <ToolApprovalMobileDemo />,
  "chat-composer": <ChatComposerDemo />,
  "chat-composer-full": <ChatComposerFullDemo />,
  "chat-composer-inline": <ChatComposerInlineDemo />,
  "composer-queue": <ComposerQueueDemo />,
  "model-picker": <ModelPickerDemo />,
  "selection-tooltip": <SelectionTooltipDemo />,
  "selection-tooltip-shelf": <SelectionTooltipShelfDemo />,

  // harness
  "agent-harness": <AgentHarness />,

  // composites
  "event-calendar": <EventCalendarDemo />,
  "gantt-chart": <GanttChartDemo />,
  "gantt-chart-planning": <GanttChartPlanningDemo />,
  kanban: <KanbanDemo />,
  "split-view": <SplitViewDemo />,
  "split-view-workspace": <SplitViewWorkspaceDemo />,
  "workflow-canvas": <WorkflowCanvasDemo />,
  "workflow-canvas-nested": <WorkflowCanvasNestedDemo />,
  "workflow-canvas-palette": <WorkflowCanvasPaletteDemo />,
};
