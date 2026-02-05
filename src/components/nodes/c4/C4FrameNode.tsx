import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

const C4FrameNode = ({ data, selected }: NodeProps) => {
    return (
        <div className={`
            relative w-full h-full min-w-[300px] min-h-[200px]
            border-2 border-dashed rounded-lg bg-background/50
            ${selected ? 'border-primary' : 'border-muted-foreground'}
        `}>
            {/* Label at Top Left (or Center Top) */}
            <div className={`
                absolute -top-3 left-4 px-2 bg-background text-sm font-bold
                ${selected ? 'text-primary' : 'text-muted-foreground'}
            `}>
                {data.label as string} <span className="text-xs font-normal opacity-70">[{data.description as string || 'System Boundary'}]</span>
            </div>

            {/* Handles - Usually frames don't have edges connected directly to them in C4, but good to have just in case */}
            <Handle type="target" position={Position.Top} className="opacity-0" />
            <Handle type="source" position={Position.Bottom} className="opacity-0" />
            <Handle type="target" position={Position.Left} className="opacity-0" />
            <Handle type="source" position={Position.Right} className="opacity-0" />
        </div>
    );
};

export default memo(C4FrameNode);
