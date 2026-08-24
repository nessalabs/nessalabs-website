"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface CanvasNode {
  id: string;
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  /** Free-form payload for renderNode. */
  data?: Record<string, unknown>;
  width?: number;
  height?: number;
}

export interface CanvasEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

export interface CanvasProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  nodes: CanvasNode[];
  edges?: CanvasEdge[];
  onNodesChange?: (nodes: CanvasNode[]) => void;
  onSelect?: (id: string | null) => void;
  /**
   * Full control of node appearance. The canvas keeps owning drag, zoom, pan,
   * selection and edge routing — this only decides what a node looks like.
   */
  renderNode?: (
    node: CanvasNode,
    state: { selected: boolean; dragging: boolean }
  ) => React.ReactNode;
  /** Snap dragged nodes to this pixel grid. 0 disables snapping. */
  snap?: number;
  grid?: boolean;
  minZoom?: number;
  maxZoom?: number;
  classNames?: {
    root?: string;
    node?: string;
    edge?: string;
    controls?: string;
  };
}

const DEFAULT_W = 176;
const DEFAULT_H = 68;

/**
 * Pan-and-zoom node canvas: drag the background to pan, drag nodes to move them,
 * scroll to zoom, click to select. Node rendering is fully overridable, so the
 * component supplies the interaction model and you supply the look.
 */
export function Canvas({
  nodes,
  edges = [],
  onNodesChange,
  onSelect,
  renderNode,
  snap = 0,
  grid = true,
  minZoom = 0.4,
  maxZoom = 2,
  classNames,
  className,
  ...props
}: CanvasProps) {
  const [internal, setInternal] = React.useState(nodes);
  const current = onNodesChange ? nodes : internal;

  const [view, setView] = React.useState({ x: 0, y: 0, scale: 1 });
  const [selected, setSelected] = React.useState<string | null>(null);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);

  const drag = React.useRef<
    | { type: "pan"; startX: number; startY: number; originX: number; originY: number }
    | { type: "node"; id: string; startX: number; startY: number; originX: number; originY: number }
    | null
  >(null);

  function update(next: CanvasNode[]) {
    if (onNodesChange) onNodesChange(next);
    else setInternal(next);
  }

  function onPointerMove(e: React.PointerEvent) {
    const state = drag.current;
    if (!state) return;
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    if (state.type === "pan") {
      setView((v) => ({ ...v, x: state.originX + dx, y: state.originY + dy }));
      return;
    }

    const raw = {
      x: state.originX + dx / view.scale,
      y: state.originY + dy / view.scale,
    };
    const pos = snap
      ? { x: Math.round(raw.x / snap) * snap, y: Math.round(raw.y / snap) * snap }
      : raw;

    update(
      current.map((node) => (node.id === state.id ? { ...node, ...pos } : node))
    );
  }

  function endDrag() {
    drag.current = null;
    setDraggingId(null);
  }

  function select(id: string | null) {
    setSelected(id);
    onSelect?.(id);
  }

  const byId = React.useMemo(
    () => new Map(current.map((node) => [node.id, node])),
    [current]
  );

  function zoomTo(scale: number) {
    setView((v) => ({ ...v, scale: clamp(scale, minZoom, maxZoom) }));
  }

  function fit() {
    setView({ x: 0, y: 0, scale: 1 });
  }

  return (
    <div
      className={cn(
        "relative h-96 touch-none overflow-hidden rounded-xl border border-line bg-surface",
        classNames?.root,
        className
      )}
      onPointerDown={(e) => {
        if (e.target !== e.currentTarget) return;
        select(null);
        drag.current = {
          type: "pan",
          startX: e.clientX,
          startY: e.clientY,
          originX: view.x,
          originY: view.y,
        };
      }}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onWheel={(e) => zoomTo(view.scale - e.deltaY * 0.002)}
      {...props}
    >
      {grid ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: `${24 * view.scale}px ${24 * view.scale}px`,
            backgroundPosition: `${view.x}px ${view.y}px`,
            color: "var(--color-line)",
          }}
        />
      ) : null}

      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
        }}
      >
        <svg
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
          width="1"
          height="1"
        >
          {edges.map((edge) => {
            const a = byId.get(edge.from);
            const b = byId.get(edge.to);
            if (!a || !b) return null;
            const x1 = a.x + (a.width ?? DEFAULT_W);
            const y1 = a.y + (a.height ?? DEFAULT_H) / 2;
            const x2 = b.x;
            const y2 = b.y + (b.height ?? DEFAULT_H) / 2;
            const mid = (x1 + x2) / 2;
            const active = selected === edge.from || selected === edge.to;
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={active ? "var(--color-fg)" : "var(--color-dim)"}
                  strokeWidth={active ? 2 : 1.5}
                  strokeDasharray={edge.dashed ? "5 4" : undefined}
                  className={classNames?.edge}
                />
                {edge.label ? (
                  <text
                    x={mid}
                    y={(y1 + y2) / 2 - 6}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--color-dim)"
                  >
                    {edge.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>

        {current.map((node) => {
          const isSelected = selected === node.id;
          const isDragging = draggingId === node.id;
          return (
            <div
              key={node.id}
              onPointerDown={(e) => {
                e.stopPropagation();
                (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
                select(node.id);
                setDraggingId(node.id);
                drag.current = {
                  type: "node",
                  id: node.id,
                  startX: e.clientX,
                  startY: e.clientY,
                  originX: node.x,
                  originY: node.y,
                };
              }}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              style={{
                left: node.x,
                top: node.y,
                width: node.width ?? DEFAULT_W,
                minHeight: node.height ?? DEFAULT_H,
              }}
              className={cn(
                "absolute cursor-grab active:cursor-grabbing",
                classNames?.node
              )}
            >
              {renderNode ? (
                renderNode(node, { selected: isSelected, dragging: isDragging })
              ) : (
                <div
                  className={cn(
                    "h-full rounded-lg border bg-ink px-3 py-2 shadow-sm transition-colors",
                    isSelected ? "border-fg" : "border-line"
                  )}
                >
                  <div className="truncate text-sm text-fg">{node.title}</div>
                  {node.subtitle ? (
                    <div className="truncate text-xs text-dim">
                      {node.subtitle}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "absolute bottom-2 right-2 flex items-center gap-0.5 rounded-lg border border-line bg-ink p-0.5 text-xs text-dim",
          classNames?.controls
        )}
      >
        <ControlButton label="Zoom out" onClick={() => zoomTo(view.scale - 0.2)}>
          −
        </ControlButton>
        <span className="w-11 text-center tabular-nums">
          {Math.round(view.scale * 100)}%
        </span>
        <ControlButton label="Zoom in" onClick={() => zoomTo(view.scale + 0.2)}>
          +
        </ControlButton>
        <ControlButton label="Reset view" onClick={fit}>
          Reset
        </ControlButton>
      </div>
    </div>
  );
}

function ControlButton({
  label,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="rounded-md px-2 py-1 transition-colors hover:bg-raised hover:text-fg"
      {...props}
    />
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
