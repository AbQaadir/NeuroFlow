import { AgentType } from '../types';
import { DiagramImplementation } from './types';
import { architectureDiagram } from './architecture';
import { flowchartDiagram } from './flowchart';
import { mindmapDiagram } from './mindmap';
import { databaseDiagram } from './database';
import { classDiagram } from './class';
import { c4Diagram } from './c4';

const registry: Record<AgentType, DiagramImplementation> = {
    architect: architectureDiagram,
    analyst: flowchartDiagram,
    mindmap: mindmapDiagram,
    database: databaseDiagram,
    class: classDiagram,
    c4: c4Diagram
};

export const getDiagram = (type: AgentType): DiagramImplementation => {
    return registry[type] || architectureDiagram;
};

export const getAllDiagrams = (): DiagramImplementation[] => {
    return Object.values(registry);
};

export * from './types';
