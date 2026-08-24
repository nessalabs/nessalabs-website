"use client";

import * as React from "react";
import { cn } from "@/lib/cn";

export interface CanvasNode {
  id: string;
  x: number;
  y: number;
  title: string;
  subtitle?: string;
}

export interface CanvasEdge {
  from: string;
  to: string;
}

export interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: CanvasNode[];
  edges?: CanvasEdge[];
  onNodesChange?: (nodes: CanvasNode[]) => void;
  /** Show the dotted background grid. */
  grid?: boolean;
}

const NODE_W = 168;
const NODE_H = 64;

/**
 * Pan-and-zoom node canvas. Drag the background to pan, drag a node to move it,
 * scroll to zoom. Edges are drawn as SVG curves between node centres.
 */
export function Canvas({
  nodes,
  edges = [],
  onNodesChange,
  grid = true,
  className,
  ...props
}: CanvasProps) {
  const [internal, setInternal] = React.useState(nodes);
  const current = onNodesChange ? nodes : internal;

  const [view, setView] = React.useState({ x: 0, y: 0, scale: 1 });
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
    } else {
      update(
        current.map((node) =>
          node.id === state.id
            ? {
                ...node,
                x: state.originX + dx / view.scale,
                y: state.originY + dy / view.scale,
              }
            : node
        )
      );
    }
  }

  function endDrag() {
    drag.current = null;
  }

  const byId = React.useMemo(
    () => new Map(current.map((node) => [node.id, node])),
    [current]
  );

  return (
    <div
      className={cn(
        "relative h-80 touch-none overflow-hidden rounded-xl border border-line bg-surface",
        className
      )}
      onPointerDown={(e) => {
        if (e.target !== e.currentTarget) return;
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
      onWheel={(e) => {
        const scale = Math.min(2, Math.max(0.4, view.scale - e.deltaY * 0.002));
        setView((v) => ({ ...v, scale }));
      }}
      {...props}
    >
      {grid ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
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
            const x1 = a.x + NODE_W;
            const y1 = a.y + NODE_H / 2;
            const x2 = b.x;
            const y2 = b.y + NODE_H / 2;
            const mid = (x1 + x2) / 2;
            return (
              <path
                key={`${edge.from}-${edge.to}`}
                d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke="var(--color-dim)"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {current.map((node) => (
          <div
            key={node.id}
            onPointerDown={(e) => {
              e.stopPropagation();
              (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
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
              width: NODE_W,
              height: NODE_H,
            }}
            className="absolute cursor-grab rounded-lg border border-line bg-ink px-3 py-2 shadow-sm active:cursor-grabbing"
          >
            <div className="truncate text-sm text-fg">{node.title}</div>
            {node.subtitle ? (
              <div className="truncate text-xs text-dim">{node.subtitle}</div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-lg border border-line bg-ink px-2 py-1 text-xs text-dim">
        {Math.round(view.scale * 100)}%
        <button
          type="button"
          onClick={() => setView({ x: 0, y: 0, scale: 1 })}
          className="ml-1 rounded px-1 transition-colors hover:bg-raised hover:text-fg"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
