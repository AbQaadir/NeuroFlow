import React, { useCallback, memo, useState } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    Node,
    Edge,
    Connection,
    NodeTypes,
    OnNodesChange,
    OnEdgesChange
} from '@xyflow/react';
import CustomNode from '../nodes/CustomNode';
import { BaseEdge } from '../nodes/base/BaseEdge';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import EditorPanel from '../panels/EditorPanel';
import { AgentType } from '../../types';
import { ContextMenu } from '../ui/ContextMenu';
import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react';

// Define custom node types outside component to avoid re-renders
const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

const edgeTypes = {
    'custom-edge': BaseEdge,
};

const defaultViewport = { x: 0, y: 0, zoom: 1 };

interface DiagramCanvasProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: (params: Connection) => void;
    onNodeClick: (e: React.MouseEvent, node: Node) => void;
    onEdgeClick: (e: React.MouseEvent, edge: Edge) => void;
    onPaneClick: () => void;
    onNodeDragStart: () => void;
    onDragOver: (event: React.DragEvent) => void;
    onDrop: (event: React.DragEvent) => void;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
    isRightSidebarOpen: boolean;
    toggleRightSidebar: () => void;
    error: string | null;
    activeAgent: AgentType;
    isDark: boolean;
    onSendToBack?: (nodeId: string) => void;
    onBringToFront?: (nodeId: string) => void;
}

const DiagramCanvas = ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    onNodeDragStart,
    onDragOver,
    onDrop,
    isSidebarOpen,
    toggleSidebar,
    isRightSidebarOpen,
    toggleRightSidebar,
    error,
    activeAgent,
    isDark,
    onSendToBack,
    onBringToFront
}: DiagramCanvasProps) => {
    const [contextMenu, setContextMenu] = useState<{
        isOpen: boolean;
        position: { x: number; y: number };
        nodeId: string;
    } | null>(null);

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent, node: Node) => {
            event.preventDefault();
            setContextMenu({
                isOpen: true,
                position: { x: event.clientX, y: event.clientY },
                nodeId: node.id,
            });
        },
        []
    );

    const handleCloseContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    return (
        <div className="flex-1 relative h-full">
            {/* Editor Panel (Center Top) */}
            <EditorPanel activeAgent={activeAgent} />

            {/* Toggle Sidebar Button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-4 left-4 z-50 p-2 bg-card border border-border shadow-md rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
                {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            {/* Toggle Right Sidebar Button */}
            <button
                onClick={toggleRightSidebar}
                className="absolute top-4 right-4 z-50 p-2 bg-card border border-border shadow-md rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                title={isRightSidebarOpen ? "Collapse Icon Panel" : "Expand Icon Panel"}
            >
                {isRightSidebarOpen ? <PanelLeftOpen className="w-4 h-4 rotate-180" /> : <PanelLeftClose className="w-4 h-4 rotate-180" />}
            </button>

            {error && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-destructive/90 border border-destructive text-destructive-foreground px-6 py-3 rounded-full shadow-2xl backdrop-blur-md animate-bounce">
                    Error: {error}
                </div>
            )}

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                onNodeContextMenu={onNodeContextMenu}
                onEdgeClick={onEdgeClick}
                onPaneClick={onPaneClick}
                onNodeDragStart={onNodeDragStart}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultViewport={defaultViewport}
                minZoom={0.1}
                maxZoom={2}
                className="bg-background"
                proOptions={{ hideAttribution: true }}
                onDragOver={onDragOver}
                onDrop={onDrop}
                deleteKeyCode={null} // Disable native delete to handle it manually with snapshot
                zoomOnScroll={true} // Enable scroll zoom for better canvas control
                zoomOnDoubleClick={true} // Enable double-click zoom
                nodeDragThreshold={3} // Require 3px movement before drag starts (prevents accidental drags)
                panOnDrag={true} // Allow panning with left mouse button
                selectionOnDrag={false} // Disable collision-based selection to allow panning
                selectionKeyCode="Shift" // Hold Shift to select multiple nodes
            >
                <Background
                    color="var(--muted-foreground)"
                    gap={20}
                    size={1}
                    className="opacity-20"
                />
                <Controls
                    className="bg-card border-border shadow-md [&>button]:bg-card [&>button]:border-border [&>button]:text-foreground [&>button:hover]:bg-accent [&>button:hover]:text-accent-foreground [&_svg]:!fill-current"
                />
                <MiniMap
                    style={{ width: 150, height: 100 }}
                    className="bg-card border border-border rounded-lg overflow-hidden"
                    nodeColor={(n) => {
                        switch (n.data.type) {
                            // Architecture
                            case 'database': return isDark ? '#6ee7b7' : '#10b981';
                            case 'client': return isDark ? '#d8b4fe' : '#a855f7';
                            case 'external': return isDark ? '#fda4af' : '#f43f5e';
                            case 'queue': return isDark ? '#fdba74' : '#f97316';
                            case 'service': return isDark ? '#93c5fd' : '#3b82f6';

                            // Flowchart
                            case 'start': return '#10b981';
                            case 'end': return '#f43f5e';
                            case 'decision': return '#f59e0b';
                            case 'process': return '#3b82f6';

                            // Mind Map
                            case 'central': return '#7c3aed';
                            case 'topic': return '#db2777';
                            case 'subtopic': return '#0ea5e9';
                            case 'note': return '#ca8a04';

                            // Database
                            case 'entity': return '#64748b';

                            // Class
                            case 'class': return isDark ? '#818cf8' : '#4f46e5';

                            case 'group': return isDark ? '#52525b' : '#94a3b8';
                            default: return '#3b82f6';
                        }
                    }}
                />
            </ReactFlow>

            {contextMenu && contextMenu.isOpen && (
                <ContextMenu
                    position={contextMenu.position}
                    onClose={handleCloseContextMenu}
                    actions={[
                        {
                            label: 'Bring to Front',
                            icon: <ArrowUpToLine className="w-4 h-4" />,
                            onClick: () => {
                                onBringToFront?.(contextMenu.nodeId);
                                handleCloseContextMenu();
                            },
                        },
                        {
                            label: 'Send to Back',
                            icon: <ArrowDownToLine className="w-4 h-4" />,
                            onClick: () => {
                                onSendToBack?.(contextMenu.nodeId);
                                handleCloseContextMenu();
                            },
                        },
                        // We can add more actions here in the future
                    ]}
                />
            )}
        </div>
    );
};

export default memo(DiagramCanvas);
