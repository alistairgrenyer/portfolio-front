'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';

// Graph libraries
import Graph from 'graphology';
import { GraphData } from '@/hooks/useSkillsGraph';

// Component interfaces
interface SkillsGraphProps {
  className?: string;
  graphData?: GraphData;
  collapsedCategories?: Record<string, boolean>;
  toggleCategory?: (categoryId: string) => void;
}

// Load sigma styles globally
import '@react-sigma/core/lib/style.css';

// Dynamically import Sigma components with SSR disabled
const SigmaContainer = dynamic(
  () => import('@react-sigma/core').then(mod => mod.SigmaContainer),
  { ssr: false }
);
const ControlsContainer = dynamic(
  () => import('@react-sigma/core').then(mod => mod.ControlsContainer),
  { ssr: false }
);
const ZoomControl = dynamic(
  () => import('@react-sigma/core').then(mod => mod.ZoomControl),
  { ssr: false }
);
const FullScreenControl = dynamic(
  () => import('@react-sigma/core').then(mod => mod.FullScreenControl),
  { ssr: false }
);

export default function SkillsGraph({ className = '' }: SkillsGraphProps) {
  // Read colors straight from CSS vars—no JS fallbacks at all
  const colors = useMemo(() => {
    const s = getComputedStyle(document.documentElement);
    return {
      background:      s.getPropertyValue('--color-bg').trim(),
      border:          s.getPropertyValue('--color-border').trim(),
      categoryNode:    s.getPropertyValue('--color-accent').trim(),
      skillNode:       s.getPropertyValue('--color-accent-light').trim(),
      edge:            s.getPropertyValue('--color-accent-dark').trim(),
      labelCategory:   s.getPropertyValue('--color-highlight-other').trim(),
      labelSkill:      s.getPropertyValue('--color-highlight-other').trim(),
    };
  }, []);

  // Build graph exactly as before
  const graph = useMemo(() => {
    const g = new Graph();
    g.addNode('A', {
      x: 0, y: 0, label: 'Category A', size: 20,
      color: colors.categoryNode,
      labelColor: colors.labelCategory,
      nodeType: 'category',
      highlighted: true,
    });
    g.addNode('B', {
      x: 1, y: 1, label: 'Skill B', size: 15,
      color: colors.skillNode,
      labelColor: colors.labelSkill,
      nodeType: 'skill',
    });
    g.addNode('C', {
      x: 0.5, y: 2, label: 'Skill C', size: 15,
      color: colors.skillNode,
      labelColor: colors.labelSkill,
      nodeType: 'skill',
    });
    g.addEdge('A', 'B', { size: 2, color: colors.edge });
    g.addEdge('B', 'C', { size: 2, color: colors.edge });
    g.addEdge('C', 'A', { size: 2, color: colors.edge });
    return g;
  }, [colors]);

  // Settings unchanged
  const settings = useMemo(
    () => ({
      defaultNodeColor: colors.skillNode,
      defaultEdgeColor: colors.edge,
      defaultNodeType: 'circle' as const,
      defaultEdgeType: 'line' as const,

      backgroundColor: colors.background,
      stagePadding: 30,

      renderLabels: true,
      labelThreshold: 0,
      labelSize: 14,
      labelWeight: 'bold' as const,
      labelColor: {
        color: colors.labelCategory,
        attribute: 'labelColor',
      },

      nodeColor: { attribute: 'color' },
      edgeColor: { attribute: 'color' },

      allowInvalidContainer: true,
      renderEdgeLabels: false,
      labelDensity: 0.7,
      labelGridCellSize: 60,
      zIndex: true,
    }),
    [colors]
  );

  return (
    <div
      className={`relative ${className}`}
      style={{
        height: '500px',
        width: '100%',
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
      }}
    >
      <SigmaContainer
        graph={graph}
        settings={settings}
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: colors.background,
        }}
      >
        <ControlsContainer position="bottom-right">
          <ZoomControl />
          <FullScreenControl />
        </ControlsContainer>
      </SigmaContainer>
    </div>
  );
}
