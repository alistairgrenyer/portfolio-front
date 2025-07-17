'use client';

import { useEffect, useMemo } from 'react';
import { useLoadGraph, useSigma } from '@react-sigma/core';
import Graph from 'graphology';
import { GraphData } from '@/hooks/useSkillsGraph';

interface GraphInitializerProps {
  graphData: GraphData;
}

export default function GraphInitializer({ graphData }: GraphInitializerProps) {
  const sigma = useSigma();
  const loadGraph = useLoadGraph();
  
  // Create the graph instance only once
  const graph = useMemo(() => {
    // Create an empty graph
    const graph = new Graph();
    
    // Filter out hidden nodes and edges
    const visibleNodes = graphData.nodes.filter(node => !node.hidden);
    const visibleEdges = graphData.edges.filter(edge => !edge.hidden);
    
    // Add nodes
    visibleNodes.forEach(node => {
      graph.addNode(node.id, {
        label: node.label,
        type: node.type,
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
  useEffect(() => {
    loadGraph(graph);
  }, [graph, loadGraph]);
  
  return null;
}
