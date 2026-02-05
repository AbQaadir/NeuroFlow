import React from 'react';
import { BaseNode, BaseNodeProps } from './BaseNode';

export interface BoxNodeProps extends BaseNodeProps {
    bgClass?: string;
    borderClass?: string;
    shapeClass?: string;
}

export const BoxNode = ({
    bgClass = 'bg-card',
    borderClass = 'border-border',
    shapeClass = 'rounded-lg',
    className = '',
    children,
    ...props
}: BoxNodeProps) => {
    return (
        <BaseNode
            {...props}
            className={`
                border-2 shadow-sm hover:shadow-lg
                w-full h-full min-w-[140px] min-h-[50px] px-4 py-3
                ${borderClass} ${shapeClass}
                ${className}
            `}
        >
            <div className={`absolute inset-0 ${shapeClass} overflow-hidden pointer-events-none`}>
                <div className="absolute inset-0 bg-card" />
                <div className={`absolute inset-0 ${bgClass} opacity-15`} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                {children}
            </div>
        </BaseNode>
    );
};
