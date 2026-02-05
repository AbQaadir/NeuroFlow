import React, { useState, useEffect } from 'react';
import {
    Plus, Trash2, Settings2, Type,
    Database, Server, Smartphone, Globe, Layers,
    PlayCircle, StopCircle, GitFork, Settings,
    Brain, Lightbulb, ListTree, StickyNote,
    Table, Code, BoxSelect,
    User, Package, Cpu
} from 'lucide-react';
import { Node as FlowNode, Edge as FlowEdge } from '@xyflow/react';
import { AgentType } from '../../types';

interface EditorPanelProps {
    activeAgent: AgentType;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
    activeAgent
}) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    // Define palettes for different agents
    const architecturePalette = [
        { id: 'service', label: 'Service', icon: <Server className="w-4 h-4" />, color: 'border-chart-1 text-chart-1 hover:bg-chart-1/20' },
        { id: 'database', label: 'Database', icon: <Database className="w-4 h-4" />, color: 'border-chart-2 text-chart-2 hover:bg-chart-2/20' },
        { id: 'client', label: 'Client', icon: <Smartphone className="w-4 h-4" />, color: 'border-chart-3 text-chart-3 hover:bg-chart-3/20' },
        { id: 'queue', label: 'Queue', icon: <Layers className="w-4 h-4" />, color: 'border-chart-4 text-chart-4 hover:bg-chart-4/20' },
        { id: 'external', label: 'External', icon: <Globe className="w-4 h-4" />, color: 'border-chart-5 text-chart-5 hover:bg-chart-5/20' },
        { id: 'frame', label: 'Frame', icon: <BoxSelect className="w-4 h-4" />, color: 'border-zinc-400 text-zinc-600 hover:bg-zinc-400/20' }
    ];

    const flowchartPalette = [
        { id: 'start', label: 'Start', icon: <PlayCircle className="w-4 h-4" />, color: 'border-emerald-500 text-emerald-600 hover:bg-emerald-500/20' },
        { id: 'process', label: 'Process', icon: <Settings className="w-4 h-4" />, color: 'border-blue-500 text-blue-600 hover:bg-blue-500/20' },
        { id: 'decision', label: 'Decision', icon: <GitFork className="w-4 h-4" />, color: 'border-amber-500 text-amber-600 hover:bg-amber-500/20' },
        { id: 'end', label: 'End', icon: <StopCircle className="w-4 h-4" />, color: 'border-rose-500 text-rose-600 hover:bg-rose-500/20' },
    ];

    const mindmapPalette = [
        { id: 'central', label: 'Central', icon: <Brain className="w-4 h-4" />, color: 'border-violet-500 text-violet-600 hover:bg-violet-500/20' },
        { id: 'topic', label: 'Topic', icon: <Lightbulb className="w-4 h-4" />, color: 'border-pink-500 text-pink-600 hover:bg-pink-500/20' },
        { id: 'subtopic', label: 'Subtopic', icon: <ListTree className="w-4 h-4" />, color: 'border-sky-500 text-sky-600 hover:bg-sky-500/20' },
        { id: 'note', label: 'Note', icon: <StickyNote className="w-4 h-4" />, color: 'border-yellow-400 text-yellow-600 hover:bg-yellow-400/20' },
    ];

    const databasePalette = [
        { id: 'entity', label: 'Table/Entity', icon: <Table className="w-4 h-4" />, color: 'border-slate-500 text-slate-600 hover:bg-slate-500/20' },
    ];

    const classPalette = [
        { id: 'class', label: 'Class', icon: <Code className="w-4 h-4" />, color: 'border-indigo-500 text-indigo-600 hover:bg-indigo-500/20' },
    ];

    const c4Palette = [
        { id: 'person', label: 'Person', icon: <User className="w-4 h-4" />, color: 'border-green-600 text-green-700 hover:bg-green-600/20' },
        { id: 'system', label: 'System', icon: <Globe className="w-4 h-4" />, color: 'border-blue-500 text-blue-600 hover:bg-blue-500/20' },
        { id: 'container', label: 'Container', icon: <Package className="w-4 h-4" />, color: 'border-blue-400 text-blue-500 hover:bg-blue-400/20' },
        { id: 'component', label: 'Component', icon: <Cpu className="w-4 h-4" />, color: 'border-cyan-500 text-cyan-600 hover:bg-cyan-500/20' },
        { id: 'database', label: 'Database', icon: <Database className="w-4 h-4" />, color: 'border-slate-500 text-slate-600 hover:bg-slate-500/20' },
        { id: 'frame', label: 'Frame', icon: <BoxSelect className="w-4 h-4" />, color: 'border-zinc-400 text-zinc-600 hover:bg-zinc-400/20' }
    ];

    let currentPalette = architecturePalette;
    if (activeAgent === 'analyst') currentPalette = flowchartPalette;
    else if (activeAgent === 'mindmap') currentPalette = mindmapPalette;
    else if (activeAgent === 'database') currentPalette = databasePalette;
    else if (activeAgent === 'class') currentPalette = classPalette;
    else if (activeAgent === 'c4') currentPalette = c4Palette;

    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-fit max-w-[95%]">
            <div className="bg-background/80 backdrop-blur-xl border border-border shadow-xl dark:shadow-2xl rounded-2xl px-3 py-4 flex items-center gap-4 transition-all duration-300">

                {/* Left: Component Library (Toolbar) */}
                <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] px-2 max-w-[50vw]">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mr-2 shrink-0">
                        Components
                    </div>
                    {currentPalette.map(type => (
                        <div
                            key={type.id}
                            onDragStart={(event) => onDragStart(event, type.id)}
                            draggable
                            className={`
                            px-3 py-2 rounded-xl border flex items-center gap-2 transition-all duration-300 ease-out bg-background/40 backdrop-blur-sm
                            hover:-translate-y-0.5 hover:shadow-sm hover:scale-[1.02]
                            active:scale-95 active:shadow-none whitespace-nowrap
                            cursor-grab active:cursor-grabbing
                            ${type.color}
                        `}
                            title={`Drag to add ${type.label}`}
                        >
                            {type.icon}
                            <span className="text-xs font-medium">{type.label}</span>
                        </div>
                    ))}
                </div>



            </div>
        </div>
    );
};

export default EditorPanel;
