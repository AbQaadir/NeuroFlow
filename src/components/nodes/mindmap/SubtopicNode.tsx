import React, { memo } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { BoxNode } from '../base/BoxNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableLabel } from '../../common/EditableLabel';

const SubtopicNode = ({ id, data, selected, sourcePosition, targetPosition, ...props }: NodeProps) => {
    const typeStr = 'subtopic';
    const styles = getTypeStyles(typeStr);
    const sourcePos = sourcePosition || Position.Right;
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
            handles={{ source: sourcePos, target: targetPos }}
        >
            <div className={`relative z-10 flex flex-col h-full items-center text-center justify-center`}>
                <div className={`flex items-center gap-2 mb-1 ${styles.colorClass}`}>
                    {styles.icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{typeStr}</span>
                </div>

                <h3 className="text-sm font-bold leading-tight text-foreground w-full break-words whitespace-normal mt-[2px]">
                    <EditableLabel id={id} label={String(data.label)} className={'text-center'} />
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

export default memo(SubtopicNode);
