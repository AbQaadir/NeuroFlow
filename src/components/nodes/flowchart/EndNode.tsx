import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { CircleNode } from '../base/CircleNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableLabel } from '../../common/EditableLabel';

const EndNode = ({ id, data, selected, ...props }: NodeProps) => {
    const typeStr = 'end';
    const styles = getTypeStyles(typeStr);

    return (
        <CircleNode
            id={id}
            data={data}
            selected={selected}
            {...props}
            bgClass={styles.bgClass}
            borderClass={styles.borderClass}
        >
            <div className="flex items-center gap-2 mb-2 justify-center">
                {styles.icon}
            </div>
            <h3 className="text-sm font-bold leading-tight text-foreground w-full break-words whitespace-normal mt-[2px] text-center">
                <EditableLabel id={id} label={String(data.label)} className="text-center" />
            </h3>
        </CircleNode>
    );
};

export default memo(EndNode);
