import React, { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

export const EditableLabel = ({ id, label, field = 'label', className = "", style = {} }: { id: string, label: string, field?: string, className?: string, style?: React.CSSProperties }) => {
    const { setNodes } = useReactFlow();
    const [isEditing, setIsEditing] = useState(false);
    const [localLabel, setLocalLabel] = useState(label);

    useEffect(() => {
        setLocalLabel(label);
    }, [label]);

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setLocalLabel(evt.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === id) {
                return { ...node, data: { ...node.data, [field]: localLabel } };
            }
            return node;
        }));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    if (isEditing) {
        return (
            <div className={`relative inline-grid items-center justify-items-center ${className}`} style={style}>
                {/* Ghost element to dictate width */}
                <span className="invisible px-1 border border-transparent whitespace-pre">
                    {localLabel || " "}
                </span>

                {/* Absolute input overlay */}
                <input
                    value={localLabel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="absolute inset-0 bg-background border border-primary/50 outline-none w-full text-center rounded-sm px-1"
                />
            </div>
        );
    }

    return (
        <span
            onDoubleClick={() => setIsEditing(true)}
            className={`cursor-text w-full inline-block break-words whitespace-normal ${className}`}
            style={style}
            title="Double-click to edit"
        >
            {label || <span className="opacity-50 italic">Label</span>}
        </span>
    );
};
