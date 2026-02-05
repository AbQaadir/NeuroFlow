import React from 'react';
import { BaseNode, BaseNodeProps } from './BaseNode';

export interface SquareNodeProps extends BaseNodeProps {
    bgClass?: string;
    borderClass?: string;
    shapeClass?: string;
}

export const SquareNode = ({
    bgClass = 'bg-card',
    borderClass = 'border-border',
    shapeClass = 'rounded-lg',
    className = '',
    children,
    ...props
}: SquareNodeProps) => {
    return (
        <BaseNode
            {...props}
            keepAspectRatio={true}
            className={`
                border-2 shadow-sm hover:shadow-lg
                w-full h-full aspect-square px-4 py-3 flex flex-col
                ${borderClass} ${shapeClass}
                ${className}
            `}
        >
            <div className={`absolute inset-0 ${shapeClass} overflow-hidden pointer-events-none`}>
                <div className="absolute inset-0 bg-card" />
                <div className={`absolute inset-0 ${bgClass} opacity-15`} />
            </div>

            <div className="relative z-10 flex flex-col h-full w-full">
                {children}
            </div>
        </BaseNode>
    );
};
