import ELK from 'elkjs/lib/elk.bundled.js';
import { Node, Edge, Position } from '@xyflow/react';
import { ArchitectureSchema } from '../../types';

const elk = new ELK();

export const calculateMindMapLayout = async (schema: ArchitectureSchema, diagramImpl: any): Promise<{ nodes: Node[], edges: Edge[] }> => {
    const centralNode = schema.nodes.find(n => n.type === 'central') || schema.nodes[0];
    if (!centralNode) return { nodes: [], edges: [] };

    // Build Adjacency List (Bidirectional to handle any edge direction)
    const adj: Record<string, string[]> = {};
    schema.edges.forEach(e => {
        // Forward
        if (!adj[e.source]) adj[e.source] = [];
        adj[e.source].push(e.target);

        // Reverse
        if (!adj[e.target]) adj[e.target] = [];
        adj[e.target].push(e.source);
    });

    // Identify Level 1 Nodes (Direct children of Central)
    const level1Ids = adj[centralNode.id] || [];

    // Split Level 1 Nodes
    const mid = Math.ceil(level1Ids.length / 2);
    const rightL1 = level1Ids.slice(0, mid);
    const leftL1 = level1Ids.slice(mid);

    // Helper to collect all descendants
    const collectNodes = (roots: string[]) => {
        const result = new Set<string>(roots);
        const queue = [...roots];
        while (queue.length) {
            const id = queue.shift()!;
            // Avoid traversing back to central node or already visited nodes
            const neighbors = adj[id] || [];
            neighbors.forEach(neighbor => {
                if (neighbor !== centralNode.id && !result.has(neighbor)) {
                    result.add(neighbor);
                    queue.push(neighbor);
                }
            });
        }
        return result;
    };

    const rightNodeIds = collectNodes(rightL1);
    const leftNodeIds = collectNodes(leftL1);

    // Build Sub-Graphs
    const buildSubGraph = (nodeIds: Set<string>, direction: 'LEFT' | 'RIGHT') => {
        const nodes = schema.nodes.filter(n => nodeIds.has(n.id) || n.id === centralNode.id).map(node => {
            const dims = diagramImpl.getNodeDimensions(node);
            return {
                id: node.id,
                width: dims.width,
                height: dims.height,
                labels: [{ text: node.label }],
                _data: node
            };
        });

        // Generate normalized edges for ELK (Parent -> Child)
        // We traverse from Central Node outwards to ensure correct hierarchy
        const elkEdges: any[] = [];
        const visited = new Set<string>();
        const queue = [centralNode.id];
        visited.add(centralNode.id);

        while (queue.length > 0) {
            const parentId = queue.shift()!;
            const neighbors = adj[parentId] || [];

            neighbors.forEach(childId => {
                // Only process if this child is part of this subgraph (or is a L1 node in this subgraph)
                if (nodeIds.has(childId) && !visited.has(childId)) {
                    visited.add(childId);
                    queue.push(childId);

                    // Add directed edge Parent -> Child for ELK
                    elkEdges.push({
                        id: `${parentId}-${childId}`,
                        sources: [parentId],
                        targets: [childId]
                    });
                }
            });
        }

        return {
            id: 'root',
            layoutOptions: {
                'elk.algorithm': 'mrtree',
                'elk.direction': direction,
                'elk.spacing.nodeNode': '60',
                'elk.spacing.edgeNode': '100',
            },
            children: nodes,
            edges: elkEdges
        };
    };

    const rightGraph = buildSubGraph(rightNodeIds, 'RIGHT');
    const leftGraph = buildSubGraph(leftNodeIds, 'LEFT');

    // Run Layouts
    try {
        const [rightLayout, leftLayout] = await Promise.all([
            elk.layout(rightGraph),
            elk.layout(leftGraph)
        ]);

        // Merge Results
        const nodes: Node[] = [];
        const edges: Edge[] = [];

        // Helper to process layout result
        const processLayout = (layout: any, isLeft: boolean) => {
            // Find central node position in this layout
            const central = layout.children.find((n: any) => n.id === centralNode.id);
            const offsetX = central ? central.x : 0;
            const offsetY = central ? central.y : 0;

            layout.children.forEach((node: any) => {
                if (node.id === centralNode.id && isLeft) return; // Skip central node in left pass (already added in right)

                // Adjust position relative to central node
                const finalX = node.x - offsetX;
                const finalY = node.y - offsetY;

                const originalData = node._data;

                // Determine handles
                let sourcePos = Position.Right;
                let targetPos = Position.Left;

                if (isLeft) {
                    sourcePos = Position.Left;
                    targetPos = Position.Right;
                }

                nodes.push({
                    id: node.id,
                    type: 'custom', // Use CustomNode dispatcher
                    position: { x: finalX, y: finalY },
                    data: {
                        label: originalData.label,
                        type: originalData.type,
                        description: originalData.description
                    },
                    style: { width: node.width, height: node.height },
                    width: node.width,
                    height: node.height,
                    sourcePosition: sourcePos,
                    targetPosition: targetPos
                });
            });

            (layout.edges || []).forEach((e: any) => {
                const originalEdge = schema.edges.find(oe => `${oe.source}-${oe.target}` === e.id);

                // Determine source handle for edges coming from Central Node
                let sourceHandleId = undefined;
                if (e.sources[0] === centralNode.id) {
                    sourceHandleId = isLeft ? 'source-left' : 'source-right';
                }

                const edgeStyle = diagramImpl.getEdgeStyle();

                edges.push({
                    id: e.id,
                    source: e.sources[0],
                    target: e.targets[0],
                    sourceHandle: sourceHandleId,
                    animated: true,
                    type: 'custom-edge',
                    data: { pathType: 'bezier', label: originalEdge?.label },
                    style: { stroke: edgeStyle.stroke, strokeWidth: edgeStyle.strokeWidth }
                });
            });
        };

        processLayout(rightLayout, false);
        processLayout(leftLayout, true);

        return { nodes, edges };

    } catch (error) {
        console.error("ELK Mind Map Layout Error:", error);
        throw error;
    }
};
