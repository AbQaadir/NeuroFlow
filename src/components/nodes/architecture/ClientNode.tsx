import React, { memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { CircleNode } from '../base/CircleNode';
import { getTypeStyles } from '../nodeStyles';
import { EditableLabel } from '../../common/EditableLabel';
import { useIconContext } from '../../../context/IconContext';
import { getIconForNode } from '../../../utils/iconMapper';

const ClientNode = ({ id, data, selected, ...props }: NodeProps) => {
    const { customIcons } = useIconContext();
    const typeStr = 'client';
    const styles = getTypeStyles(typeStr);

    // Icon Logic
    let iconContent;
    if (data.customIcon && typeof data.customIcon === 'string' && data.customIcon.startsWith('custom_')) {
        const svgContent = customIcons[data.customIcon];
        if (svgContent) {
            iconContent = (
                <div
                    className="w-16 h-16 text-black dark:text-white [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
            );
        } else {
            const Icon = getIconForNode(typeStr, String(data.label), String(data.description), data.customIcon as string, customIcons) || styles.icon;
            iconContent = React.cloneElement(Icon as React.ReactElement<any>, { className: "w-16 h-16 text-black dark:text-white" });
        }
    } else {
        const Icon = getIconForNode(typeStr, String(data.label), String(data.description), data.customIcon as string, customIcons) || styles.icon;
        iconContent = React.cloneElement(Icon as React.ReactElement<any>, { className: "w-16 h-16 text-black dark:text-white" });
    }

    return (
        <CircleNode
            id={id}
            data={data}
            selected={selected}
            {...props}
            bgClass={styles.bgClass}
            borderClass={styles.borderClass}
        >
            <div className="mb-2 flex-shrink-0">
                {iconContent}
            </div>
            <h3 className="text-sm font-bold leading-tight text-foreground w-full break-words whitespace-normal text-center">
                <EditableLabel id={id} label={String(data.label)} className="text-center" />
            </h3>
        </CircleNode>
    );
};

export default memo(ClientNode);
