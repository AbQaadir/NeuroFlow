import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { FrameBaseNode } from '../base/FrameBaseNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableLabel } from '../../common/EditableLabel';

const FrameNode = ({ id, data, selected, ...props }: NodeProps) => {
    const styles = getTypeStyles('frame');

    return (
        <FrameBaseNode
            id={id}
            data={data}
            selected={selected}
            {...props}
            bgClass="bg-transparent"
            borderClass={styles.borderClass}
            shapeClass={styles.shape}
            label={
                <div className="flex items-center gap-2">
                    {styles.icon}
                    <span className="text-xs font-bold uppercase tracking-widest text-foreground">
                        <EditableLabel id={id} label={String(data.label)} className="text-left w-auto min-w-[50px]" />
                    </span>
                </div>
            }
        />
    );
};

export default memo(FrameNode);
