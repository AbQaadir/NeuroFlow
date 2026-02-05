import { Node, Edge } from '@xyflow/react';
import { ArchitectureSchema, AgentType } from '../types';
import { getDiagram } from '../diagrams';
import { calculateMindMapLayout } from './layout/mindmapLayout';
import { calculateArchitectureLayout } from './layout/architectureLayout';

export const calculateLayout = async (schema: ArchitectureSchema, agent: AgentType): Promise<{ nodes: Node[], edges: Edge[] }> => {
  const diagramImpl = getDiagram(agent);

  if (agent === 'mindmap') {
    return calculateMindMapLayout(schema, diagramImpl);
  }

  // Default to architecture layout for all other types (architect, database, etc.)
  return calculateArchitectureLayout(schema, diagramImpl);
};