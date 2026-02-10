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

const ARCHITECT_INSTRUCTION = `
You are a Principal Software Architect.
Your goal is to define the LOGIC and STRUCTURE of a system architecture.

RULES:
1. Focus on logical grouping. Use 'group' nodes to represent Clusters, Regions, VPCs.
2. Node Types: 'service', 'database', 'client', 'queue', 'external', 'group'.
   - 'client' is OPTIONAL. Only include it if the system implies a user interface (Web, Mobile, CLI).
   - If the system is backend-only (e.g., API, Cron Job, Event Processor), DO NOT add a client node.
3. Assign 'parentId' to nodes that belong inside a group. The 'parentId' MUST be the exact 'id' of the group node.
4. Output strictly conforming JSON.
5. Do NOT generate descriptions for nodes. Leave the 'description' field as an empty string.
${COMMON_RULES}
`;

export const architectureDiagram: DiagramImplementation = {
    type: 'architect',
    label: 'System Architect Agent',
    welcomeMessage: "Switched to System Architect. I focus on cloud infrastructure and topologies.",
    systemInstruction: ARCHITECT_INSTRUCTION,
    getLayoutOptions: (node: any, hasPositions: boolean) => {
        const isGroup = node.children && node.children.length > 0;
        const isRoot = node.id === 'root';

        const options: Record<string, string> = {
            'elk.algorithm': 'layered',
            'elk.direction': 'RIGHT',

            // Edge Routing Configuration - Prevents edge overlapping
            'elk.edgeRouting': 'ORTHOGONAL',
            'elk.layered.edgeRouting.selfLoopPlacement': 'NORTH_STACKED',

            // Crossing Minimization - Reduces edge crossings
            'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',

            // Node Spacing
            'elk.layered.spacing.nodeNodeBetweenLayers': '200',
            'elk.spacing.nodeNode': '160',

            // Edge Spacing - Prevents edges from overlapping with nodes and each other
            'elk.layered.spacing.edgeNodeBetweenLayers': '80',
            'elk.layered.spacing.edgeEdgeBetweenLayers': '40',
        };

        if (hasPositions) {
            options['elk.layered.interactive'] = 'true';
            options['elk.layered.incremental'] = 'true';
            // options['elk.layered.nodePlacement.strategy'] = 'BRANDES_KOEPF'; // Removed for stability
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

        const type = node.type || 'service';
        const label = node.label || '';
        const description = node.description || '';

        switch (type.toLowerCase()) {
            case 'group': return { width: undefined as any, height: undefined as any };
            case 'database': return { width: 140, height: 140 };
            case 'queue': return { width: 140, height: 140 };
            case 'client': return { width: 120, height: 120 };
            case 'service': return { width: 140, height: 140 };
            case 'external': return { width: 140, height: 140 };
            case 'frame': return { width: 300, height: 300 };
            default: return { width: 200, height: 80 };
        }
    },
    getEdgeStyle: () => ({
        pathType: 'step',
        strokeWidth: 2,
        stroke: 'var(--muted-foreground)'
    }),
    placeholderText: "Describe system...",
    loadingText: "Designing System..."
};
