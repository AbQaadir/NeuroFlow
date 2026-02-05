import { DiagramImplementation } from '../types';
import { calculateDimensions } from '../utils';

const COMMON_RULES = `
CRITICAL INSTRUCTION:
You are an incremental update engine. The user will provide a conversation history.
Your job is to return a JSON schema containing ONLY the NEW or MODIFIED nodes and edges based on the user's latest request.
- Do NOT return the entire diagram unless asked to "regenerate" or "start over".
- If the user asks to add a node, return ONLY that node and its edge.
- If the user asks to modify a node, return the updated node.
- To DELETE a node or edge, return it with the property "deleted": true.
- For edges, you must specify "source" and "target" to identify which edge to delete.
- Maintain existing IDs from the history context.
`;

const MINDMAP_INSTRUCTION = `
You are an Expert Information Architect and Mind Map Specialist.
Your goal is to break down complex topics into a clear, hierarchical MIND MAP.

RULES:
1. Structure:
   - EXACTLY ONE 'central' node (The main subject).
   - Multiple 'topic' nodes connecting to the central node (Level 1 branches).
   - Multiple 'subtopic' nodes connecting to topic nodes (Level 2 branches).
   - Optional 'note' nodes for extra context/annotations.
2. Hierarchy is key. Break concepts down from general to specific.
3. Keep labels concise (1-4 words). Use 'description' for details.
4. Node Types: 'central', 'topic', 'subtopic', 'note'.
5. Do NOT use 'parentId'. Use edges to define the hierarchy.
6. Output strictly conforming JSON.
${COMMON_RULES}
`;

export const mindmapDiagram: DiagramImplementation = {
    type: 'mindmap',
    label: 'Mind Map Generator Agent',
    welcomeMessage: "Switched to Mind Mapper. I focus on hierarchical brainstorming and structuring ideas.",
    systemInstruction: MINDMAP_INSTRUCTION,
    getLayoutOptions: (node: any, hasPositions: boolean) => {
        const isGroup = node.children && node.children.length > 0;
        const isRoot = node.id === 'root';

        let options: Record<string, string> = {
            'elk.algorithm': 'mrtree',
            'elk.direction': 'RIGHT',
            'elk.spacing.nodeNode': '60',
            'elk.spacing.edgeNode': '100',
        };

        if (hasPositions) {
            options['elk.algorithm'] = 'layered';
            options['elk.layered.interactive'] = 'true';
            options['elk.layered.incremental'] = 'true';
            options['elk.layered.spacing.nodeNodeBetweenLayers'] = '100';
            options['elk.spacing.nodeNode'] = '60';
        }

        if (isGroup || isRoot) {
            options['elk.hierarchyHandling'] = 'INCLUDE_CHILDREN';
            options['elk.padding'] = '[top=120,left=60,bottom=60,right=60]';
        }

        return options;
    },
    getNodeDimensions: (node: any) => {
        if (node.width && node.height) {
            return { width: node.width, height: node.height };
        }

        const type = node.type || 'topic';
        const label = node.label || '';
        const description = node.description || '';

        switch (type.toLowerCase()) {
            case 'central': return calculateDimensions(label, description, 260, 100);
            case 'topic': return calculateDimensions(label, description, 200, 70);
            case 'subtopic': return calculateDimensions(label, description, 180, 50);
            case 'note': return calculateDimensions(label, description, 160, 140);
            default: return calculateDimensions(label, description, 180, 60);
        }
    },
    getEdgeStyle: () => ({
        pathType: 'bezier',
        strokeWidth: 3,
        stroke: 'var(--primary)'
    }),
    placeholderText: "Topic to brainstorm...",
    loadingText: "Brainstorming..."
};
