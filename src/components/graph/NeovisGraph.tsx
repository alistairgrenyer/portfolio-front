'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { DataSet } from 'vis-data';
import { Network } from 'vis-network/standalone';
import 'vis-network/styles/vis-network.css';
import { useSkillsGraph } from '@/hooks/useSkillsGraph';
import type { GraphNode, GraphEdge } from '@/types/skills-graph';

/* ─── Font styles for different node types ───────────────────────────── */
const NODE_STYLES = {
  root: { 
    shape: 'box', 
    font: { size: 24, bold: 'bold', color: '#000000' },
    borderWidth: 2,
    size: 30,
    shadow: true
  },
  category: { 
    shape: 'box', 
    font: { size: 18, bold: 'bold', color: '#000000' },
    borderWidth: 1,
    size: 25,
    shadow: true
  },
  skill: { 
    shape: 'ellipse', 
    font: { size: 14, color: '#000000' },
    size: 20
  }
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
        interaction: { 
          zoomView: true,  // Enable native zoom for mouse wheel
          navigationButtons: false,  // Hide default navigation buttons
          keyboard: true  // Enable keyboard navigation
        }
      }
    );
    
    networkRef.current = net;

    // fit once stabilised
    net.once('stabilized', () => {
      net.fit({ animation: true });
      setScale(net.getScale());
    });

    // update scale on user wheel‑zoom / pinch
    net.on('zoom', ({ scale }) => setScale(scale));

    return () => net.destroy();
  }, [graph]);

  /* 2. Helpers --------------------------------------------------------- */
  const zoomBy = useCallback((factor: number) => {
    const net = networkRef.current;
    if (!net) return;
    const view = net.getViewPosition();
    const newScale = scale * factor;
    net.moveTo({ 
      position: view, 
      scale: newScale, 
      animation: true
    });
    // Update the scale state after zooming
    setScale(newScale);
  }, [scale]);

  const resetView = useCallback(() => {
    networkRef.current?.fit({ animation: true });
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

  /* 3. UI -------------------------------------------------------------- */
  return (
    <div className="relative w-full h-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] border border-slate-700 rounded-lg">
      {/* graph canvas */}
      <div ref={containerRef} className="w-full h-full" />

      {/* controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <button
          onClick={() => zoomBy(1.2)}
          className="rounded-full bg-blue-400 hover:bg-blue-500 p-2 text-white w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200"
          title="Zoom In"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
        </button>

        <button
          onClick={() => zoomBy(1 / 1.2)}
          className="rounded-full bg-blue-400 hover:bg-blue-500 p-2 text-white w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200"
          title="Zoom Out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
          </svg>
        </button>

        <button
          onClick={resetView}
          className="rounded-full bg-blue-400 hover:bg-blue-500 p-2 text-white w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200"
          title="Reset View"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"/>
          </svg>
        </button>

        <button
          onClick={toggleFull}
          className="rounded-full bg-blue-400 hover:bg-blue-500 p-2 text-white w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200"
          title={isFull ? "Exit Full Screen" : "Full Screen"}
        >
          {isFull ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5zm5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5zM0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zm10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
