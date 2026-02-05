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

const ANALYST_INSTRUCTION = `
You are a Senior Business Process Analyst.
Your goal is to define the FLOW and LOGIC of a business process or algorithm (Flowchart).

RULES:
1. Focus on the sequence of steps and decision points.
2. Node Types: 
   - 'start' (Start point)
   - 'end' (End point)
   - 'process' (Action or Step)
   - 'decision' (Condition or Branch)
   - 'group' (Swimlanes or Phases)
3. Use 'decision' nodes for branching logic (Yes/No, True/False).
4. Output strictly conforming JSON.
${COMMON_RULES}
`;

export const flowchartDiagram: DiagramImplementation = {
    type: 'analyst',
    label: 'Flow Chart Generator Agent',
    welcomeMessage: "Switched to Process Analyst. I focus on flowcharts and decision logic.",
    systemInstruction: ANALYST_INSTRUCTION,
    getLayoutOptions: (node: any, hasPositions: boolean) => {
        const isGroup = node.children && node.children.length > 0;
        const isRoot = node.id === 'root';

        const options: Record<string, string> = {
            'elk.algorithm': 'layered',
            'elk.direction': 'RIGHT',
            'elk.layered.spacing.nodeNodeBetweenLayers': '200',
            'elk.spacing.nodeNode': '160',
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

        const type = node.type || 'process';
        const label = node.label || '';
        const description = node.description || '';

        switch (type.toLowerCase()) {
            case 'start': return calculateDimensions(label, description, 140, 60);
            case 'end': return calculateDimensions(label, description, 140, 60);
            case 'process': return calculateDimensions(label, description, 180, 80);
            case 'decision': {
                const dims = calculateDimensions(label, description, 144, 144);
                const size = Math.max(dims.width, dims.height);
                return { width: size, height: size };
            }
            case 'group': return { width: undefined as any, height: undefined as any };
            default: return calculateDimensions(label, description, 180, 80);
        }
    },
    getEdgeStyle: () => ({
        pathType: 'bezier',
        strokeWidth: 2,
        stroke: 'var(--muted-foreground)'
    }),
    placeholderText: "Describe process flow...",
    loadingText: "Analyzing Process..."
};
