import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { BoxNode } from '../base/BoxNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableLabel } from '../../common/EditableLabel';

const GroupNode = ({ id, data, selected, ...props }: NodeProps) => {
    const styles = getTypeStyles('group');

    return (
        <BoxNode
            id={id}
            data={data}
            selected={selected}
            {...props}
            bgClass="bg-transparent" // Group usually has transparent or semi-transparent bg handled by styles.bgClass
            borderClass={styles.borderClass}
            shapeClass={styles.shape}
            minWidth={200}
            minHeight={100}
            className="p-0"
        >
            <div className={`absolute inset-0 ${styles.shape} ${styles.bgClass} -z-10`} />
            <div className="absolute -top-3 left-4 px-3 py-0.5 bg-background border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm flex items-center gap-2 text-foreground/90 z-10">
                {styles.icon}
                <span className="text-xs font-bold uppercase tracking-widest">
                    <EditableLabel id={id} label={String(data.label)} className="text-left w-auto min-w-[50px]" />
                </span>
            </div>
            {data.description && (
                <div className="absolute bottom-2 right-2 opacity-60 text-[10px] text-muted-foreground font-mono">
                    {String(data.description)}
                </div>
            )}
        </BoxNode>
    );
};

export default memo(GroupNode);
