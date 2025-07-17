'use client';

import { useEffect } from 'react';
import { useRegisterEvents, useSigma } from '@react-sigma/core';
import { Node } from '@/hooks/useSkillsGraph';

interface GraphEventsProps {
  onNodeClick: (nodeId: string) => void;
  onNodeHover: (node: Node | null) => void;
}

export default function GraphEvents({ onNodeClick, onNodeHover }: GraphEventsProps) {
  const registerEvents = useRegisterEvents();
  const sigma = useSigma();
  
  useEffect(() => {
    // Register click event
    registerEvents({
      clickNode: (event: { node: string }) => {
        onNodeClick(event.node);
      },
      enterNode: (event: { node: string }) => {
        const graph = sigma.getGraph();
        const node = graph.getNodeAttributes(event.node);
        onNodeHover(node as Node);
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
}
