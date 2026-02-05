import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { BoxNode } from '../base/BoxNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableLabel } from '../../common/EditableLabel';

const ProcessNode = ({ id, data, selected, ...props }: NodeProps) => {
    const typeStr = 'process';
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
        >
            <div className={`relative z-10 flex flex-col h-full items-start`}>
                <div className="flex items-center gap-2 mb-2">
                    {styles.icon}
                </div>

                <h3 className="text-sm font-bold leading-tight text-foreground w-full break-words whitespace-normal mt-[2px]">
                    <EditableLabel id={id} label={String(data.label)} className="text-left" />
                </h3>

                {data.description && (
                    <p className="text-[10px] text-muted-foreground mt-1 leading-snug w-full break-words whitespace-normal">
                        {String(data.description)}
                    </p>
                )}
            </div>
        </BoxNode>
    );
};

export default memo(ProcessNode);
