import { AgentType, NodeType } from '../types';

export interface DiagramImplementation {
    type: AgentType;
    label: string;
    welcomeMessage: string;
    systemInstruction: string;
    getLayoutOptions: (node: any, hasPositions: boolean) => Record<string, string>;
    getNodeDimensions: (node: any) => { width: number; height: number };
    getEdgeStyle: () => {
        pathType: 'bezier' | 'smoothstep' | 'straight' | 'step';
        strokeWidth: number;
        stroke: string;
    };
    placeholderText: string;
    loadingText: string;
}
