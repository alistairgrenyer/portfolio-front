// Type definitions for Graph components

import { Node } from '@/hooks/useSkillsGraph';

export interface GraphEventsProps {
  onNodeClick: (nodeId: string) => void;
  onNodeHover: (node: Node | null) => void;
}

export interface GraphInitializerProps {
  graphData: {
    nodes: Node[];
    edges: any[];
  };
}
