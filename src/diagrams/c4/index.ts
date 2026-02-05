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

const C4_INSTRUCTION = `
You are a C4 Model Expert.
Your goal is to define the Software Architecture using the C4 model (Context, Containers, Components, Code).

RULES:
1.  **Node Types**:
    -   'person': A user of the system.
    -   'system': A software system (highest level).
    -   'container': A container (app, database, file system) within a system.
    -   'component': A component within a container.
    -   'frame': Use 'frame' type to represent System Boundaries or Container Boundaries.
    -   'database': Specific type for DB containers.

2.  **Hierarchy**:
    -   Use 'parentId' to nest Containers inside System Boundaries.
    -   Use 'parentId' to nest Components inside Container Boundaries.

3.  **Relationships**:
    -   Label edges with clear descriptions (e.g., "Uses", "Sends emails to").
    -   Direction is important (Source -> Target).

4.  **Output strictly conforming JSON.**
${COMMON_RULES}
`;

export const c4Diagram: DiagramImplementation = {
    type: 'c4',
    label: 'C4 Model Generator Agent',
    welcomeMessage: "Switched to C4 Model Generator Agent. I can help you design Context, Container, and Component diagrams.",
    systemInstruction: C4_INSTRUCTION,
    getLayoutOptions: (node: any, hasPositions: boolean) => {
        const isGroup = node.children && node.children.length > 0;
        const isRoot = node.id === 'root';

        const options: Record<string, string> = {
            'elk.algorithm': 'layered',
            'elk.direction': 'RIGHT',
            'elk.layered.spacing.nodeNodeBetweenLayers': '600', // Increased by 3x (was 200)
            'elk.spacing.nodeNode': '480', // Increased by 3x (was 160)
        };

        if (hasPositions) {
            options['elk.layered.interactive'] = 'true';
            options['elk.layered.incremental'] = 'true';
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

        const type = node.type ? node.type.toLowerCase() : 'system';
        const label = node.label || '';
        const description = node.description || '';

        switch (type) {
            case 'person': return calculateDimensions(label, description, 180, 160); // Larger for Person visual
            case 'system': return calculateDimensions(label, description, 160, 120);
            case 'container': return calculateDimensions(label, description, 160, 120);
            case 'component': return calculateDimensions(label, description, 160, 120);
            case 'database': return calculateDimensions(label, description, 140, 140);
            case 'frame': return { width: undefined as any, height: undefined as any }; // Frame auto-sizes
            case 'group': return { width: undefined as any, height: undefined as any };
            default: return calculateDimensions(label, description, 160, 100);
        }
    },
    getEdgeStyle: () => ({
        pathType: 'bezier',
        strokeWidth: 2,
        stroke: 'var(--primary)'
    }),
    placeholderText: "Describe your C4 model ...",
    loadingText: "Modeling Architecture..."
};
