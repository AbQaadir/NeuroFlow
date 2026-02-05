import React, { ReactNode } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { ResizeHandles } from '../ResizeHandles';
import { BigHandle } from '../../common/BigHandle';

export interface BaseNodeProps extends NodeProps {
    children?: ReactNode;
    className?: string;
    handles?: {
        source?: Position;
        target?: Position;
    };
    minWidth?: number;
    minHeight?: number;
    keepAspectRatio?: boolean;
}

export const BaseNode = ({
    id,
    selected,
    children,
    className = '',
    handles = { source: Position.Right, target: Position.Left },
    minWidth = 140,
    minHeight = 50,
    keepAspectRatio = false,
}: BaseNodeProps) => {
    const selectionClass = selected
        ? `ring-2 ring-offset-2 ring-offset-background ring-ring`
        : '';

    return (
        <>
            <ResizeHandles selected={selected} minWidth={minWidth} minHeight={minHeight} keepAspectRatio={keepAspectRatio} />

            <div className={`
                relative group transition-shadow transition-[box-shadow,ring] duration-200 
                ${selectionClass}
                ${className}
            `}>
                {handles.target && (
                    <BigHandle type="target" position={handles.target} nodeId={id} />
                )}

                {children}

                {handles.source && (
                    <BigHandle type="source" position={handles.source} nodeId={id} />
                )}
            </div>
        </>
    );
};
