import React, { memo } from 'react';
import { Position, NodeProps } from '@xyflow/react';
import { BigHandle } from '../../common/BigHandle';
import { EditableLabel } from '../../common/EditableLabel';

const PersonNode = (props: NodeProps) => {
    const { data, selected } = props;
    return (
        <div className={`relative group flex flex-col items-center justify-center min-w-[150px] ${selected ? 'opacity-100' : 'opacity-90'}`}>
            {/* Connection Handles */}
            <BigHandle type="target" position={Position.Left} />
            <BigHandle type="source" position={Position.Right} />

            {/* Head (Circle) */}
            <div className={`
                w-16 h-16 rounded-full border-[3px] z-10 bg-card
                ${selected ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'border-[#107C10]'}
                flex items-center justify-center
            `}>
                {/* Optional Icon inside head if needed, or just empty as per C4 standard */}
            </div>

            {/* Body (Rounded Rectangle) */}
            <div className={`
                -mt-4 pt-6 pb-4 px-4 rounded-[20px] border-[3px] bg-card w-full text-center
                ${selected ? 'border-primary shadow-lg' : 'border-[#107C10]'}
            `}>
                <div className="font-bold text-lg text-foreground mb-1 w-full">
                    <EditableLabel id={props.id} label={data.label as string} className="text-center" />
                </div>
                <div className="text-xs font-medium text-[#107C10] mb-2">
                    [Person]
                </div>
                {data.description && (
                    <div className="text-xs text-muted-foreground leading-snug w-full">
                        <EditableLabel id={props.id} label={data.description as string} field="description" className="text-center" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(PersonNode);
