import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { SquareNode } from '../base/SquareNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableLabel } from '../../common/EditableLabel';
import { useIconContext } from '../../../context/IconContext';
import { getIconForNode } from '../../../utils/iconMapper';

const ExternalNode = ({ id, data, selected, ...props }: NodeProps) => {
    const { customIcons } = useIconContext();
    const typeStr = 'external';
    const styles = getTypeStyles(typeStr);

    // Icon Logic
    let iconContent;
    if (data.customIcon && typeof data.customIcon === 'string' && data.customIcon.startsWith('custom_')) {
        const svgContent = customIcons[data.customIcon];
        if (svgContent) {
            iconContent = (
                <div
                    className="w-12 h-12 text-black dark:text-white [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
            );
        } else {
            const Icon = getIconForNode(typeStr, String(data.label), String(data.description), data.customIcon as string, customIcons) || styles.icon;
            iconContent = React.cloneElement(Icon as React.ReactElement<any>, { className: "w-12 h-12 text-black dark:text-white" });
        }
    } else {
        const Icon = getIconForNode(typeStr, String(data.label), String(data.description), data.customIcon as string, customIcons) || styles.icon;
        iconContent = React.cloneElement(Icon as React.ReactElement<any>, { className: "w-12 h-12 text-black dark:text-white" });
    }

    return (
        <SquareNode
            id={id}
            data={data}
            selected={selected}
            {...props}
            bgClass={styles.bgClass}
            borderClass={styles.borderClass}
            shapeClass={styles.shape}
        >
            <div className={`relative z-10 flex flex-col h-full items-center justify-center p-2`}>
                <div className="mb-3">
                    {iconContent}
                </div>
                <h3 className="text-sm font-bold leading-tight text-foreground w-full break-words whitespace-normal text-center">
                    <EditableLabel id={id} label={String(data.label)} className="text-center" />
                </h3>
                {data.description && (
                    <div className="text-[10px] text-muted-foreground mt-1 leading-snug w-full break-words whitespace-normal text-center">
                        <EditableLabel id={id} label={String(data.description)} field="description" className="text-center" />
                    </div>
                )}
            </div>
        </SquareNode>
    );
};

export default memo(ExternalNode);
