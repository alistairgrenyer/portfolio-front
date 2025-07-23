'use client';

import { useEffect, useState } from 'react';
import type { SkillsGraphData, GraphNode } from '../types/skills-graph';
import { apiRequest } from '../config/api';

// Color constants for the mint green theme
const COLORS = {
  ROOT: '#1fd38d',      // Darkest mint green for root
  CATEGORY: '#61e7b9',  // Medium mint green for categories
  SKILL: '#a0f0d3',     // Lightest mint green for skills
};

/**
 * Hook to load and prepare skills graph data with dynamic coloring
 */
export function useSkillsGraph() {
  const [graph, setGraph] = useState<SkillsGraphData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSkillsGraph = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const graphData = await apiRequest<SkillsGraphData>('skillsGraph');
        
        // Apply colors based on node type
        const coloredNodes = (graphData.nodes as GraphNode[]).map(node => ({
          ...node,
          color: node.type === 'root' 
            ? COLORS.ROOT 
            : node.type === 'category' 
              ? COLORS.CATEGORY 
              : COLORS.SKILL
        }));

        // Create the processed graph data
        setGraph({
          nodes: coloredNodes,
          edges: graphData.edges
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchSkillsGraph();
  }, []);

  return {
    graph,
    loading,
    error,
  };
}
