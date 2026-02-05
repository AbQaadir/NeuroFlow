import React, { ReactNode } from 'react';
import { BaseNode, BaseNodeProps } from './BaseNode';

export interface FrameBaseNodeProps extends BaseNodeProps {
    label?: ReactNode;
    bgClass?: string;
    borderClass?: string;
    shapeClass?: string;
}

export const FrameBaseNode = ({
    label,
    bgClass = 'bg-transparent',
    borderClass = 'border-border',
    shapeClass = 'rounded-lg',
    className = '',
    children,
    ...props
}: FrameBaseNodeProps) => {
    return (
        <BaseNode
            {...props}
            className={`
                border-2 border-dashed
                w-full h-full min-w-[300px] min-h-[200px]
                ${borderClass} ${shapeClass}
                ${className}
            `}
        >
            {/* Background */}
            <div className={`absolute inset-0 ${shapeClass} overflow-hidden pointer-events-none -z-10`}>
                <div className={`absolute inset-0 ${bgClass}`} />
            </div>

            {/* Label on Top Border */}
            {label && (
                <div className="absolute -top-3 left-4 px-2 bg-background z-10">
                    {label}
                </div>
            )}

            {/* Content Area */}
            <div className="relative z-0 w-full h-full">
                {children}
            </div>
        </BaseNode>
    );
};
