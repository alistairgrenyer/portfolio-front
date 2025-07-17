/**
 * Types for the skills graph visualization
 */

export type NodeType = 'root' | 'category' | 'skill';

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  color?: string;  // Optional as it will be dynamically set
}

export interface GraphEdge {
  from: string;
  to: string;
}

export interface SkillsGraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
