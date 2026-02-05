import React, { memo } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { BoxNode } from '../base/BoxNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableLabel } from '../../common/EditableLabel';

const CentralNode = ({ id, data, selected, targetPosition, ...props }: NodeProps) => {
    const typeStr = 'central';
    const styles = getTypeStyles(typeStr);
    const targetPos = targetPosition || Position.Left;

    return (
        <BoxNode
            id={id}
            data={data}
            selected={selected}
            {...props}
            bgClass={styles.bgClass}
            borderClass={styles.borderClass}
            shapeClass={styles.shape}
            minWidth={150}
            minHeight={100}
            handles={{}} // Disable default handles
            className="border-4 shadow-2xl"
        >
            {/* Target Handle - usually unused for root, but good to have */}
            <Handle type="target" position={targetPos} className="!bg-transparent !border-none opacity-0" />

            <div className="flex flex-col items-center text-center px-6 text-white w-full justify-center h-full">
                <h2 className="text-xl font-black tracking-tight leading-none w-full break-words whitespace-normal">
                    <EditableLabel id={id} label={String(data.label)} />
                </h2>
            </div>

            {/* Dual Source Handles for Bidirectional Layout */}
            <Handle
                type="source"
                id="source-right"
                position={Position.Right}
                className="!bg-white !w-4 !h-4 !border-violet-600"
            />
            <Handle
                type="source"
                id="source-left"
                position={Position.Left}
                className="!bg-white !w-4 !h-4 !border-violet-600"
            />
        </BoxNode>
    );
};

export default memo(CentralNode);
