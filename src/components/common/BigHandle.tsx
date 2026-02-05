import React from 'react';
import { Handle, HandleProps, useNodeConnections } from '@xyflow/react';

export const BigHandle = ({ className = "", innerClassName = "", nodeId, ...props }: HandleProps & { className?: string, innerClassName?: string, nodeId?: string }) => {
    const connections = useNodeConnections({
        handleType: props.type,
        handleId: props.id
    });

    const isConnected = connections.length > 0;

    return (
        <Handle
            {...props}
            className={`
                !w-12 !h-12 !bg-transparent !border-none flex items-center justify-center z-50 cursor-crosshair
                transition-opacity duration-200
                ${isConnected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                ${className}
            `}
        >
            <div className={`
                w-3 h-3 rounded-full pointer-events-none transition-transform hover:scale-125
                bg-black dark:bg-white border border-background shadow-sm
                ${innerClassName}
            `} />
        </Handle>
    );
};
