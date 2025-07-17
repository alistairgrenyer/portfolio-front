'use client';

import React, { useState, useMemo } from 'react';
import { GraphData, Node, CollapsedCategories } from '@/hooks/useSkillsGraph';
import dynamic from 'next/dynamic';

// Use regular imports for Graph type
import Graph from 'graphology';
import { Attributes } from 'graphology-types';

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

// Memoized sigma settings
const sigmaSettings = {
  renderLabels: true,
  defaultNodeColor: '#94a3b8',
  labelSize: 14,
  labelWeight: 'bold',
  minCameraRatio: 0.1,
  maxCameraRatio: 10,
  nodeProgramClasses: {},
  // Allow rendering even if container has no height initially
  allowInvalidContainer: true,
  // Debounce resize to help with initialization issues
  hideEdgesOnMove: true,
  nodeReducer: (node: string, data: any) => {
    const res = { ...data };
    
    // Make category nodes larger
    if (data.type === 'category') {
      res.size = 15;
      res.color = '#4f46e5'; // Indigo
      res.labelSize = 16;
    } else {
      res.size = 8;
      res.color = '#94a3b8'; // Slate
      res.labelSize = 12;
    }
    
    return res;
  },
  edgeReducer: (edge: string, data: any) => {
    const res = { ...data };
    res.color = '#94a3b8';
    res.size = 2;
    return res;
  }
};

interface SkillsGraphProps {
  graphData: GraphData;
  collapsedCategories: CollapsedCategories;
  toggleCategory: (categoryId: string) => void;
  className?: string;
}

// Simple tooltip component for Sigma graph
interface TooltipProps {
  node: Node | null;
  collapsedCategories: CollapsedCategories;
}

const Tooltip: React.FC<TooltipProps> = ({ node, collapsedCategories }) => {
  if (!node) return null;
  
  return (
    <div 
      className="absolute p-2 bg-surface dark:bg-surface-dark rounded shadow-md z-10 text-sm text-primary dark:text-primary-dark"
      style={{
        left: '20px',
        top: '20px',
        pointerEvents: 'none'
      }}
    >
      <div className="font-semibold">{node.label}</div>
      <div className="text-xs opacity-70">{node.type}</div>
      {node.type === 'category' && (
        <div className="text-xs mt-1">Click to {collapsedCategories[node.id] ? 'expand' : 'collapse'}</div>
      )}
    </div>
  );
};

// Event handlers component
const GraphEvents = dynamic(
  () => import('@react-sigma/core').then(mod => {
    // Create a component that uses Sigma hooks
    const EventsComponent = ({ onNodeClick, onNodeHover }: {
      onNodeClick: (nodeId: string) => void;
      onNodeHover: (node: Node | null) => void;
    }) => {
      const registerEvents = mod.useRegisterEvents();
      const sigma = mod.useSigma();
      
      // Register events on mount
      React.useEffect(() => {
        registerEvents({
          clickNode: (event: { node: string }) => {
            onNodeClick(event.node);
          },
          enterNode: (event: { node: string }) => {
            const graph = sigma.getGraph();
            const nodeAttrs = graph.getNodeAttributes(event.node);
            // Convert sigma node attributes to our Node type
            const node = {
              id: event.node,
              label: nodeAttrs.label,
              type: nodeAttrs.nodeType, // Use stored nodeType for our type field
              x: nodeAttrs.x,
              y: nodeAttrs.y,
              size: nodeAttrs.size,
              color: nodeAttrs.color,
              hidden: false
            } as Node;
            onNodeHover(node);
            // Change cursor
            sigma.getContainer().style.cursor = 'pointer';
          },
          leaveNode: () => {
            onNodeHover(null);
            // Reset cursor
            sigma.getContainer().style.cursor = 'default';
          }
        });
        
        // Cleanup events on unmount
        return () => {
          registerEvents({});
        };
      }, [registerEvents, sigma, onNodeClick, onNodeHover]);
      
      return null;
    };
    
    return { default: EventsComponent };
  }),
  { ssr: false }
);

// Graph initialization component
const GraphInitializer = dynamic(
  () => import('@react-sigma/core').then(mod => {
    // Create a component that initializes the graph
    const InitializerComponent = ({ graphData }: { graphData: GraphData }) => {
      const sigma = mod.useSigma();
      const loadGraph = mod.useLoadGraph();
      
      // Create the graph instance only once using useMemo
      const graph = React.useMemo(() => {
        const graph = new Graph();
        
        // Filter out hidden nodes and edges
        const visibleNodes = graphData.nodes.filter(node => !node.hidden);
        const visibleEdges = graphData.edges.filter(edge => !edge.hidden);
        
        // Add nodes
        visibleNodes.forEach(node => {
          // Store node type as custom attribute but don't use as type
          graph.addNode(node.id, {
            label: node.label,
            nodeType: node.type, // Store as custom attribute instead of type
            x: node.x || Math.random(),
            y: node.y || Math.random(),
            size: node.size || (node.type === 'category' ? 15 : 8),
            color: node.color || (node.type === 'category' ? '#4f46e5' : '#94a3b8')
          });
        });
        
        // Add edges
        visibleEdges.forEach(edge => {
          if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
            graph.addEdge(edge.source, edge.target, {
              id: edge.id,
              relationship: edge.relationship
            });
          }
        });
        
        return graph;
      }, [graphData]);
      
      // Load the graph into sigma only once
      React.useEffect(() => {
        loadGraph(graph);
      }, [graph, loadGraph]);
      
      return null;
    };
    
    return { default: InitializerComponent };
  }),
  { ssr: false }
);

export default function SkillsGraph({ 
  graphData, 
  collapsedCategories, 
  toggleCategory,
  className = ''
}: SkillsGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    if (!graphData) return;
    
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (node?.type === 'category') {
      toggleCategory(nodeId);
    }
  };
  
  // Memoize the processed graph data to avoid re-renders
  const processedData = useMemo(() => {
    if (!graphData) return null;
    
    // Create modified data with hidden nodes removed based on collapsedCategories
    const modifiedData = { ...graphData };
    
    // Hide skill nodes connected to collapsed categories
    modifiedData.nodes = modifiedData.nodes.map(node => {
      // For skill nodes, check if they're connected to a collapsed category
      if (node.type === 'skill') {
        const connectedCategoryEdge = modifiedData.edges.find(
          edge => edge.target === node.id
        );
        
        if (connectedCategoryEdge && collapsedCategories[connectedCategoryEdge.source]) {
          return { ...node, hidden: true };
        }
      }
      
      return node;
    });
    
    return modifiedData;
  }, [graphData, collapsedCategories]);
  
  // Graph container component
  const GraphContainer = useMemo(() => {
    if (!processedData) return null;
    
    return (
      <SigmaContainer 
        className="w-full h-full rounded-xl shadow-md border border-surface dark:border-surface-dark"
        style={{ height: '100%', minHeight: '400px' }}
        settings={sigmaSettings}
      >
        {/* Initialize the graph */}
        <GraphInitializer graphData={processedData} />
        
        {/* Register event handlers */}
        <GraphEvents 
          onNodeClick={handleNodeClick}
          onNodeHover={setHoveredNode}
        />
        
        {/* Controls */}
        <ControlsContainer position="bottom-right">
          <ZoomControl />
          <FullScreenControl />
        </ControlsContainer>
      </SigmaContainer>
    );
  }, [processedData, handleNodeClick]);
  
  if (!graphData || !processedData) return null;
  
  return (
    <div 
      className={`relative ${className}`} 
      style={{ height: 'min(70vh, 600px)', minHeight: '500px' }}
    >
      {/* Graph container */}
      {GraphContainer}
      
      {/* Tooltip */}
      <Tooltip node={hoveredNode} collapsedCategories={collapsedCategories} />
    </div>
  );
}
