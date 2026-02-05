import { useState, useEffect, useRef, useCallback } from 'react';
import { Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';

interface UseGraphAnimationProps {
    targetNodes: Node[];
    targetEdges: Edge[];
    isEnabled?: boolean;
    speed?: number; // ms per step
    onAnimationComplete?: () => void;
}

export const useGraphAnimation = ({
    targetNodes,
    targetEdges,
    isEnabled = true,
    speed = 300,
    onAnimationComplete
}: UseGraphAnimationProps) => {
    // We maintain a local subset of nodes/edges that are currently "visible"
    const [visibleNodes, setVisibleNodes, onNodesChange] = useNodesState([]);
    const [visibleEdges, setVisibleEdges, onEdgesChange] = useEdgesState([]);

    // Keep track of which IDs we have already shown
    const shownNodeIds = useRef<Set<string>>(new Set());
    const shownEdgeIds = useRef<Set<string>>(new Set());
    const isAnimating = useRef(false);

    // If disabled, just pass through everything immediately
    useEffect(() => {
        if (!isEnabled) {
            setVisibleNodes(targetNodes);
            setVisibleEdges(targetEdges);
            shownNodeIds.current = new Set(targetNodes.map(n => n.id));
            shownEdgeIds.current = new Set(targetEdges.map(e => e.id));
        }
    }, [isEnabled, targetNodes, targetEdges, setVisibleNodes, setVisibleEdges]);

    // The Animation Loop
    useEffect(() => {
        if (!isEnabled) return;

        // Check if there are any new nodes/edges to animate
        const nodestoShow = targetNodes.filter(n => !shownNodeIds.current.has(n.id));
        const edgesToShow = targetEdges.filter(e => !shownEdgeIds.current.has(e.id));

        if (nodestoShow.length === 0 && edgesToShow.length === 0) {
            // Check if any nodes were deleted/removed from target
            const currentIds = new Set(targetNodes.map(n => n.id));
            const extraNodes = visibleNodes.filter(n => !currentIds.has(n.id));

            let syncNeeded = false;

            if (extraNodes.length > 0) {
                syncNeeded = true;
            } else {
                const currentEdgeIds = new Set(targetEdges.map(e => e.id));
                const extraEdges = visibleEdges.filter(e => !currentEdgeIds.has(e.id));
                if (extraEdges.length > 0) syncNeeded = true;
            }

            if (syncNeeded) {
                setVisibleNodes(targetNodes);
                setVisibleEdges(targetEdges);
                shownNodeIds.current = new Set(targetNodes.map(n => n.id));
                shownEdgeIds.current = new Set(targetEdges.map(e => e.id));
                onAnimationComplete?.();
            }

            return;
        }

        let isCancelled = false;

        const animate = async () => {
            if (isAnimating.current) return;
            isAnimating.current = true;

            // Queue of items to process
            const remainingNodes = [...nodestoShow];
            const remainingEdges = [...edgesToShow];

            while ((remainingNodes.length > 0 || remainingEdges.length > 0) && !isCancelled) {
                // Determine next step

                // 1. Edges connected to visible nodes
                const edgeIndex = remainingEdges.findIndex(e =>
                    shownNodeIds.current.has(e.source) && shownNodeIds.current.has(e.target)
                );

                if (edgeIndex !== -1) {
                    const edge = remainingEdges[edgeIndex];
                    setVisibleEdges(prev => [...prev, edge]);
                    shownEdgeIds.current.add(edge.id);
                    remainingEdges.splice(edgeIndex, 1);
                    await new Promise(r => setTimeout(r, speed));
                    continue;
                }

                // 2. Nodes connected to visible nodes or roots
                const nodeIndex = remainingNodes.findIndex(n => {
                    if (n.parentId && !shownNodeIds.current.has(n.parentId)) return false;
                    return true;
                });

                const safeNodeIndex = nodeIndex !== -1 ? nodeIndex : 0;

                if (remainingNodes.length > 0) {
                    const node = remainingNodes[safeNodeIndex];
                    setVisibleNodes(prev => [...prev, node]);
                    shownNodeIds.current.add(node.id);
                    remainingNodes.splice(safeNodeIndex, 1);
                    await new Promise(r => setTimeout(r, speed));
                    continue;
                }

                // 3. Last resort: disconnected edges
                if (remainingEdges.length > 0) {
                    const edge = remainingEdges[0];
                    setVisibleEdges(prev => [...prev, edge]);
                    shownEdgeIds.current.add(edge.id);
                    remainingEdges.shift();
                    await new Promise(r => setTimeout(r, speed));
                }
            }

            isAnimating.current = false;
            // Only call complete if we actually finished everything in this batch
            if (!isCancelled) {
                onAnimationComplete?.();
            }
        };

        animate();

        return () => {
            isCancelled = true;
            isAnimating.current = false;
        };

    }, [targetNodes, targetEdges, isEnabled]); // speed is stable, onAnimationComplete might not be, but safe enough

    // Update LOCAL visibleNodes if target changes properties (e.g. selection, position) WITHOUT being "new"
    useEffect(() => {
        if (!isEnabled) return;

        setVisibleNodes(prev => prev.map(vNode => {
            const target = targetNodes.find(t => t.id === vNode.id);
            return target ? target : vNode;
        }));

        setVisibleEdges(prev => prev.map(vEdge => {
            const target = targetEdges.find(t => t.id === vEdge.id);
            return target ? target : vEdge;
        }));
    }, [targetNodes, targetEdges, isEnabled, setVisibleNodes, setVisibleEdges]);

    return {
        animatedNodes: visibleNodes,
        animatedEdges: visibleEdges,
        onNodesChange,
        onEdgesChange
    };
};
