import { DiagramImplementation } from '../types';
import { calculateWidth } from '../utils';

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

const DATABASE_INSTRUCTION = `
You are a Senior Database Architect.
Your goal is to design a normalized ENTITY-RELATIONSHIP (ER) Diagram.

RULES:
1. Structure:
   - Use 'entity' nodes to represent database tables.
2. Schema Details:
   - For every 'entity', you MUST provide 'attributes' (columns).
   - Define Primary Keys (isPK) and Foreign Keys (isFK).
   - Use standard data types (INT, VARCHAR, TIMESTAMP, BOOLEAN, JSON).
3. Relationships:
   - Use edges to represent relationships (1:1, 1:N, N:M).
   - Use the edge 'label' to describe cardinality (e.g., "1:N", "has_many", "belongs_to").
4. Output strictly conforming JSON.
${COMMON_RULES}
`;

export const databaseDiagram: DiagramImplementation = {
    type: 'database',
    label: 'ER Diagram Generator Agent',
    welcomeMessage: "Switched to Database Architect. I focus on normalized Entity-Relationship (ER) diagrams and schemas.",
    systemInstruction: DATABASE_INSTRUCTION,
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

        // ER Diagram Entity Calculation
        const baseHeader = 40;
        const rowHeight = 24;
        const attributes = node.attributes || [];
        const attributeCount = attributes.length || 1;
        const height = baseHeader + (attributeCount * rowHeight) + 40; // Increased padding for bottom '+' button

        // Calculate width based on longest attribute
        const attrStrings = attributes.map((a: any) => `${a.visibility || ''} ${a.name} : ${a.dataType}`);
        const width = calculateWidth([node.label || '', ...attrStrings], 200);

        return { width, height: Math.max(height, 80) };
    },
    getEdgeStyle: () => ({
        pathType: 'bezier',
        strokeWidth: 2,
        stroke: 'var(--muted-foreground)'
    }),
    placeholderText: "Describe database schema...",
    loadingText: "Modeling Schema..."
};
