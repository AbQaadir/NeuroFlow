import React from 'react';
import { BaseNode, BaseNodeProps } from './BaseNode';
import { Position } from '@xyflow/react';
import { BigHandle } from '../../common/BigHandle';

export interface DiamondNodeProps extends BaseNodeProps {
    bgClass?: string;
    borderClass?: string;
}

export const DiamondNode = ({
    bgClass = 'bg-card',
    borderClass = 'border-border',
    className = '',
    children,
    ...props
}: DiamondNodeProps) => {
    return (
        <BaseNode
            {...props}
            className={`
                w-full h-full flex items-center justify-center relative
                ${className}
            `}
            handles={{
                source: Position.Right,
                target: Position.Left,
            }}
        >
            {/* Visual Diamond - Rotated Square */}
            <div className={`
                absolute w-[70.7%] h-[70.7%] rotate-45
                border-2 shadow-sm hover:shadow-lg rounded-sm
                ${borderClass}
                pointer-events-none
                overflow-hidden
            `}>
                <div className="absolute inset-0 bg-card" />
                <div className={`absolute inset-0 ${bgClass} opacity-15`} />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-full p-6">
                {children}
            </div>


        </BaseNode>
    );
};
