import React, { memo } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { BoxNode } from '../base/BoxNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableTextarea } from '../../common/EditableTextarea';
import { BigHandle } from '../../common/BigHandle';

const NoteNode = ({ id, data, selected, sourcePosition, targetPosition, ...props }: NodeProps) => {
    const typeStr = 'note';
    const styles = getTypeStyles(typeStr);

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
            className="flex flex-col gap-2 p-4"
        >
            {/* Explicit Left and Right Handles */}
            <BigHandle
                type="target"
                position={Position.Left}
                nodeId={id}
                innerClassName="!bg-white !border-yellow-400"
            />

            <div className={`${styles.colorClass} opacity-70`}>
                {styles.icon}
            </div>
            <p className={`font-handwriting text-sm leading-snug ${styles.colorClass} font-medium w-full h-full`}>
                <EditableTextarea id={id} label={String(data.label)} className="font-handwriting text-left w-full h-full resize-none bg-transparent outline-none" />
            </p>

            <BigHandle
                type="source"
                position={Position.Right}
                nodeId={id}
                innerClassName="!bg-white !border-yellow-400"
            />
        </BoxNode>
    );
};

export default memo(NoteNode);
