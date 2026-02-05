import React, { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

export const EditableTextarea = ({ id, label, className = "", style = {} }: { id: string, label: string, className?: string, style?: React.CSSProperties }) => {
    const { setNodes } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    const [localLabel, setLocalLabel] = useState(label);

    useEffect(() => {
        setLocalLabel(label);
    }, [label]);

    const handleBlur = () => {
        setIsEditing(false);
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === id) {
                return { ...node, data: { ...node.data, label: localLabel } };
            }
            return node;
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
    };

    if (isEditing) {
        return (
            <textarea
                value={localLabel}
                onChange={(e) => setLocalLabel(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className={`nodrag bg-background border border-primary/50 outline-none w-full h-full resize-none rounded-sm px-1 ${className}`}
                style={style}
            />
        );
    }

    return (
        <div
            onDoubleClick={() => setIsEditing(true)}
            className={`cursor-text w-full h-full whitespace-pre-wrap ${className}`}
            style={style}
            title="Double-click to edit"
        >
            {label || <span className="opacity-50 italic">Add note...</span>}
        </div>
    );
};
