import React from 'react';
import {
    Database,
    Server,
    Smartphone,
    Globe,
    Layers,
    BoxSelect,
    PlayCircle,
    StopCircle,
    GitFork,
    Settings,
    Brain,
    Lightbulb,
    ListTree,
    StickyNote,
    Table,
    Code,
} from 'lucide-react';

export const getTypeStyles = (type: string) => {
    switch (type.toLowerCase()) {
        // --- Architecture Styles ---
        case 'database':
            return {
                icon: <Database className="w-5 h-5" />,
                colorClass: 'text-chart-2',
                borderClass: 'border-chart-2',
                bgClass: 'bg-chart-2',
                shape: 'rounded-xl'
            };
        case 'client':
            return {
                icon: <Smartphone className="w-5 h-5" />,
                colorClass: 'text-chart-3',
                borderClass: 'border-chart-3',
                bgClass: 'bg-chart-3',
                shape: 'rounded-full aspect-square flex items-center justify-center p-6'
            };
        case 'external':
            return {
                icon: <Globe className="w-5 h-5" />,
                colorClass: 'text-chart-4',
                borderClass: 'border-chart-4',
                bgClass: 'bg-chart-4',
                shape: 'rounded-lg border-dashed'
            };
        case 'queue':
            return {
                icon: <Layers className="w-5 h-5" />,
                colorClass: 'text-chart-5',
                borderClass: 'border-chart-5',
                bgClass: 'bg-chart-5',
                shape: 'rounded-md'
            };
        case 'group':
            return {
                icon: <BoxSelect className="w-4 h-4" />,
                colorClass: 'text-foreground/80',
                borderClass: 'border-dashed border-zinc-400 dark:border-zinc-500',
                bgClass: 'bg-zinc-100/80 dark:bg-zinc-800/30',
                shape: 'rounded-2xl'
            };
        case 'frame':
            return {
                icon: <BoxSelect className="w-4 h-4" />,
                colorClass: 'text-foreground/90',
                borderClass: 'border-2 border-zinc-400 dark:border-zinc-500',
                bgClass: 'bg-zinc-50/50 dark:bg-zinc-900/10',
                shape: 'rounded-lg'
            };

        // --- Flowchart Styles ---
        case 'start':
            return {
                icon: <PlayCircle className="w-5 h-5" />,
                colorClass: 'text-emerald-600 dark:text-emerald-400',
                borderClass: 'border-emerald-500',
                bgClass: 'bg-emerald-500',
                shape: 'rounded-full'
            };
        case 'end':
            return {
                icon: <StopCircle className="w-5 h-5" />,
                colorClass: 'text-rose-600 dark:text-rose-400',
                borderClass: 'border-rose-500',
                bgClass: 'bg-rose-500',
                shape: 'rounded-full'
            };
        case 'decision':
            return {
                icon: <GitFork className="w-5 h-5" />,
                colorClass: 'text-amber-600 dark:text-amber-400',
                borderClass: 'border-amber-500',
                bgClass: 'bg-amber-500',
                shape: 'rotate-45 rounded-sm'
            };
        case 'process':
            return {
                icon: <Settings className="w-5 h-5" />,
                colorClass: 'text-blue-600 dark:text-blue-400',
                borderClass: 'border-blue-500',
                bgClass: 'bg-blue-500',
                shape: 'rounded-lg'
            };

        // --- Mind Map Styles ---
        case 'central':
            return {
                icon: <Brain className="w-8 h-8" />,
                colorClass: 'text-white dark:text-white',
                borderClass: 'border-blue-600 dark:border-blue-500',
                bgClass: 'bg-blue-600 dark:bg-blue-500',
                shape: 'rounded-full'
            };
        case 'topic':
            return {
                icon: <Lightbulb className="w-5 h-5" />,
                colorClass: 'text-pink-600 dark:text-pink-400',
                borderClass: 'border-pink-500',
                bgClass: 'bg-pink-500',
                shape: 'rounded-2xl'
            };
        case 'subtopic':
            return {
                icon: <ListTree className="w-4 h-4" />,
                colorClass: 'text-sky-600 dark:text-sky-400',
                borderClass: 'border-sky-500',
                bgClass: 'bg-sky-500',
                shape: 'rounded-lg'
            };
        case 'note':
            return {
                icon: <StickyNote className="w-5 h-5" />,
                colorClass: 'text-yellow-800 dark:text-yellow-900',
                borderClass: 'border-yellow-300',
                bgClass: 'bg-yellow-200',
                shape: 'rounded-none shadow-md rotate-1' // Slight tilt for effect
            };

        // --- ER Diagram Styles ---
        case 'entity':
            return {
                icon: <Table className="w-4 h-4" />,
                colorClass: 'text-slate-700 dark:text-slate-200',
                borderClass: 'border-slate-400 dark:border-slate-500',
                bgClass: 'bg-slate-100 dark:bg-slate-800',
                shape: 'rounded-t-lg rounded-b-sm'
            };

        // --- Class Diagram Styles ---
        case 'class':
            return {
                icon: <Code className="w-4 h-4" />,
                colorClass: 'text-indigo-700 dark:text-indigo-200',
                borderClass: 'border-indigo-400 dark:border-indigo-500',
                bgClass: 'bg-indigo-50 dark:bg-indigo-900/30',
                shape: 'rounded-sm' // Standard UML box
            };

        default:
            return {
                icon: <Server className="w-5 h-5" />,
                colorClass: 'text-chart-1',
                borderClass: 'border-chart-1',
                bgClass: 'bg-chart-1',
                shape: 'rounded-lg'
            };
    }
};
