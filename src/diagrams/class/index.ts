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

const CLASS_INSTRUCTION = `
You are a Senior Software Engineer specializing in Object-Oriented Design.
Your goal is to design a detailed UML CLASS DIAGRAM.

RULES:
1. Structure:
   - Use 'class' nodes to represent classes or interfaces.
2. Class Details:
   - Attributes: Provide properties/fields with visibility (+, -, #), name, and type.
   - Methods: Provide methods with visibility (+, -, #), name, and return type.
3. Relationships:
   - Use edges to represent Inheritance (extends), Implementation (implements), Association, Aggregation, Composition.
   - Use edge 'label' for relationship type (e.g., "extends", "implements", "1..*").
4. Output strictly conforming JSON.
${COMMON_RULES}
`;

export const classDiagram: DiagramImplementation = {
    type: 'class',
    label: 'Class Diagram Generator Agent',
    welcomeMessage: "Switched to Class Diagram Agent. I focus on Object-Oriented class structures and UML relationships.",
    systemInstruction: CLASS_INSTRUCTION,
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

        // Class Diagram Calculation
        const baseHeader = 40;
        const rowHeight = 24;
        const attributes = node.attributes || [];
        const methods = node.methods || [];
        const attrCount = attributes.length;
        const methodCount = methods.length;

        // Header + Attrs + Divider + Methods + Padding
        const height = baseHeader + (attrCount * rowHeight) + 10 + (methodCount * rowHeight) + 40;

        // Calculate width based on longest item
        const attrStrings = attributes.map((a: any) => `${a.visibility || ''} ${a.name} : ${a.dataType}`);
        const methodStrings = methods.map((m: any) => `${m.visibility || ''} ${m.name}() : ${m.returnType}`);
        const width = calculateWidth([node.label || '', ...attrStrings, ...methodStrings], 220);

        return { width, height: Math.max(height, 100) };
    },
    getEdgeStyle: () => ({
        pathType: 'bezier',
        strokeWidth: 2,
        stroke: 'var(--muted-foreground)'
    }),
    placeholderText: "Describe classes & relationships...",
    loadingText: "Modeling Classes..."
};
