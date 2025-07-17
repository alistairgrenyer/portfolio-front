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

// Main SkillsGraph component
export default function SkillsGraph({ className = '' }: SkillsGraphProps) {
  // Define explicit colors for the graph
  const colors = useMemo(() => ({
    // Canvas
    background: '#0d1118', // Dark background
    border: '#2c3645',    // Border color
    
    // Nodes
    categoryNode: '#1fd38d', // Bright mint for category nodes
    skillNode: '#61e7b9',   // Light mint for skill nodes
    
    // Edges
    edge: '#189d6d',        // Darker mint for edges
    
    // Labels
    labelCategory: '#ffffff', // White for category labels
    labelSkill: '#f2f2f2',   // Off-white for skill labels
  }), []);

  // Create a simple test graph with explicit colors
  const graph = useMemo(() => {
    const g = new Graph();
    
    // Add test nodes with explicit positions using direct hex colors
    // Category node (larger)
    g.addNode('A', { 
      x: 0, 
      y: 0, 
      label: 'Category A',
      size: 20, 
      color: colors.categoryNode,   // Bright mint
      labelColor: colors.labelCategory,  // White
      nodeType: 'category',
      highlighted: true
    });
    
    // Skill nodes (smaller)
    g.addNode('B', { 
      x: 1, 
      y: 1, 
      label: 'Skill B', 
      size: 15, 
      color: colors.skillNode,      // Light mint
      labelColor: colors.labelSkill,    // Off-white
      nodeType: 'skill'
    });
    
    g.addNode('C', { 
      x: 0.5, 
      y: 2, 
      label: 'Skill C', 
      size: 15, 
      color: colors.skillNode,      // Light mint
      labelColor: colors.labelSkill,    // Off-white
      nodeType: 'skill'
    });
    
    // Add edges between nodes with explicit colors
    g.addEdge('A', 'B', { size: 2, color: colors.edge });
    g.addEdge('B', 'C', { size: 2, color: colors.edge });
    g.addEdge('C', 'A', { size: 2, color: colors.edge });
    
    return g;
  }, [colors]);
  
  // Memoize sigma settings with explicit colors
  const settings = useMemo(() => ({
    // Canvas styling
    defaultNodeColor: colors.skillNode,
    defaultEdgeColor: colors.edge,
    defaultNodeType: 'circle',
    defaultEdgeType: 'line',
    
    // Canvas environment
    backgroundColor: colors.background,
    stagePadding: 30,
    
    // Label settings
    renderLabels: true,
    labelThreshold: 0,
    labelSize: 14,
    labelWeight: 'bold',
    labelColor: { 
      color: colors.labelCategory,
      attribute: 'labelColor'
    },
    
    // Node & edge attributes
    nodeColor: { attribute: 'color' },
    edgeColor: { attribute: 'color' },
    
    // Misc settings
    allowInvalidContainer: true,
    renderEdgeLabels: false,
    labelDensity: 0.7,
    labelGridCellSize: 60,
    zIndex: true,
  }), [colors]);
  
  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        height: '500px', 
        width: '100%', 
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`
      }}
    >
      <SigmaContainer 
        graph={graph}
        settings={settings}
        style={{ 
          height: '100%', 
          width: '100%',
          backgroundColor: colors.background  // Set background color directly on container
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
