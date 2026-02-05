import React from 'react';
import { BaseNode, BaseNodeProps } from './BaseNode';

export interface CircleNodeProps extends BaseNodeProps {
    bgClass?: string;
    borderClass?: string;
}

export const CircleNode = ({
    bgClass = 'bg-card',
    borderClass = 'border-border',
    className = '',
    children,
    ...props
}: CircleNodeProps) => {
    return (
        <BaseNode
            {...props}
            className={`
                border-2 shadow-sm hover:shadow-lg
                w-full h-full aspect-square flex items-center justify-center p-6
                rounded-full
                ${borderClass}
                ${className}
            `}
        >
            <div className={`absolute inset-0 rounded-full overflow-hidden pointer-events-none`}>
                <div className="absolute inset-0 bg-card" />
                <div className={`absolute inset-0 ${bgClass} opacity-15`} />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-full overflow-hidden px-2">
                {children}
            </div>
        </BaseNode>
    );
};
