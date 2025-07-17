'use client';

import React, { useState, useEffect } from 'react';
import { GraphData, Node, CollapsedCategories } from '@/hooks/useSkillsGraph';

// Simple custom graph visualization component that doesn't rely on external graph libraries
interface SkillNodeProps {
  node: Node;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const SkillNode: React.FC<SkillNodeProps> = ({ 
  node, 
  isSelected,
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  const isCategory = node.type === 'category';
  const baseClasses = "absolute rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md";
  const sizeClasses = isCategory ? "w-16 h-16 md:w-20 md:h-20 font-semibold" : "w-12 h-12 md:w-14 md:h-14";
  const colorClasses = isCategory 
    ? "bg-indigo-600 dark:bg-indigo-500 text-white" 
    : "bg-slate-400 dark:bg-slate-500 text-white";
  const selectedClasses = isSelected ? "ring-4 ring-accent dark:ring-accent-dark ring-offset-2" : "";
  
  return (
    <div 
      className={`${baseClasses} ${sizeClasses} ${colorClasses} ${selectedClasses}`}
      style={{
        left: `${node.x || 0}%`,
        top: `${node.y || 0}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className="text-xs md:text-sm truncate max-w-full px-1">
        {node.label.length > 10 ? node.label.substring(0, 8) + '...' : node.label}
      </span>
    </div>
  );
};

// Node position calculation helper
type EdgeType = {
  source: string;
  target: string;
  id?: string;
  relationship?: string;
  hidden?: boolean;
};

const calculateNodePositions = (nodes: Node[], edges: EdgeType[]): Node[] => {
  // Place categories in a circle around the center
  const categories = nodes.filter(n => n.type === 'category');
  const skills = nodes.filter(n => n.type === 'skill');
  
  // Position category nodes in a circle
  const radius = 30; // Circle radius as percentage of container
  const centerX = 50;
  const centerY = 50;
  
  categories.forEach((cat, i) => {
    const angle = (i / categories.length) * 2 * Math.PI;
    cat.x = centerX + radius * Math.cos(angle);
    cat.y = centerY + radius * Math.sin(angle);
  });
  
  // For each category, position its connected skills in a smaller circle around it
  skills.forEach(skill => {
    // Find which category this skill belongs to
    const connectedEdge = edges.find(edge => edge.target === skill.id);
    if (!connectedEdge) return;
    
    const category = categories.find(cat => cat.id === connectedEdge.source);
    if (!category) return;
    
    // Position this skill based on its category
    const skillAngle = Math.random() * 2 * Math.PI;
    const skillRadius = 15;
    skill.x = category.x! + skillRadius * Math.cos(skillAngle);
    skill.y = category.y! + skillRadius * Math.sin(skillAngle);
  });
  
  return [...categories, ...skills];
};

interface SkillsGraphProps {
  graphData: GraphData | null;
  collapsedCategories: CollapsedCategories;
  toggleCategory: (nodeId: string) => void;
  className?: string;
}

interface EdgeComponentProps {
  sourceId: string;
  targetId: string;
  hidden?: boolean;
  nodes: Node[];
}

const EdgeComponent: React.FC<EdgeComponentProps> = ({ sourceId, targetId, hidden, nodes }) => {
  if (hidden) return null;
  
  const source = nodes.find(n => n.id === sourceId);
  const target = nodes.find(n => n.id === targetId);
  
  if (!source || !target || !source.x || !source.y || !target.x || !target.y) {
    return null;
  }
  
  return (
    <line 
      x1={`${source.x}%`}
      y1={`${source.y}%`}
      x2={`${target.x}%`}
      y2={`${target.y}%`}
      stroke="#94a3b8"
      strokeWidth="2"
      strokeOpacity="0.5"
    />
  );
};

export default function SkillsGraph({ 
  graphData, 
  collapsedCategories, 
  toggleCategory,
  className = ''
}: SkillsGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);
  const [positionedNodes, setPositionedNodes] = useState<Node[]>([]);

  // Calculate positions for nodes
  useEffect(() => {
    if (graphData?.nodes) {
      setPositionedNodes(calculateNodePositions([...graphData.nodes], [...graphData.edges]));
    }
  }, [graphData]);

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    if (!graphData) return;
    
    const node = graphData.nodes.find(n => n.id === nodeId);
    if (node?.type === 'category') {
      toggleCategory(nodeId);
    }
  };
  
  if (!graphData) return null;
  
  const visibleNodes = positionedNodes.filter(node => !node.hidden);
  const visibleEdges = graphData.edges.filter(edge => !edge.hidden);

  return (
    <div className={`relative ${className}`} style={{ height: 'min(70vh, 600px)' }}>
      <div className="w-full h-full rounded-xl shadow-md border border-surface dark:border-surface-dark bg-white dark:bg-gray-900 overflow-hidden">
        {/* Graph visualization */}
        <svg className="w-full h-full">
          {/* Edges */}
          {visibleEdges.map(edge => (
            <EdgeComponent 
              key={`${edge.source}-${edge.target}`}
              sourceId={edge.source}
              targetId={edge.target}
              hidden={edge.hidden}
              nodes={visibleNodes}
            />
          ))}
        </svg>
        
        {/* Nodes */}
        <div className="absolute inset-0">
          {visibleNodes.map(node => (
            <SkillNode
              key={node.id}
              node={node}
              isSelected={hoveredNode?.id === node.id}
              onClick={() => handleNodeClick(node.id)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
            />
          ))}
        </div>
        
        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-primary dark:text-primary-dark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-primary dark:text-primary-dark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M4.5 12a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Tooltip */}
      {hoveredNode && (
        <div 
          className="absolute p-2 bg-surface dark:bg-surface-dark rounded shadow-md z-10 text-sm pointer-events-none text-primary dark:text-primary-dark"
          style={{
            left: '20px',
            top: '20px'
          }}
        >
          <div className="font-semibold">{hoveredNode.label}</div>
          <div className="text-xs opacity-70">{hoveredNode.type}</div>
          {hoveredNode.type === 'category' && (
            <div className="text-xs mt-1">Click to {collapsedCategories[hoveredNode.id] ? 'expand' : 'collapse'}</div>
          )}
        </div>
      )}
    </div>
  );
}
