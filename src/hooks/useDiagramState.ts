import React, { useState, useCallback, useEffect } from 'react';
import {
    useNodesState,
    useEdgesState,
    useReactFlow,
    Node,
    Edge,
    addEdge,
    Connection,
    MarkerType
} from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';
import { useHistory } from './useHistory';
import { generateDiagram } from '../services/geminiService';
import { calculateLayout } from '../services/layoutService';
import { telemetryService, GenerationEvent } from '../services/telemetryService';
import { ArchitectureSchema, NodeType, ChatMessage, AgentType, HistoryItem, ArchitectureNode, ArchitectureEdge } from '../types';
import { getDiagram } from '../diagrams';

export const useDiagramState = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeAgent, setActiveAgent] = useState<AgentType>('architect');

    // Chat State
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'system',
            content: "Hello! Select an agent to start",
            timestamp: Date.now()
        }
    ]);

    // History State for LLM
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // API Key from Env
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

    // History Hook for Undo/Redo
    const { takeSnapshot, undo, redo, canUndo, canRedo, clearHistory } = useHistory<{ nodes: Node[], edges: Edge[] }>();

    // Theme State
    const [isDark, setIsDark] = useState(() => {
        // Check local storage or system preference on init
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') || window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return true;
    });

    // Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Initialize theme and listen for system changes
    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [isDark]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsDark(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = useCallback(() => {
        setIsDark((prev) => !prev);
    }, []);

    // Selection State
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

    // Feedback State
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackEventId, setFeedbackEventId] = useState<string | null>(null);

    // Image Processing State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loadingText, setLoadingText] = useState<string>("Generating diagram...");

    const { screenToFlowPosition, fitView, getNodesBounds, getViewport } = useReactFlow();

    // Helper: Convert visual state back to logical schema for the AI
    const getCurrentSchema = useCallback((): ArchitectureSchema => {
        return {
            nodes: nodes.map(n => ({
                id: n.id,
                label: n.data.label as string,
                type: n.data.type as NodeType,
                description: n.data.description as string,
                attributes: n.data.attributes as any,
                methods: n.data.methods as any,
                position: n.position,
                width: n.width,
                height: n.height
            })),
            edges: edges.map(e => ({
                source: e.source,
                target: e.target,
                label: e.label as string | undefined
            }))
        };
    }, [nodes, edges]);

    // Helper: Get ONLY logical structure (no layout) for the AI to save tokens/context
    const getLogicalSchema = useCallback((): ArchitectureSchema => {
        return {
            nodes: nodes.map(n => ({
                id: n.id,
                label: n.data.label as string,
                type: n.data.type as NodeType,
                description: n.data.description as string,
                attributes: n.data.attributes as any,
                methods: n.data.methods as any,
                // Omit layout data
                position: undefined,
                width: undefined,
                height: undefined
            })),
            edges: edges.map(e => ({
                source: e.source,
                target: e.target,
                label: e.label as string | undefined
            }))
        };
    }, [nodes, edges]);

    const handleAgentChange = useCallback((newAgent: AgentType) => {
        setActiveAgent(newAgent);

        const diagramImpl = getDiagram(newAgent);
        const welcomeMsg = diagramImpl.welcomeMessage;

        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'system',
            content: welcomeMsg,
            timestamp: Date.now()
        }]);

        // Reset history on agent switch to provide clean context
        setHistory([]);
    }, []);

    const addUserMessage = useCallback((content: string, imageUrl?: string) => {
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: Date.now(),
            imageUrl // Attach image to message for UI
        };
        setMessages(prev => [...prev, userMsg]);
    }, []);

    const handleSendMessage = useCallback(async (content: string) => {
        if (!content.trim() && !selectedImage) return;

        // Add User Message (with image if present)
        addUserMessage(content, selectedImage || undefined);

        setIsLoading(true);
        setError(null);
        setLoadingText(selectedImage ? "Analyzing image..." : "Generating diagram...");

        let augmentedContent = content;

        try {
            // 0. Image Analysis (if uploaded)
            if (selectedImage) {
                // Extract base64 and mime type
                // Format: data:image/jpeg;base64,...
                const matches = selectedImage.match(/^data:(.+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    const mimeType = matches[1];
                    const base64Data = matches[2];

                    try {
                        const { describeImage } = await import('../services/geminiService');

                        // Construct prompt based on active agent to guide the vision model correctly
                        let prompt = "Describe this diagram in detail so I can recreate it.";
                        if (activeAgent === 'analyst') { // Flowchart
                            prompt = "Describe this business process flowchart in detail, focusing on decision points, start/end nodes, and the sequence of steps.";
                        } else if (activeAgent === 'architect') { // System Design
                            prompt = "Describe this software architecture in detail, focusing on services, databases, and relationships.";
                        } else if (activeAgent === 'mindmap') { // Mind Map
                            prompt = "Describe this mind map in detail, focusing on the central topic and hierarchy of ideas.";
                        } else if (activeAgent === 'c4') { // C4 Model
                            prompt = "Describe this C4 model in detail, focusing on the central topic and hierarchy of ideas.";
                        } else if (activeAgent === 'class') { // Class Diagram
                            prompt = "Describe this class diagram in detail, focusing on the central topic and hierarchy of ideas.";
                        } else if (activeAgent === 'database') { // Database Diagram
                            prompt = "Describe this database diagram in detail, focusing on the central topic and hierarchy of ideas.";
                        }

                        const description = await describeImage(base64Data, mimeType, apiKey, prompt);

                        augmentedContent = `User Prompt: ${content}\n\n[Image Context - The user provided an image with this description]:\n${description}\n\nIMPORTANT: Use this image description to guide the diagram generation completely.`;

                        setLoadingText("Generating diagram..."); // Update textual feedback
                    } catch (imgError: any) {
                        console.error("Image analysis failed", imgError);
                        setError("Failed to analyze image. Proceeding with text only.");
                        setSelectedImage(null); // Ensure cleared on error
                    }
                }
            }

            // Clear image selection after processing
            setSelectedImage(null);

            // 1. Prepare History
            const userHistoryItem: HistoryItem = { role: 'user', parts: [{ text: augmentedContent }] };
            const updatedHistory = [...history, userHistoryItem];

            // Snapshot before generation updates
            takeSnapshot({ nodes, edges });

            const startTime = Date.now();
            const generationId = crypto.randomUUID();

            // 2. Semantic Reasoning (Gemini) - Pass History & API Key
            const logicalSchema = getLogicalSchema();
            const { schema, explanation } = await generateDiagram(updatedHistory, logicalSchema, activeAgent, apiKey, (status) => setLoadingText(status));

            const endTime = Date.now();

            // Log Telemetry
            telemetryService.logGeneration({
                id: generationId,
                timestamp: startTime,
                agentType: activeAgent,
                inputPrompt: augmentedContent, // Log the full augmented prompt
                outputJson: schema,
                latencyMs: endTime - startTime,
                status: 'success'
            });

            // Trigger feedback UI
            setFeedbackEventId(generationId);
            setShowFeedback(true);

            // 3. Standard Architecture/Flowchart Logic (Incremental Merge)
            const archSchema = schema as ArchitectureSchema;
            const mergedNodes = [...nodes];
            const mergedEdges = [...edges];

            // Helper to find index
            const findNodeIndex = (id: string) => mergedNodes.findIndex(n => n.id === id);
            const findEdgeIndex = (source: string, target: string) => mergedEdges.findIndex(e => e.source === source && e.target === target);

            // Process Nodes
            archSchema.nodes.forEach(newNode => {
                const idx = findNodeIndex(newNode.id);

                // Handle Deletion
                if (newNode.deleted) {
                    if (idx !== -1) {
                        mergedNodes.splice(idx, 1);
                    }
                    return;
                }

                if (idx !== -1) {
                    // Update existing node
                    const existingNode = mergedNodes[idx];
                    mergedNodes[idx] = {
                        ...existingNode,
                        data: {
                            ...existingNode.data,
                            label: newNode.label,
                            type: newNode.type,
                            description: newNode.description,

                            attributes: newNode.attributes,
                            methods: newNode.methods
                        },
                        // CRITICAL: Keep existing position for incremental layout
                        position: existingNode.position,
                        width: existingNode.width,
                        // Force height recalculation for Entity/Class nodes to accommodate new attributes/methods
                        height: ['entity', 'class', 'interface'].includes(newNode.type) ? undefined : existingNode.height
                    };
                } else {
                    // Add new node
                    mergedNodes.push({
                        id: newNode.id,
                        type: 'custom',
                        parentId: newNode.parentId, // Persist parentId
                        position: { x: 0, y: 0 }, // Layout will fix this
                        data: {
                            label: newNode.label,
                            type: newNode.type,
                            description: newNode.description,

                            attributes: newNode.attributes,
                            methods: newNode.methods
                        }
                    });
                }
            });

            const diagramImpl = getDiagram(activeAgent);
            const edgeStyle = diagramImpl.getEdgeStyle();

            // Process Edges
            archSchema.edges.forEach(newEdge => {
                const idx = findEdgeIndex(newEdge.source, newEdge.target);

                // Handle Deletion
                if (newEdge.deleted) {
                    if (idx !== -1) {
                        mergedEdges.splice(idx, 1);
                    }
                    return;
                }

                if (idx === -1) {
                    mergedEdges.push({
                        id: `${newEdge.source}-${newEdge.target}`,
                        source: newEdge.source,
                        target: newEdge.target,
                        label: newEdge.label,
                        animated: true,
                        type: 'custom-edge',
                        data: {
                            pathType: edgeStyle.pathType,
                            label: newEdge.label
                        },
                        style: { stroke: edgeStyle.stroke, strokeWidth: edgeStyle.strokeWidth },
                        labelStyle: { fill: 'var(--foreground)', fontWeight: 500, fontSize: 12 },
                        labelBgStyle: { fill: 'var(--background)', fillOpacity: 1 },
                    } as any);
                } else {
                    // Update existing edge label if needed
                    mergedEdges[idx].label = newEdge.label;
                }
            });

            // Update History with Model Response - OPTIMIZED: Store only explanation, not full JSON
            const modelHistoryItem: HistoryItem = {
                role: 'model',
                parts: [{ text: explanation }]
            };
            setHistory([...updatedHistory, modelHistoryItem]);

            // Spatial Layout (ELK)
            const layoutSchema: ArchitectureSchema = {
                nodes: mergedNodes.map(n => {
                    return {
                        id: n.id,
                        label: n.data.label as string,
                        type: n.data.type as NodeType,
                        description: n.data.description as string,
                        attributes: n.data.attributes as any,
                        methods: n.data.methods as any,
                        position: n.position,
                        width: n.width,
                        height: n.height,
                        parentId: n.parentId, // Retrieve parentId
                        customIcon: n.data.customIcon as string // Persist customIcon
                    };
                }),
                edges: mergedEdges.map(e => ({
                    source: e.source,
                    target: e.target,
                    label: e.label as string | undefined
                }))
            };

            const layout = await calculateLayout(layoutSchema, activeAgent);

            setNodes(layout.nodes);
            setEdges(layout.edges);

            // Auto-fit the diagram in the viewport after rendering
            // Use setTimeout to ensure React has finished updating the DOM
            setTimeout(() => {
                fitView({ padding: 0.2, duration: 300 });
            }, 50);

            // Add System Message with explanation
            const systemMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'system',
                content: explanation,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, systemMsg]);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to generate diagram.");

            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'system',
                content: "I encountered an error. Please try again.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
            setLoadingText("Generating diagram..."); // Reset
        }
    }, [nodes.length, getCurrentSchema, getLogicalSchema, setNodes, setEdges, fitView, activeAgent, history, apiKey, nodes, edges, takeSnapshot, selectedImage]);

    const handleClear = useCallback(() => {
        takeSnapshot({ nodes, edges }); // Snapshot before clear
        setNodes([]);
        setEdges([]);
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setError(null);
        selectedImage; // Ref access only
        setSelectedImage(null);
        // Reset chat
        setMessages([{
            id: Date.now().toString(),
            role: 'system',
            content: "Canvas cleared. Ready for your next design.",
            timestamp: Date.now()
        }]);
        setHistory([]); // Clear history
    }, [setNodes, setEdges, takeSnapshot, nodes, edges]);


    // Export Logic - PNG
    const handleExport = useCallback(() => {
        // We target the viewport to capture all nodes, regardless of current window visibility
        const viewportEl = document.querySelector('.react-flow__viewport') as HTMLElement;
        if (!viewportEl) return;

        // Calculate the bounds of all nodes to determine the image size
        const nodesBounds = getNodesBounds(nodes);

        // Add some padding
        const padding = 100;
        const width = nodesBounds.width + padding * 2;
        const height = nodesBounds.height + padding * 2;

        // Use computed style for accurate background color
        const bg = window.getComputedStyle(document.body).backgroundColor;

        toPng(viewportEl, {
            backgroundColor: bg,
            width: width,
            height: height,
            style: {
                width: `${width}px`,
                height: `${height}px`,
                // Shift content to start at (padding, padding) and reset scale to 1
                transform: `translate(${padding - nodesBounds.x}px, ${padding - nodesBounds.y}px) scale(1)`,
            },
            pixelRatio: 2, // High resolution
            cacheBust: true,
        })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `neuroflow-${activeAgent}-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Export failed', err);
                setError('Failed to export image.');
            });
    }, [activeAgent, nodes, getNodesBounds]);

    // Export Logic - SVG
    const handleExportSvg = useCallback(() => {
        // Target the main react-flow container (not just viewport to avoid clipping)
        const rfEl = document.querySelector('.react-flow') as HTMLElement;
        if (!rfEl) return;

        // Calculate the bounds of all nodes to determine the image size
        const nodesBounds = getNodesBounds(nodes);
        const viewport = getViewport();

        // Add some padding
        const padding = 100;
        const width = nodesBounds.width + padding * 2;
        const height = nodesBounds.height + padding * 2;

        // Use computed style for accurate background color
        const bg = window.getComputedStyle(document.body).backgroundColor;

        // Filter function to exclude UI elements
        const filter = (node: HTMLElement) => {
            // Exclude controls, minimap, and background
            if (
                node.classList?.contains('react-flow__controls') ||
                node.classList?.contains('react-flow__minimap') ||
                node.classList?.contains('react-flow__background') ||
                node.classList?.contains('react-flow__panel')
            ) {
                return false;
            }
            return true;
        };

        toSvg(rfEl, {
            backgroundColor: bg,
            filter: filter,
            width: width,
            height: height,
            style: {
                width: `${width}px`,
                height: `${height}px`,
                transform: `translate(${padding - nodesBounds.x}px, ${padding - nodesBounds.y}px) scale(1)`,
            },
            cacheBust: true,
        })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `neuroflow-${activeAgent}-${Date.now()}.svg`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('SVG Export failed', err);
                setError('Failed to export SVG.');
            });
    }, [activeAgent, nodes, getNodesBounds, getViewport]);

    // --- Manual Editing Handlers ---

    // Undo/Redo Handlers
    const handleUndo = useCallback(() => {
        const currentState = { nodes, edges };
        const previousState = undo(currentState);
        if (previousState) {
            setNodes(previousState.nodes);
            setEdges(previousState.edges);
        }
    }, [nodes, edges, undo, setNodes, setEdges]);

    const handleRedo = useCallback(() => {
        const currentState = { nodes, edges };
        const nextState = redo(currentState);
        if (nextState) {
            setNodes(nextState.nodes);
            setEdges(nextState.edges);
        }
    }, [nodes, edges, redo, setNodes, setEdges]);

    const onConnect = useCallback((params: Connection) => {
        takeSnapshot({ nodes, edges }); // Snapshot before connecting

        const diagramImpl = getDiagram(activeAgent);
        const edgeStyle = diagramImpl.getEdgeStyle();

        setEdges((eds) => addEdge({
            ...params,
            animated: true,
            type: 'custom-edge',
            data: {
                pathType: edgeStyle.pathType,
            },
            style: { stroke: edgeStyle.stroke, strokeWidth: edgeStyle.strokeWidth },
            labelStyle: { fill: 'var(--foreground)', fontWeight: 500, fontSize: 12 },
            labelBgStyle: { fill: 'var(--background)', fillOpacity: 1 },
        } as any, eds));
    }, [setEdges, takeSnapshot, nodes, edges, activeAgent]);

    // Right Sidebar State
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

    const handleIconSelect = useCallback((iconKey: string) => {
        if (!selectedNodeId) return;

        takeSnapshot({ nodes, edges });
        setNodes((nds) => nds.map((node) => {
            if (node.id === selectedNodeId) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        customIcon: iconKey
                    }
                };
            }
            return node;
        }));
    }, [selectedNodeId, nodes, edges, setNodes, takeSnapshot]);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
        setSelectedEdgeId(null);

        // setIsRightSidebarOpen(true); // Disable auto-open
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setIsRightSidebarOpen(false); // Close right sidebar on pane click
    }, []);

    const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
        setSelectedEdgeId(edge.id);
        setSelectedNodeId(null);
    }, []);

    const handleSelectAll = useCallback(() => {
        setNodes((nds) => nds.map((n) => ({ ...n, selected: true })));
        setEdges((eds) => eds.map((e) => ({ ...e, selected: true })));
    }, [setNodes, setEdges]);

    const handleDeleteSelected = useCallback(() => {
        const hasSelectedNodes = nodes.some((n) => n.selected);
        const hasSelectedEdges = edges.some((e) => e.selected);

        if (hasSelectedNodes || hasSelectedEdges || selectedNodeId || selectedEdgeId) {
            takeSnapshot({ nodes, edges });
            setNodes((nds) => nds.filter((n) => !n.selected && n.id !== selectedNodeId));
            setEdges((eds) => eds.filter((e) => !e.selected && e.id !== selectedEdgeId));
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
        }
    }, [nodes, edges, setNodes, setEdges, takeSnapshot, selectedNodeId, selectedEdgeId]);

    // Z-Index Management
    const handleSendToBack = useCallback((nodeId: string) => {
        takeSnapshot({ nodes, edges });
        setNodes((nds) => {
            const nodeIndex = nds.findIndex(n => n.id === nodeId);
            if (nodeIndex === -1) return nds;
            const newNodes = [...nds];
            const [node] = newNodes.splice(nodeIndex, 1);
            newNodes.unshift(node); // Move to start (back)
            return newNodes;
        });
    }, [nodes, edges, setNodes, takeSnapshot]);

    const handleBringToFront = useCallback((nodeId: string) => {
        takeSnapshot({ nodes, edges });
        setNodes((nds) => {
            const nodeIndex = nds.findIndex(n => n.id === nodeId);
            if (nodeIndex === -1) return nds;
            const newNodes = [...nds];
            const [node] = newNodes.splice(nodeIndex, 1);
            newNodes.push(node); // Move to end (front)
            return newNodes;
        });
    }, [nodes, edges, setNodes, takeSnapshot]);

    // Drag and Drop Handlers
    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');

            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            // Get dimensions from the current diagram implementation
            const diagramImpl = getDiagram(activeAgent);
            const label = `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
            const description = 'Description...';

            // Calculate dimensions based on type
            const dimensions = diagramImpl.getNodeDimensions({
                type,
                label,
                description
            });

            const newNode: Node = {
                id: `dnd_${Date.now()}`,
                type: 'custom',
                position,
                width: dimensions.width,
                height: dimensions.height,
                style: { width: dimensions.width, height: dimensions.height },
                data: {
                    label,
                    type: type,
                    description,
                    // Ensure we pass dimensions in data if needed by some nodes, though usually width/height on node object is enough
                },
            };

            takeSnapshot({ nodes, edges }); // Snapshot before drop
            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes, takeSnapshot, nodes, edges, activeAgent],
    );

    const handleDownloadLogs = useCallback(() => {
        telemetryService.downloadLogs();
    }, []);

    const handleFeedbackSubmit = useCallback((rating: number, comment: string) => {
        if (feedbackEventId) {
            const finalJson = getCurrentSchema();
            telemetryService.updateEvent(feedbackEventId, {
                userRating: rating,
                userComments: comment,
                finalJson: finalJson
            });
        }
        setShowFeedback(false);
        setFeedbackEventId(null);
    }, [feedbackEventId, getCurrentSchema]);

    const handleFeedbackDismiss = useCallback(() => {
        setShowFeedback(false);
        setFeedbackEventId(null);
    }, []);

    return {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        onNodeClick,
        onEdgeClick,
        onPaneClick,
        onDragOver,
        onDrop,
        isLoading,
        error,
        activeAgent,
        messages,
        isDark,
        isSidebarOpen,
        isRightSidebarOpen,
        toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
        toggleRightSidebar: () => setIsRightSidebarOpen(!isRightSidebarOpen),
        closeRightSidebar: () => setIsRightSidebarOpen(false),
        handleIconSelect,
        toggleTheme,
        handleAgentChange,
        handleSendMessage,
        addUserMessage,
        handleClear,
        handleExport,
        handleExportSvg,
        handleUndo,
        handleRedo,
        handleSelectAll,
        handleDeleteSelected,
        takeSnapshot,
        selectedNodeId,
        handleSendToBack,
        handleBringToFront,
        handleDownloadLogs,
        // Feedback
        showFeedback,
        handleFeedbackSubmit,
        handleFeedbackDismiss,
        // Image Processing
        selectedImage,
        setSelectedImage,
        loadingText
    };
};
