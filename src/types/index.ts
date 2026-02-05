export enum NodeType {
    // Architecture
    SERVICE = 'service',
    DATABASE = 'database',
    CLIENT = 'client',
    QUEUE = 'queue',
    EXTERNAL = 'external',
    GROUP = 'group',

    // Flowchart
    START = 'start',
    END = 'end',
    PROCESS = 'process',
    DECISION = 'decision',

    // Mind Map
    CENTRAL = 'central',
    TOPIC = 'topic',
    SUBTOPIC = 'subtopic',
    NOTE = 'note',

    // ER Diagram
    ENTITY = 'entity',

    // Class Diagram
    CLASS = 'class',
    // C4 Diagram
    PERSON = 'person',
    FRAME = 'frame'
}

export type AgentType = 'architect' | 'analyst' | 'mindmap' | 'database' | 'class' | 'c4';

export interface EntityAttribute {
    name: string;
    dataType: string;
    isPK?: boolean;
    isFK?: boolean;
    visibility?: string; // +, -, #
}

export interface ClassMethod {
    name: string;
    returnType: string;
    visibility: string; // +, -, #
}

export interface ArchitectureNode {
    id: string;
    label: string;
    type: NodeType | string;
    parentId?: string;
    description?: string;
    customIcon?: string; // Added for icon persistence

    attributes?: EntityAttribute[];
    methods?: ClassMethod[];
    position?: { x: number; y: number };
    width?: number;
    height?: number;
    deleted?: boolean;

}

export interface ArchitectureEdge {
    source: string;
    target: string;
    label?: string;
    deleted?: boolean;
}

export interface ArchitectureSchema {
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'system';
    content: string;
    timestamp: number;
    imageUrl?: string;
}

export interface HistoryItem {
    role: 'user' | 'model';
    parts: { text: string }[];
}

// React Flow specific types extension
export interface FlowNodeData {
    label: string;
    type: string;
    description?: string;
    customIcon?: string;
    attributes?: EntityAttribute[];
    methods?: ClassMethod[];

}

export * from './deepThink';