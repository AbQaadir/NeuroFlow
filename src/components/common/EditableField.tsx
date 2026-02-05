import React, { useState, useEffect } from 'react';

export const EditableField = ({ value, onChange, className = "", placeholder = "" }: { value: string, onChange: (val: string) => void, className?: string, placeholder?: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleBlur = () => {
        setIsEditing(false);
        onChange(localValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        e.stopPropagation();
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    if (isEditing) {
        return (
            <input
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className={`nodrag bg-background border border-primary/50 outline-none rounded-sm px-0.5 min-w-[20px] ${className}`}
                placeholder={placeholder}
            />
        );
    }

    return (
        <span
            onDoubleClick={() => setIsEditing(true)}
            className={`cursor-text min-w-[20px] inline-block ${className}`}
            title="Double-click to edit"
        >
            {value || <span className="opacity-50 italic">...</span>}
        </span>
    );
};
