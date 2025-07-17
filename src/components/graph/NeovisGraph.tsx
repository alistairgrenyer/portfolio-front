'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import { useSkillsGraph } from '@/hooks/useSkillsGraph';
import type { GraphNode, GraphEdge } from '@/types/skills-graph';

/* ─── Font styles for different node types ───────────────────────────── */
const NODE_STYLES = {
  root: { shape: 'box', font: { size: 24, bold: true, color: '#ffffff' } },
  category: { shape: 'box', font: { size: 18, bold: true, color: '#ffffff' } },
  skill: { shape: 'ellipse', font: { size: 14, color: '#ffffff' } }
};

/* ─── Component ───────────────────────────────────────────────────────── */
export default function SkillsGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef   = useRef<Network | null>(null);
  const [scale, setScale] = useState(1);           // live zoom value
  const [isFull, setIsFull] = useState(false);     // fullscreen state
  const { graph, loading } = useSkillsGraph();     // get dynamic graph data

  /* 1. Initialise Vis network once ------------------------------------ */
  useEffect(() => {
    if (!containerRef.current || !graph) return;

    // Convert graph data to vis-network format with styling
    const visNodes = graph.nodes.map(node => ({
      id: node.id,
      label: node.label,
      color: node.color,
      ...(NODE_STYLES[node.type] || {})
    }));

    const visEdges = graph.edges.map((edge, idx) => ({
      id: idx,
      from: edge.from,
      to: edge.to
    }));

    const net = new Network(
      containerRef.current,
      { nodes: visNodes, edges: visEdges },
      { 
        physics: { 
          stabilization: true,
          solver: 'forceAtlas2Based',
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springLength: 100,
            springConstant: 0.08
          }
        }, 
        interaction: { zoomView: false } // we'll handle zoom
      }
    );
    
    networkRef.current = net;

    // fit once stabilised
    net.once('stabilized', () => {
      net.fit({ animation: { duration: 300 } });
      setScale(net.getScale());
    });

    // update scale on user wheel‑zoom / pinch
    net.on('zoom', ({ scale }) => setScale(scale));

    return () => net.destroy();
  }, [graph]);

  /* 2. Helpers --------------------------------------------------------- */
  const zoomBy = useCallback((factor: number) => {
    const net = networkRef.current;
    if (!net) return;
    const view = net.getViewPosition();
    const opts = { animation: { duration: 300, easingFunction: 'easeInOutQuad' } };
    net.moveTo({ position: view, scale: scale * factor, ...opts });
  }, [scale]);

  const resetView = useCallback(() => {
    networkRef.current?.fit({ animation: { duration: 300 } });
  }, []);

  const toggleFull = useCallback(() => {
    const el = containerRef.current?.parentElement; // outer wrapper
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      setIsFull(true);
    } else {
      document.exitFullscreen?.();
      setIsFull(false);
    }
  }, []);

  /* 3. UI -------------------------------------------------------------- */
  return (
    <div className="relative w-full h-[500px] border border-slate-700 rounded-lg">
      {/* graph canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <button
          onClick={() => zoomBy(1.2)}
          className="rounded bg-slate-800/80 hover:bg-slate-700 p-2 text-white"
          title="Zoom In"
        >＋</button>

        <button
          onClick={() => zoomBy(1 / 1.2)}
          className="rounded bg-slate-800/80 hover:bg-slate-700 p-2 text-white"
          title="Zoom Out"
        >－</button>

        <button
          onClick={resetView}
          className="rounded bg-slate-800/80 hover:bg-slate-700 p-2 text-white"
          title="Reset View"
        >🏠</button>

        <button
          onClick={toggleFull}
          className="rounded bg-slate-800/80 hover:bg-slate-700 p-2 text-white"
          title={isFull ? 'Exit Full Screen' : 'Full Screen'}
        >{isFull ? '⧉' : '⬜'}</button>
      </div>
    </div>
  );
}
