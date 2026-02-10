import ELK from 'elkjs/lib/elk.bundled.js';
import { Node, Edge, Position } from '@xyflow/react';
import { ArchitectureSchema } from '../../types';

const elk = new ELK();

export const calculateArchitectureLayout = async (schema: ArchitectureSchema, diagramImpl: any): Promise<{ nodes: Node[], edges: Edge[] }> => {
    // 1. Prepare Nodes Map
    const elkNodesMap: Record<string, any> = {};

    // Check globally if we have any positions to preserve
    const hasPositions = schema.nodes.some(n => n.position && (n.position.x !== 0 || n.position.y !== 0));

    schema.nodes.forEach(node => {
        const dims = diagramImpl.getNodeDimensions(node);

        const elkNode: any = {
            id: node.id,
            width: dims.width,
            height: dims.height,
            children: [],
            // Original data tracking
            _data: node
        };

        // Only pass x/y if they are valid numbers AND non-zero (to avoid pinning new nodes to 0,0)
        if (hasPositions && node.position &&
            typeof node.position.x === 'number' && typeof node.position.y === 'number' &&
            (node.position.x !== 0 || node.position.y !== 0)) {
            elkNode.x = node.position.x;
            elkNode.y = node.position.y;
        }

        elkNodesMap[node.id] = elkNode;
    });

    // 2. Build Hierarchy
    const rootNodes: any[] = [];

    schema.nodes.forEach(node => {
        const elkNode = elkNodesMap[node.id];

        // For other diagrams (Architecture), parentId implies containment (Group/VPC).
        let parentNode = null;

        if (node.parentId) {
            // 1. Try exact match
            parentNode = elkNodesMap[node.parentId];

            // 2. Try case-insensitive match on ID
            if (!parentNode) {
                const lowerParentId = node.parentId.toLowerCase();
                parentNode = Object.values(elkNodesMap).find((n: any) => n.id.toLowerCase() === lowerParentId);
            }

            // 3. Try match on Label (if parentId looks like a label)
            if (!parentNode) {
                const lowerParentId = node.parentId.toLowerCase().trim();
                parentNode = Object.values(elkNodesMap).find((n: any) => {
                    const label = (n._data.label || "").toLowerCase().trim();
                    const id = n.id.toLowerCase().trim();
                    // Check for substring match in either direction for maximum robustness
                    return (label && (label.includes(lowerParentId) || lowerParentId.includes(label))) ||
                        (id.includes(lowerParentId) || lowerParentId.includes(id));
                });
            }
        }

        if (parentNode) {
            parentNode.children.push(elkNode);
        } else {
            rootNodes.push(elkNode);
        }
    });

    // 2.5 Validate Groups & Apply Options
    Object.values(elkNodesMap).forEach(node => {
        if (node._data.type === 'group') {
            if (node.children.length === 0) {
                node.width = 600;
                node.height = 400;
                delete node.children;
            } else {
                delete node.width;
                delete node.height;
            }
        }

        node.layoutOptions = diagramImpl.getLayoutOptions(node, hasPositions);
    });

    // 3. Prepare Edges
    const elkEdges = schema.edges
        .filter(edge => elkNodesMap[edge.source] && elkNodesMap[edge.target])
        .map((edge) => ({
            id: `${edge.source}-${edge.target}`,
            sources: [edge.source],
            targets: [edge.target]
        }));

    const graph = {
        id: 'root',
        layoutOptions: diagramImpl.getLayoutOptions({ id: 'root', children: rootNodes }, hasPositions),
        children: rootNodes,
        edges: elkEdges
    };

    try {
        // @ts-ignore
        const layoutedGraph = await elk.layout(graph);
        // console.log("ELK Layout Output:", layoutedGraph);

        const reactFlowNodes: Node[] = [];
        const nodeAbsPosMap: Record<string, { x: number, y: number }> = {};
        const parentMap: Record<string, string> = {};

        // Build Parent Map
        schema.nodes.forEach(node => {
            if (node.parentId) {
                parentMap[node.id] = node.parentId;
            }
        });

        const processGraphNodes = (nodes: any[], parentId?: string, parentAbsPos = { x: 0, y: 0 }) => {
            nodes.forEach(node => {
                const originalData = elkNodesMap[node.id]?._data;
                if (!originalData) return;

                const absX = parentAbsPos.x + node.x;
                const absY = parentAbsPos.y + node.y;
                nodeAbsPosMap[node.id] = { x: absX, y: absY };

                const rfNode: Node = {
                    id: node.id,
                    type: 'custom',
                    position: { x: node.x, y: node.y },
                    data: {
                        label: originalData.label || node.id,
                        type: originalData.type || 'service',
                        description: originalData.description,
                        attributes: originalData.attributes,
                        methods: originalData.methods,
                        customIcon: originalData.customIcon // Persist customIcon
                    },
                    style: { width: node.width, height: node.height },
                    width: node.width,
                    height: node.height,
                    parentId: parentId,
                    extent: parentId ? 'parent' : undefined,
                    sourcePosition: Position.Right,
                    targetPosition: Position.Left,
                };

                reactFlowNodes.push(rfNode);

                if (node.children && node.children.length > 0) {
                    processGraphNodes(node.children, node.id, { x: absX, y: absY });
                }
            });
        };

        if (layoutedGraph.children) {
            processGraphNodes(layoutedGraph.children);
        }

        const getLCA = (node1: string, node2: string) => {
            const path1 = new Set<string>();
            let curr: string | undefined = node1;
            while (curr) {
                path1.add(curr);
                curr = parentMap[curr];
            }

            curr = node2;
            while (curr) {
                if (path1.has(curr)) return curr;
                curr = parentMap[curr];
            }
            return null; // Root
        };

        const edgeStyle = diagramImpl.getEdgeStyle();

        const reactFlowEdges: Edge[] = (layoutedGraph.edges || []).map((edge: any) => {
            const originalEdge = schema.edges.find(e => `${e.source}-${e.target}` === edge.id);
            const source = edge.sources[0];
            const target = edge.targets[0];

            // Calculate Offset based on LCA
            const lca = getLCA(source, target);
            let offsetX = 0;
            let offsetY = 0;

            if (lca && nodeAbsPosMap[lca]) {
                offsetX = nodeAbsPosMap[lca].x;
                offsetY = nodeAbsPosMap[lca].y;
            }

            // Condition Setup
            const isArchitect = diagramImpl.type === 'architect';

            // Calculate bend points only for Architecture diagrams
            let bendPoints: { x: number, y: number }[] | undefined = undefined;
            if (isArchitect) {
                bendPoints = (edge.sections || []).flatMap((s: any) => (s.bendPoints || []).map((p: any) => ({
                    x: p.x + offsetX,
                    y: p.y + offsetY
                })));
            }

            return {
                id: edge.id,
                source: source,
                target: target,
                animated: true,
                label: originalEdge?.label,
                type: 'custom-edge', // Use custom edge for better control
                data: {
                    pathType: edgeStyle.pathType,
                    label: originalEdge?.label,
                    bendPoints: bendPoints
                },
                style: {
                    stroke: edgeStyle.stroke,
                    strokeWidth: edgeStyle.strokeWidth
                },
                labelStyle: { fill: 'var(--foreground)', fontWeight: 500, fontSize: 12 },
                labelBgStyle: { fill: 'var(--background)', fillOpacity: 0.8 },
                // Restore zIndex for non-architect diagrams (like Flowchart) to maintain layering
                zIndex: isArchitect ? undefined : 100,
            };
        });

        return { nodes: reactFlowNodes, edges: reactFlowEdges };

    } catch (error) {
        console.error("ELK Layout Error:", error);
        throw error;
    }
};
