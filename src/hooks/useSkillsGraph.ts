'use client';

import { useState, useEffect } from 'react';

export interface Node {
  id: string;
  label: string;
  type: 'category' | 'skill';
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  hidden?: boolean;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  relationship?: string;
  hidden?: boolean;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

export interface CollapsedCategories {
  [categoryId: string]: boolean;
}

export const useSkillsGraph = (url: string = '/graph.json') => {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [collapsedCategories, setCollapsedCategories] = useState<CollapsedCategories>({});

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch graph data: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Initialize node properties
        const processedData: GraphData = {
          nodes: data.nodes.map((node: Node) => ({
            ...node,
            size: node.type === 'category' ? 15 : 8,
            color: node.type === 'category' ? '#4f46e5' : '#94a3b8',
            hidden: false
          })),
          edges: data.edges.map((edge: Edge, index: number) => ({
            ...edge,
            id: edge.id || `e${index}`,
            hidden: false
          }))
        };
        
        setGraphData(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [url]);

  // Toggle visibility of skills connected to a category
  const toggleCategory = (categoryId: string) => {
    if (!graphData) return;

    const isCollapsed = !collapsedCategories[categoryId];
    
    // Update collapsed state
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: isCollapsed
    }));

    // Find all connected skill nodes
    const connectedSkills = graphData.edges
      .filter(edge => edge.source === categoryId)
      .map(edge => edge.target);

    // Update visibility
    setGraphData(prev => {
      if (!prev) return prev;

      return {
        nodes: prev.nodes.map(node => {
          if (connectedSkills.includes(node.id) && node.type === 'skill') {
            return { ...node, hidden: isCollapsed };
          }
          return node;
        }),
        edges: prev.edges.map(edge => {
          if (edge.source === categoryId) {
            return { ...edge, hidden: isCollapsed };
          }
          return edge;
        })
      };
    });
  };

  // Filter/search nodes by label
  const filterNodes = (searchTerm: string) => {
    if (!graphData || !searchTerm.trim()) {
      // Reset if search is empty
      setGraphData(prev => {
        if (!prev) return prev;
        return {
          nodes: prev.nodes.map(node => ({
            ...node,
            hidden: collapsedCategories[node.id] ? true : false
          })),
          edges: prev.edges
        };
      });
      return;
    }

    const term = searchTerm.toLowerCase();
    const matchingNodes = new Set<string>();
    
    // Find nodes matching search term
    graphData.nodes.forEach(node => {
      if (node.label.toLowerCase().includes(term)) {
        matchingNodes.add(node.id);
        
        // For skills, also include their category
        if (node.type === 'skill') {
          graphData.edges.forEach(edge => {
            if (edge.target === node.id) {
              matchingNodes.add(edge.source);
            }
          });
        }
        
        // For categories, also include connected skills
        if (node.type === 'category') {
          graphData.edges.forEach(edge => {
            if (edge.source === node.id) {
              matchingNodes.add(edge.target);
            }
          });
        }
      }
    });

    // Update visibility based on search
    setGraphData(prev => {
      if (!prev) return prev;
      
      return {
        nodes: prev.nodes.map(node => ({
          ...node,
          hidden: !matchingNodes.has(node.id)
        })),
        edges: prev.edges.map(edge => ({
          ...edge,
          hidden: !matchingNodes.has(edge.source) || !matchingNodes.has(edge.target)
        }))
      };
    });
  };

  return {
    graphData,
    loading,
    error,
    collapsedCategories,
    toggleCategory,
    filterNodes
  };
};
